import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { fetchChatbotData } from '../../Apis/api';
import { detectUserIntent } from '../../Apis/intentDetection';
import { getAIResponse } from '../../Apis/openaiService';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatbotData, setChatbotData] = useState({
    especialidades: [],
    clinicas: [],
    horarios: {}
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchChatbotData();
        setChatbotData(data);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };
    
    loadInitialData();
  }, []);

  // Mensaje de bienvenida
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: Date.now(),
        text: "¡Hola! Soy el asistente virtual de Health Connect. ¿En qué puedo ayudarte hoy?",
        isBot: true
      }]);
    }
  }, [isOpen, messages.length]);

  // Manejar envío de mensajes
 // Modificar la función handleSendMessage
const handleSendMessage = async (message) => {
  if (!message.trim() || isLoading) return;
  
  // Agregar mensaje del usuario
  const userMessage = {
    id: Date.now(),
    text: message,
    isBot: false
  };
  
  setMessages(prev => [...prev, userMessage]);
  setIsLoading(true);
  
  try {
    // Detectar intención
    const userIntent = detectUserIntent(message);
    
    // Llamar al backend en lugar de OpenAI directamente
    const response = await fetch('http://localhost:5002/api/chatbot/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messageHistory: messages.map(msg => ({
          role: msg.isBot ? 'assistant' : 'user',
          content: msg.text
        })),
        newMessage: message,
        intent: userIntent
      })
    });
    
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    
    const data = await response.json();
    
    // Agregar respuesta del bot
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: data.message,
      isBot: true
    }]);
  } catch (error) {
    console.error("Error:", error);
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: "Lo siento, estoy teniendo problemas para responder. Por favor, intenta de nuevo.",
      isBot: true
    }]);
  } finally {
    setIsLoading(false);
  }
};
  // Toggle chat abierto/cerrado
  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <button className="chatbot-button" onClick={toggleChat}>
          <span>¿Necesitas ayuda?</span> 💬
        </button>
      ) : (
        <div className="chatbot-window">
          <ChatHeader onClose={toggleChat} />
          <ChatMessages messages={messages} isLoading={isLoading} />
          <ChatInput onSendMessage={handleSendMessage} isDisabled={isLoading} />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
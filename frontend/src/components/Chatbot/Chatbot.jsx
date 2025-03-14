import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { fetchChatbotData } from '../../Apis/api';
import { detectUserIntent } from '../../Apis/intentDetection';
// Eliminar la importación de getAIResponse si no se usa
// import { getAIResponse } from '../../Apis/openaiService';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // Eliminar el estado no utilizado
  // const [chatbotData, setChatbotData] = useState({
  //   especialidades: [],
  //   clinicas: [],
  //   horarios: {}
  // });

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchChatbotData();
        // setChatbotData(data); // Eliminar si no se usa
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
      console.log("Intención detectada:", userIntent);
      
      // Preparar los mensajes anteriores para enviar al backend
      const messageHistory = messages.map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      }));
      
      // Llamar al backend
      const response = await fetch('http://localhost:5002/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageHistory,
          newMessage: message,
          intent: userIntent
        })
      });
      
      console.log("Respuesta del servidor:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({error: response.statusText}));
        console.error("Error del servidor:", errorData);
        throw new Error(`Error del servidor: ${errorData.error || response.statusText}`);
      }
      
      const data = await response.json();
      
      // Agregar respuesta del bot
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: data.message,
        isBot: true
      }]);
    } catch (error) {
      console.error("Error al procesar mensaje:", error);
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
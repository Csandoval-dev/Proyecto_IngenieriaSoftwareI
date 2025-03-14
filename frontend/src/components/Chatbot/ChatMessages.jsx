
import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

const ChatMessages = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);
  
  // Auto-scroll a último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chatbot-messages">
      {messages.map(msg => (
        <MessageBubble 
          key={msg.id} 
          text={msg.text} 
          isBot={msg.isBot} 
        />
      ))}
      
      {isLoading && (
        <div className="message bot-message typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default ChatMessages;
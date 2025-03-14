import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, isDisabled }) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = () => {
    if (inputMessage.trim() && !isDisabled) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="chatbot-input">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Escribe tu pregunta aquí..."
        onKeyPress={handleKeyPress}
        disabled={isDisabled}
      />
      <button 
        onClick={handleSubmit}
        disabled={isDisabled || !inputMessage.trim()}>
        Enviar
      </button>
    </div>
  );
};

export default ChatInput;
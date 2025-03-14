import React from 'react';

const ChatHeader = ({ onClose }) => {
  return (
    <div className="chatbot-header">
      <h3>Health Connect</h3>
      <button className="chatbot-close" onClick={onClose}>×</button>
    </div>
  );
};

export default ChatHeader;
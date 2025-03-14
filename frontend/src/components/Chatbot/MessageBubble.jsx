import React from 'react';

const MessageBubble = ({ text, isBot }) => {
  return (
    <div className={`message ${isBot ? 'bot-message' : 'user-message'}`}>
      {text}
    </div>
  );
};

export default MessageBubble;
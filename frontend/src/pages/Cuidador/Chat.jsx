// src/pages/Cuidador/Chat.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ChatBox from '../../components/cuidador/ChatBox';

const Chat = () => {
  const { solicitudId } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Chat con el cliente</h2>
      <ChatBox solicitudId={solicitudId} />
    </div>
  );
};

export default Chat;

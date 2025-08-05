import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import {
  startConnection,
  onReceiveMessage,
  sendMessage,
  validateCommunication,
  stopConnection
} from '../../services/signalr';

const ChatView = ({ otherUserId, solicitudId }) => {
  const { token, user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [canChat, setCanChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const setupConnection = async () => {
      await startConnection(token);
      setConnected(true);

      const validation = await validateCommunication(solicitudId);
      if (validation?.canCommunicate) {
        setCanChat(true);
      } else {
        console.warn(validation?.message || 'No autorizado para chatear.');
      }
    };

    setupConnection();

    return () => {
      stopConnection();
    };
  }, [token, solicitudId]);

  useEffect(() => {
    if (!connected) return;
    onReceiveMessage(msg => {
      setMessages(prev => [...prev, msg]);
    });
  }, [connected]);

  const handleSend = async () => {
    if (!content.trim()) return;
    await sendMessage({
      receiverID: otherUserId,
      content,
      messageType: 'Text',
      solicitudID: solicitudId
    });
    setContent('');
  };

  if (!canChat) return <p>No tienes permiso para chatear en esta solicitud.</p>;

  return (
    <div>
      <h3>Chat con usuario {otherUserId}</h3>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={m.senderID === user.id ? 'message-sent' : 'message-received'}>
            <p>{m.content}</p>
            <span>{new Date(m.timestamp).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Escribe un mensaje..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
};

export default ChatView;

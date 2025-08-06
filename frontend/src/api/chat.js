import axios from 'axios';

const CHAT_API = import.meta.env.VITE_API_CHAT || 'http://localhost:5011';

export const getConversacion = async (solicitudId) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${CHAT_API}/api/chat/conversation/${solicitudId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const enviarMensaje = async (solicitudId, content) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${CHAT_API}/api/chat/send`, {
    solicitudID: solicitudId,
    content,
    messageType: 'Text',
    // ⚠️ necesitas receiverID correcto
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

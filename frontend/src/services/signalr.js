import * as signalR from '@microsoft/signalr';

let connection = null;

export const startConnection = (token) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_CHAT_HUB_URL}?access_token=${token}`)
    .withAutomaticReconnect()
    .build();

  return connection.start()
    .then(() => console.log('Conectado al ChatHub'))
    .catch(err => console.error('Error al conectar al ChatHub:', err));
};

export const onReceiveMessage = (callback) => {
  if (!connection) return;
  connection.on('ReceiveMessage', callback);
};

export const sendMessage = (message) => {
  if (!connection) return;
  return connection.invoke('SendMessage', message);
};

export const validateCommunication = (solicitudId) => {
  if (!connection) return;
  return connection.invoke('ValidateCommunication', { solicitudID: solicitudId });
};

export const stopConnection = () => {
  if (connection) {
    connection.stop();
    connection = null;
  }
};

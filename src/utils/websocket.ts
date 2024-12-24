import { io, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '../types/chat';

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001';

export const createWebSocketConnection = (): Socket<ServerToClientEvents, ClientToServerEvents> => {
  const socket = io(WEBSOCKET_URL, {
    transports: ['websocket'],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
    if (reason === 'io server disconnect') {
      socket.connect();
    }
  });

  return socket;
};

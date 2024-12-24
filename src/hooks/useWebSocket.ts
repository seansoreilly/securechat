import { useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import type { Message, ServerToClientEvents, ClientToServerEvents } from '../types/chat';
import { createWebSocketConnection } from '../utils/websocket';

interface UseWebSocketProps {
  roomId: string;
  onMessageReceived: (message: Message) => void;
  onParticipantJoined: (participant: string) => void;
  onParticipantLeft: (participant: string) => void;
  onTyping: (participant: string) => void;
}

export const useWebSocket = ({
  roomId,
  onMessageReceived,
  onParticipantJoined,
  onParticipantLeft,
  onTyping,
}: UseWebSocketProps) => {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>();

  useEffect(() => {
    socketRef.current = createWebSocketConnection();
    const socket = socketRef.current;

    socket.connect();
    socket.emit('joinRoom', roomId, socket.id);

    socket.on('messageReceived', onMessageReceived);
    socket.on('participantJoined', onParticipantJoined);
    socket.on('participantLeft', onParticipantLeft);
    socket.on('typing', onTyping);

    return () => {
      if (socket) {
        socket.emit('leaveRoom', roomId, socket.id);
        socket.disconnect();
      }
    };
  }, [roomId]);

  const sendMessage = useCallback((message: Message) => {
    if (socketRef.current) {
      socketRef.current.emit('sendMessage', message);
    }
  }, []);

  const sendTyping = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('startTyping', roomId, socketRef.current.id);
    }
  }, [roomId]);

  return {
    sendMessage,
    sendTyping,
  };
};

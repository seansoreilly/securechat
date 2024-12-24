import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import type { Message } from './src/types/chat';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const rooms = new Map<string, Set<string>>();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinRoom', (roomId: string, participant: string) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId)?.add(participant);
    io.to(roomId).emit('participantJoined', participant);
  });

  socket.on('leaveRoom', (roomId: string, participant: string) => {
    socket.leave(roomId);
    rooms.get(roomId)?.delete(participant);
    io.to(roomId).emit('participantLeft', participant);
  });

  socket.on('sendMessage', (message: Message) => {
    io.to(message.sender).emit('messageReceived', message);
  });

  socket.on('startTyping', (roomId: string, participant: string) => {
    socket.to(roomId).emit('typing', participant);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    rooms.forEach((participants, roomId) => {
      if (participants.has(socket.id)) {
        participants.delete(socket.id);
        io.to(roomId).emit('participantLeft', socket.id);
      }
    });
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

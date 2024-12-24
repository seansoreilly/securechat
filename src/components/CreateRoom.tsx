import React from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRoomId } from '../utils/uuid';

export const CreateRoom: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const roomId = generateRoomId();
    navigate(`/securechat/${roomId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 space-y-6 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Secure Chat</h1>
        <p className="text-center text-muted-foreground">
          Create an instant, private chat room with end-to-end encryption.
          No registration required.
        </p>
        <button
          onClick={handleCreateRoom}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Create New Room
        </button>
      </div>
    </div>
  );
};

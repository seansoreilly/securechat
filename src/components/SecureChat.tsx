import React, { useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { useWebSocket } from '../hooks/useWebSocket';
import { useChatRoom } from '../hooks/useChatRoom';
import { isValidUUID } from '../utils/uuid';
import type { Message } from '../types/chat';

export const SecureChat: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const userId = useRef(uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!roomId || !isValidUUID(roomId)) {
    return <Navigate to="/securechat" replace />;
  }

  const {
    messages,
    participants,
    typingUsers,
    addMessage,
    addParticipant,
    removeParticipant,
    setUserTyping,
  } = useChatRoom(roomId);

  const { sendMessage, sendTyping } = useWebSocket({
    roomId,
    onMessageReceived: addMessage,
    onParticipantJoined: addParticipant,
    onParticipantLeft: removeParticipant,
    onTyping: setUserTyping,
  });

  const handleSendMessage = (text: string) => {
    const message: Message = {
      id: uuidv4(),
      text,
      sender: userId.current,
      timestamp: new Date().toISOString(),
    };
    sendMessage(message);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="p-4 border-b">
        <h1 className="text-lg font-semibold">Secure Chat Room</h1>
        <div className="text-sm text-muted-foreground">
          {participants.length} participant(s) online
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.sender === userId.current}
            />
          ))}
          {typingUsers.length > 0 && (
            <div className="text-sm text-muted-foreground italic">
              {typingUsers.length === 1
                ? 'Someone is typing...'
                : 'Multiple people are typing...'}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput onSendMessage={handleSendMessage} onTyping={sendTyping} />
    </div>
  );
};

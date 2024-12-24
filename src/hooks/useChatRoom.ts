import { useState, useCallback } from 'react';
import type { Message } from '../types/chat';

export const useChatRoom = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const addParticipant = useCallback((participant: string) => {
    setParticipants((prev) => {
      if (!prev.includes(participant)) {
        return [...prev, participant];
      }
      return prev;
    });
  }, []);

  const removeParticipant = useCallback((participant: string) => {
    setParticipants((prev) => prev.filter((p) => p !== participant));
  }, []);

  const setUserTyping = useCallback((participant: string) => {
    setTypingUsers((prev) => {
      if (!prev.includes(participant)) {
        return [...prev, participant];
      }
      return prev;
    });

    // Remove typing indicator after 3 seconds
    setTimeout(() => {
      setTypingUsers((prev) => prev.filter((p) => p !== participant));
    }, 3000);
  }, []);

  return {
    messages,
    participants,
    typingUsers,
    addMessage,
    addParticipant,
    removeParticipant,
    setUserTyping,
  };
};

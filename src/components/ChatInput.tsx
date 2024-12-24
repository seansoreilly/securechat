import React, { useState, useCallback } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onTyping: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  }, [message, onSendMessage]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    onTyping();
  }, [onTyping]);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};

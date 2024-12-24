export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
}

export interface ChatRoom {
  id: string;
  messages: Message[];
  participants: string[];
}

export interface WebSocketEvent {
  type: 'message' | 'typing' | 'join' | 'leave';
  payload: any;
}

export interface ServerToClientEvents {
  messageReceived: (message: Message) => void;
  participantJoined: (participant: string) => void;
  participantLeft: (participant: string) => void;
  typing: (participant: string) => void;
}

export interface ClientToServerEvents {
  sendMessage: (message: Message) => void;
  joinRoom: (roomId: string, participant: string) => void;
  leaveRoom: (roomId: string, participant: string) => void;
  startTyping: (roomId: string, participant: string) => void;
}

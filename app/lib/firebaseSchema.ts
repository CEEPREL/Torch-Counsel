export type User = {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: number;
};

export type PartnerProfile = {
  userId: string;
  personality: {
    testResults?: unknown;
    loveLanguages?: string[];
    conflictPatterns?: string[];
    longTermValues?: string[];
    preferences?: string[];
    goals?: string[];
    significantDates?: string[];
    giftPatterns?: string[];
  };
  createdAt: number;
};

export type Message = {
  id?: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: number;
  type?: "text" | "image";
  status?: "sent" | "delivered" | "read";
};

export const Collections = {
  users: "users",
  partnerProfiles: "partnerProfiles",
  messages: "messages",
  chatMessages: "chatMessages",
  chatSessions: "chatSessions",
};

export {
  sendMessage,
  getChatMessages,
  getUserMessages,
  onChatMessagesSnapshot,
} from "../api/chat/main.chat";

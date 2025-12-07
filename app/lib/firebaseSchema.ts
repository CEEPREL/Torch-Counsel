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
    testResults?: any;
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
  from: string;
  to: string;
  text: string;
  createdAt: number;
};

export const Collections = {
  users: "users",
  partnerProfiles: "partnerProfiles",
  messages: "messages",
};

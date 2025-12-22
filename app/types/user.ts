export type AppUser = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "user" | "admin";
  createdAt: number;

  gender?: "male" | "female";
  avatar?: string;
  persona?: string;

  // relationship linking
  coupleCode: string;
  partnerId?: string;

  // personal relationship traits
  loveLanguages?: string[];
  personality?: string;
  values?: string[];
  keyIssues?: string[];
  giftPatterns?: string[];
  goals?: string[];

  significantDates?: SignificantDate[];

  // AI memory bucket
  context?: string[];
};

export type SignificantDate = {
  date: string;
  event: string;
};

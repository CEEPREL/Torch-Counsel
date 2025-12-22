export type CoupleProfile = {
  coupleCode: string;

  members: string[]; // array of user ids
  hostId: string; // who created the couple

  status: "talking" | "dating" | "engaged" | "married";

  createdAt: number;
  updatedAt?: number;

  // chat + AI coordination
  activeSessionId?: string;
};

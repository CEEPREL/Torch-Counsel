import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as limitFn,
} from "firebase/firestore";
import { clientDb } from "@/app/lib/firebaseClient";
import { Collections } from "@/app/lib/firebaseSchema";
import type { ChatMessage } from "@/app/types/chat";
import type {
  ChatSession,
  RelationshipStage,
  SessionContext,
} from "@/app/types/session";
import type { AppUser } from "@/app/types/user";
import { startSessionContext } from "./startSession";

const chatMessagesCol = collection(clientDb, Collections.chatMessages);
const chatSessionsCol = collection(clientDb, Collections.chatSessions);

export async function saveChatMessage(message: ChatMessage): Promise<void> {
  await setDoc(doc(chatMessagesCol, message.id), message);
}

export async function getRecentMessages(
  sessionId: string,
  max: number = 50
): Promise<ChatMessage[]> {
  const q = query(
    chatMessagesCol,
    where("sessionId", "==", sessionId),
    orderBy("createdAt", "asc"),
    limitFn(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as ChatMessage);
}

export async function getAllMessages(
  sessionId: string
): Promise<ChatMessage[]> {
  const q = query(
    chatMessagesCol,
    where("sessionId", "==", sessionId),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as ChatMessage);
}

export async function getSessionById(
  sessionId: string
): Promise<ChatSession | null> {
  const ref = doc(chatSessionsCol, sessionId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as ChatSession) : null;
}

export async function updateSession(
  sessionId: string,
  updates: Partial<ChatSession>
): Promise<void> {
  const ref = doc(chatSessionsCol, sessionId);
  const existing = await getDoc(ref);
  const base = existing.exists() ? existing.data() : {};
  await setDoc(ref, { ...base, ...updates }, { merge: true });
}

async function getUserById(userId: string): Promise<AppUser | null> {
  const ref = doc(clientDb, Collections.users, userId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as AppUser) : null;
}

async function getPastSessions(
  coupleCode: string,
  max: number = 10
): Promise<ChatSession[]> {
  const q = query(
    chatSessionsCol,
    where("coupleCode", "==", coupleCode),
    orderBy("createdAt", "desc"),
    limitFn(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as ChatSession);
}

export async function getSessionContext(
  sessionId: string
): Promise<SessionContext> {
  const session = await getSessionById(sessionId);
  if (!session) {
    return {
      self: { id: "unknown" },
      relationship: {
        coupleCode: "unknown",
        isMarried: false,
        stage: "talking" as RelationshipStage,
      },
      memory: { relevantSummaries: [] },
    } as SessionContext;
  }
  const user = await getUserById(session.startedBy);
  const partner = user?.partnerId
    ? (await getUserById(user.partnerId)) ?? undefined
    : undefined;
  const pastSessions = (await getPastSessions(session.coupleCode)).filter(
    (s) => s.id !== session.id
  );
  return startSessionContext({
    user:
      user ??
      ({
        id: session.startedBy,
        email: "",
        name: "",
        role: "user",
        createdAt: Date.now(),
        coupleCode: session.coupleCode,
      } as AppUser),
    partner,
    couple: {
      coupleCode: session.coupleCode,
      isMarried: false,
      stage: session.mode as RelationshipStage,
    },
    pastSessions,
  });
}

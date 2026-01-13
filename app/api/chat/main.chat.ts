import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit as limitFn,
  startAfter,
  endBefore,
  QueryConstraint,
} from "firebase/firestore";
import { clientDb } from "../../lib/firebaseClient";
import { Collections, Message } from "../../lib/firebaseSchema";

const messagesCol = collection(clientDb, Collections.messages);

export async function sendMessage(
  payload: Omit<Message, "id" | "createdAt"> & { createdAt?: number }
): Promise<Message> {
  const data = { ...payload, createdAt: payload.createdAt ?? Date.now() };
  const ref = await addDoc(messagesCol, data);
  return { id: ref.id, ...data };
}

export async function getChatMessages(params: {
  chatId: string;
  limit?: number;
  afterCreatedAt?: number;
  beforeCreatedAt?: number;
  senderId?: string;
  order?: "asc" | "desc";
}): Promise<Message[]> {
  const {
    chatId,
    limit = 50,
    afterCreatedAt,
    beforeCreatedAt,
    senderId,
    order = "asc",
  } = params;
  const constraints: QueryConstraint[] = [
    where("chatId", "==", chatId),
    orderBy("createdAt", order),
    limitFn(limit),
  ];
  if (senderId) constraints.unshift(where("senderId", "==", senderId));
  if (typeof afterCreatedAt === "number")
    constraints.push(startAfter(afterCreatedAt));
  if (typeof beforeCreatedAt === "number")
    constraints.push(endBefore(beforeCreatedAt));
  const q = query(messagesCol, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Message, "id">),
  }));
}

export async function getUserMessages(params: {
  userId: string;
  chatId?: string;
  limit?: number;
  order?: "asc" | "desc";
}): Promise<Message[]> {
  const { userId, chatId, limit = 50, order = "desc" } = params;
  const constraints: QueryConstraint[] = [
    where("senderId", "==", userId),
    orderBy("createdAt", order),
    limitFn(limit),
  ];
  if (chatId) constraints.unshift(where("chatId", "==", chatId));
  const q = query(messagesCol, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Message, "id">),
  }));
}

export function onChatMessagesSnapshot(params: {
  chatId: string;
  limit?: number;
  senderId?: string;
  order?: "asc" | "desc";
  onChange: (change: {
    type: "added" | "modified" | "removed";
    message: Message;
  }) => void;
}) {
  const { chatId, limit = 50, senderId, order = "asc", onChange } = params;
  const constraints: QueryConstraint[] = [
    where("chatId", "==", chatId),
    orderBy("createdAt", order),
    limitFn(limit),
  ];
  if (senderId) constraints.unshift(where("senderId", "==", senderId));
  const q = query(messagesCol, ...constraints);
  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((c) => {
      const message = {
        id: c.doc.id,
        ...(c.doc.data() as Omit<Message, "id">),
      };
      onChange({ type: c.type, message });
    });
  });
}

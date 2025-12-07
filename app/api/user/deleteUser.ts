import type { NextApiRequest, NextApiResponse } from "next";
import { deleteDoc, doc } from "firebase/firestore";
import { clientDb } from "@/app/lib/firebaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") return res.status(405).end();

  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: "Missing UID" });

  try {
    await deleteDoc(doc(clientDb, "users", uid));
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

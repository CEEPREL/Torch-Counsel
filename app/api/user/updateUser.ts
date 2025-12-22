import type { NextApiRequest, NextApiResponse } from "next";
import { doc, updateDoc } from "firebase/firestore";
import { clientDb } from "@/app/lib/firebaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") return res.status(405).end();

  const { uid, updates } = req.body;
  if (!uid || !updates)
    return res.status(400).json({ error: "Missing UID or updates" });

  try {
    await updateDoc(doc(clientDb, "users", uid), updates);
    res.status(200).json({ message: "User updated successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

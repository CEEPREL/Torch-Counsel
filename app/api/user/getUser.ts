import type { NextApiRequest, NextApiResponse } from "next";
import { doc, getDoc } from "firebase/firestore";
import { clientDb } from "@/app/lib/firebaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: "Missing UID" });

  try {
    const userDoc = await getDoc(doc(clientDb, "users", uid as string));
    if (!userDoc.exists())
      return res.status(404).json({ error: "User not found" });

    res.status(200).json(userDoc.data());
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

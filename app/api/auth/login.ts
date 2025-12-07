import type { NextApiRequest, NextApiResponse } from "next";
import { signInWithEmailAndPassword } from "firebase/auth";
import { clientAuth } from "@/app/lib/firebaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(
      clientAuth,
      email,
      password
    );
    const user = userCredential.user;
    res.status(200).json({ uid: user.uid, email: user.email });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

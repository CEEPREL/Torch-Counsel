import { AppUser } from "@/app/types/user";
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, name } = req.body;

  try {
    const createUserRes = await fetch(`api/createUser/route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data: { user: AppUser } = await createUserRes.json();
    if (!createUserRes.ok) return res.status(400).json(data);

    // Return created user info
    res
      .status(200)
      .json({
        uid: data.user.partnerId,
        email: data.user.email,
        name: data.user.name,
      });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

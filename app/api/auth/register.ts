import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, name } = req.body;

  try {
    // Call the existing createUser route
    const createUserRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/createUser/route`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      }
    );

    const data = await createUserRes.json();
    if (!createUserRes.ok) return res.status(400).json(data);

    // Return created user info
    res.status(200).json({ uid: data.uid, email: data.email, name });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

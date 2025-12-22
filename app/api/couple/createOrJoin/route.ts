import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebaseAdmin";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { partnerId, coupleCode } = body;

  let finalCode = coupleCode;

  if (!finalCode) {
    finalCode = nanoid(6).toUpperCase();
    await adminDb
      .collection("couples")
      .doc(finalCode)
      .set({ createdAt: new Date() });
  } else {
    const coupleDoc = await adminDb.collection("couples").doc(finalCode).get();
    if (!coupleDoc.exists)
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  await adminDb
    .collection("couples")
    .doc(finalCode)
    .collection("partners")
    .doc(partnerId)
    .set({ joinedAt: new Date() });

  return NextResponse.json({ coupleCode: finalCode });
}

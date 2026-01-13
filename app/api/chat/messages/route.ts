import { NextRequest, NextResponse } from "next/server";
import { getRecentMessages } from "../store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const limitStr = searchParams.get("limit");
  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: "Missing sessionId" },
      { status: 400 }
    );
  }
  const limit = limitStr ? parseInt(limitStr, 10) : 50;
  try {
    const messages = await getRecentMessages(sessionId, limit);
    return NextResponse.json({ ok: true, messages });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

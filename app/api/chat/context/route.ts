import { NextRequest, NextResponse } from "next/server";
import { getSessionContext } from "../store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: "Missing sessionId" },
      { status: 400 }
    );
  }
  try {
    const context = await getSessionContext(sessionId);
    return NextResponse.json({ ok: true, context });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

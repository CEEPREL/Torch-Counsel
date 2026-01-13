import { NextRequest, NextResponse } from "next/server";
import { handleIncomingMessageHTTP } from "../incomingMsg";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { message, aiMessage } = await handleIncomingMessageHTTP(payload);
    return NextResponse.json({ ok: true, message, aiMessage });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

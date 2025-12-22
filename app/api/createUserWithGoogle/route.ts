import { adminAuth, adminDb } from "@/app/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { AppUser } from "@/app/types/user";

export async function POST(req: NextRequest) {
  try {
    const { idToken, role } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "Missing Google ID token" },
        { status: 400 }
      );
    }

    // Verify the Google Firebase ID token
    const decoded = await adminAuth.verifyIdToken(idToken);

    const { uid, email, name, picture } = decoded;

    // Check if user already exists
    const userRef = adminDb.collection("users").doc(uid);
    const existing = await userRef.get();

    if (existing.exists) {
      return NextResponse.json({ user: existing.data() }, { status: 200 });
    }

    // New Google user
    const userData: AppUser = {
      id: uid,
      coupleCode: "",
      email: email || "",
      name: name || "",
      avatar: picture || "",
      role: role || "user",
      createdAt: Date.now(),
    };

    await userRef.set(userData);

    return NextResponse.json({ user: userData }, { status: 201 });
  } catch (err: any) {
    console.log("Google signup error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

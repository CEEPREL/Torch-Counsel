import { adminAuth, adminDb } from "@/app/lib/firebaseAdmin";
import { AppUser } from "@/app/types/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // create Auth user
    const authUser = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    const userData: AppUser = {
      id: authUser.uid,
      coupleCode: "",
      email,
      name,
      role: role || "user",
      createdAt: Date.now(),
    };

    // save user document
    await adminDb.collection("users").doc(authUser.uid).set(userData);

    return NextResponse.json({ user: userData }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

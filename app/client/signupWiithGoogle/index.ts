import { clientAuth } from "@/app/lib/firebaseClient";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(clientAuth, provider);
  const idToken = await result.user.getIdToken();

  const res = await fetch("/api/createUserWithGoogle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  return res.json();
}

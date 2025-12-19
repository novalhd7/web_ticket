"use server";
type FormState = { message: string } | null;

import { signIn as nextAuthSignIn } from "next-auth/react";

export async function signInCredentials(
  _: FormState, // state tidak dipakai
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // NextAuth v4 signIn dengan redirect false untuk dapat response
  const result = await nextAuthSignIn("credentials", {
    redirect: false,
    email,
    password,
  });

  if (result?.error) {
    return { message: result.error }; // misal INVALID_CREDENTIALS
  }

  // sukses → null
  return null;
}

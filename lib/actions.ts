"use server";

import { RegisterScema } from "@/lib/zod";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";

export type RegisterState = {
  error?: {
    nama?: string[];
    email?: string[];
    password?: string[];
    ConfirmPassword?: string[];
  };
  message?: string;
};

export async function signUpCredentials(
  state: RegisterState | null,
  formData: FormData
): Promise<RegisterState | null> {
  const validated = RegisterScema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validated.success) {
    return {
      error: validated.error.flatten().fieldErrors,
    };
  }

  const { nama, email, password } = validated.data;

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    return {
      error: {
        email: ["Email sudah terdaftar"],
      },
    };
  }

  const hashed = await hash(password, 10);

  const token = randomUUID();

  await prisma.user.create({
    data: {
      name: nama,
      email,
      password: hashed,
      isActive: false,
      activationToken: token,
    },
  });

  // TODO: replace with real email sending. For now log activation link.
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  console.log(`Activation link: ${base}/api/auth/activate?token=${token}`);

  return {
    message:
      "Akun dibuat. Periksa email untuk aktivasi (console log saat development).",
  };
}

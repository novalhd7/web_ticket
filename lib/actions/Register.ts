"use server";
import prisma from "@/lib/prisma";
import { RegisterScema } from "@/lib/zod";
import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import { sendActivationEmail } from "@/lib/mailer";

export type FormState =
  | { message: string }
  | { error: Record<string, string[]> }
  | null;

export async function signUpCredentials(
  _: FormState, // state, tidak dipakai
  formData: FormData // payload
): Promise<FormState> {
  const validated = RegisterScema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  const { nama, email, password, ConfirmPassword } = validated.data;

  if (password !== ConfirmPassword) {
    return { error: { ConfirmPassword: ["Password tidak cocok"] } };
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { message: "Email sudah terdaftar" };

  const token = randomUUID();

  await prisma.user.create({
    data: {
      name: nama,
      email,
      password: await hash(password, 10),
      activationToken: token,
      isActive: false,
    },
  });

  await sendActivationEmail(email, token);

  return { message: "Akun dibuat. Cek email untuk aktivasi." };
}

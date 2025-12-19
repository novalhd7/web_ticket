"use server";

import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { sendActivationEmail } from "@/lib/mailer";

export async function resendActivation(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { message: "Email wajib diisi" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { message: "Email tidak terdaftar" };
  }

  if (user.isActive) {
    return { message: "Akun sudah aktif" };
  }

  const token = randomUUID();

  await prisma.user.update({
    where: { id: user.id },
    data: { activationToken: token },
  });

  await sendActivationEmail(email, token);

  return { success: "Email aktivasi berhasil dikirim ulang" };
}

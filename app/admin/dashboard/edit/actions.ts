"use server";

import prisma from "@/lib/prisma";
import { carSchema } from "@/lib/zod";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateCar(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const data = {
    name: formData.get("name"),
    capacity: formData.get("capacity"),
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl"),
  };

  const parsed = carSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const oldCar = await prisma.car.findUnique({ where: { id } });
  if (!oldCar) throw new Error("Car not found");

  // 🔥 delete image lama kalau diganti
  if (oldCar.imageUrl !== parsed.data.imageUrl) {
    await del(oldCar.imageUrl);
  }

  await prisma.car.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/admin/dashboard");
}

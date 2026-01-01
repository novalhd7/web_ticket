"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { del } from "@vercel/blob";

export async function deleteCar(carId: string) {
  // 🔐 Auth
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // ambil imageUrl dulu
  const car = await prisma.car.findUnique({
    where: { id: carId },
    select: { imageUrl: true },
  });

  if (!car) {
    throw new Error("Car not found");
  }

  // 🔥 delete image di blob
  if (car.imageUrl) {
    await del(car.imageUrl);
  }

  // 🗑️ delete data
  await prisma.car.delete({
    where: { id: carId },
  });

  revalidatePath("/admin/dashboard");
}

"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createCar(formData: FormData) {
  // 🔐 Auth check (ADMIN ONLY)
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const capacity = Number(formData.get("capacity"));
  const price = Number(formData.get("price"));
  const imageUrl = formData.get("imageUrl") as string;

  if (!name || !capacity || !price || !imageUrl) {
    throw new Error("All fields required");
  }

  await prisma.car.create({
    data: {
      name,
      capacity,
      price,
      imageUrl,
    },
  });

  revalidatePath("/admin/dashboard");
}

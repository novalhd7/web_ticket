"use server";

import prisma from "@/lib/prisma";
import { scheduleSchema } from "@/lib/zod";

export async function createSchedule(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = scheduleSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const car = await prisma.car.findUnique({
    where: { id: parsed.data.carId },
  });

  if (!car) throw new Error("Mobil tidak ditemukan");

  await prisma.schedule.create({
    data: {
      carId: car.id,
      date: new Date(parsed.data.date),
      time: parsed.data.time,
      origin: parsed.data.origin,
      destination: parsed.data.destination,
      availableSeats: car.capacity,
    },
  });
}

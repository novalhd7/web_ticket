"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { schema } from "@/lib/zod";

type ActionResult = { success: true } | { success: false; message: string };

class NotEnoughSeatsError extends Error {
  constructor() {
    super("NOT_ENOUGH_SEATS");
  }
}

export async function createBooking(formData: FormData): Promise<ActionResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, message: "Silakan login dulu" };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const schedule = await tx.schedule.findUnique({
        where: { id: parsed.data.scheduleId },
        select: { availableSeats: true },
      });

      if (!schedule || schedule.availableSeats < parsed.data.seats) {
        throw new NotEnoughSeatsError();
      }

      await tx.booking.create({
        data: {
          userId: session.user.id,
          scheduleId: parsed.data.scheduleId,
          seats: parsed.data.seats,
          phone: parsed.data.phone,
          paymentMethod: parsed.data.paymentMethod,
          status: "PENDING",
        },
      });

      await tx.schedule.update({
        where: { id: parsed.data.scheduleId },
        data: {
          availableSeats: {
            decrement: parsed.data.seats,
          },
        },
      });
    });

    return { success: true };
  } catch (err) {
    if (err instanceof NotEnoughSeatsError) {
      return { success: false, message: "Kursi tidak mencukupi" };
    }

    console.error("[CREATE_BOOKING_ERROR]", err);
    return { success: false, message: "Terjadi kesalahan server" };
  }
}

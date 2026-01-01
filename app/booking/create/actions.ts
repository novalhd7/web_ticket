"use server";

import { snap } from "@/lib/midtrans";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { bookingSchema } from "@/lib/zod";
import type { SnapTransactionWithCustomer } from "@/lib/midtrans-types";

export async function createBooking(formData: FormData) {
  // 1️⃣ Session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // 2️⃣ Validasi input
  const parsed = bookingSchema.parse(Object.fromEntries(formData));

  // 3️⃣ Ambil schedule + car
  const schedule = await prisma.schedule.findUnique({
    where: { id: parsed.scheduleId },
    include: {
      car: true,
    },
  });

  if (!schedule) {
    throw new Error("Jadwal tidak ditemukan");
  }

  if (schedule.availableSeats < parsed.seats) {
    throw new Error("Kursi tidak cukup");
  }

  // 4️⃣ Buat booking
  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      scheduleId: schedule.id,
      seats: parsed.seats,
      phone: parsed.phone,
      paymentMethod: parsed.paymentMethod,
      status: "PENDING",
    },
  });

  // 5️⃣ Kurangi kursi
  await prisma.schedule.update({
    where: { id: schedule.id },
    data: {
      availableSeats: {
        decrement: parsed.seats,
      },
    },
  });

  // 6️⃣ Jika CASH → selesai
  if (parsed.paymentMethod === "CASH") {
    return { success: true };
  }

  // 7️⃣ MIDTRANS
  const grossAmount = schedule.car.price * parsed.seats;

  const payload: SnapTransactionWithCustomer = {
    transaction_details: {
      order_id: booking.id,
      gross_amount: grossAmount,
    },
    customer_details: {
      phone: parsed.phone,
    },
  };

  const { token } = await snap.createTransaction(payload);

  return {
    snapToken: token,
  };
}

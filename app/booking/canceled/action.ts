"use server";

import prisma from "@/lib/prisma";
import { getMidtransTransaction } from "@/lib/midtrans-transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function cancelBooking(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    throw new Error("Booking tidak ditemukan");
  }

  if (booking.userId !== session.user.id) {
    throw new Error("Tidak punya akses");
  }

  // If already cancelled, treat as idempotent and return success
  if (booking.status === "CANCELLED") {
    return { success: true, message: "Booking sudah dibatalkan" };
  }

  // ❌ Tidak boleh dibatalkan jika sudah sukses
  if (booking.status === "CONFIRMED" || booking.status === "COMPLETED") {
    throw new Error("Booking tidak dapat dibatalkan");
  }

  const midtransTransaction = getMidtransTransaction();

  await prisma.$transaction(async (tx) => {
    // 🔴 Cancel transaksi Midtrans (jika pakai Midtrans)
    if (booking.paymentMethod === "MIDTRANS") {
      await midtransTransaction.cancel(booking.id);
    }

    // 🔁 Kembalikan kursi
    await tx.schedule.update({
      where: { id: booking.scheduleId },
      data: {
        availableSeats: {
          increment: booking.seats,
        },
      },
    });

    // ❌ Update status booking
    await tx.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });
  });

  return { success: true };
}

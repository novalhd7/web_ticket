"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: { user: true, schedule: true },
  });

  // Send WhatsApp notification via Twilio if configured
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const fromEnv = process.env.TWILIO_WHATSAPP_FROM; // e.g. '+1234567890' or 'whatsapp:+1234567890'
  const from = fromEnv
    ? fromEnv.startsWith("whatsapp:")
      ? fromEnv
      : `whatsapp:${fromEnv}`
    : undefined;

  if (sid && token && from && booking.user?.phone) {
    const to = booking.user.phone.startsWith("whatsapp:")
      ? booking.user.phone
      : `whatsapp:${booking.user.phone}`;

    const scheduleLabel = `${booking.schedule.origin} → ${
      booking.schedule.destination
    } on ${
      booking.schedule.date instanceof Date
        ? booking.schedule.date.toLocaleDateString()
        : new Date(booking.schedule.date).toLocaleDateString()
    } ${booking.schedule.time}`;

    const body = `Halo ${
      booking.user.name ?? booking.user.email ?? ""
    }, status booking Anda (${
      booking.id
    }) untuk ${scheduleLabel} telah diubah menjadi ${booking.status}.`;

    try {
      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
          },
          body: new URLSearchParams({
            To: to,
            From: from,
            Body: body,
          }).toString(),
        }
      );
    } catch (err) {
      console.error("Failed to send WhatsApp notification", err);
    }
  } else {
    // Twilio not configured or user phone missing — log which flag is missing (no secrets)
    console.log("WA notification skipped:", {
      twilioSid: !!sid,
      twilioToken: !!token,
      twilioFrom: !!fromEnv,
      userPhone: !!booking.user?.phone,
    });
  }

  return booking;
}

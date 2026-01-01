import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.json();

  const { order_id, transaction_status, signature_key } = body;

  // 🔐 Validasi signature
  const expectedSignature = crypto
    .createHash("sha512")
    .update(
      order_id +
        body.status_code +
        body.gross_amount +
        process.env.MIDTRANS_SERVER_KEY
    )
    .digest("hex");

  if (signature_key !== expectedSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
  }

  // ✅ Jika pembayaran sukses
  if (transaction_status === "settlement" || transaction_status === "capture") {
    await prisma.booking.update({
      where: { id: order_id },
      data: {
        status: "CONFIRMED",
      },
    });
  }

  // ❌ Jika gagal
  if (transaction_status === "cancel" || transaction_status === "expire") {
    await prisma.booking.update({
      where: { id: order_id },
      data: {
        status: "CANCELLED",
      },
    });
  }

  return NextResponse.json({ received: true });
}

"use client";

import { createBooking } from "@/app/booking/create/actions";
import { toast } from "sonner";

export default function BookingForm({ scheduleId }: { scheduleId: string }) {
  async function handleSubmit(formData: FormData) {
    try {
      const res = await createBooking(formData);

      if (res?.snapToken) {
        // 🔥 Midtrans popup
        window.snap.pay(res.snapToken, {
          onSuccess: () => toast.success("Pembayaran berhasil"),
          onPending: () => toast("Menunggu pembayaran"),
          onError: () => toast.error("Pembayaran gagal"),
          onClose: () => toast("Pembayaran dibatalkan"),
        });
      } else {
        toast.success("Booking berhasil (Bayar di tempat)");
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Terjadi kesalahan");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="scheduleId" value={scheduleId} />

      <input
        name="phone"
        placeholder="Nomor WhatsApp"
        required
        className="border p-2 w-full"
      />

      <input
        type="number"
        name="seats"
        min={1}
        required
        className="border p-2 w-full"
        placeholder="Jumlah kursi"
      />

      <select name="paymentMethod" className="border p-2 w-full">
        <option value="CASH">Bayar di Tempat</option>
        <option value="MIDTRANS">Transfer / E-Wallet</option>
      </select>

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Booking Sekarang
      </button>
    </form>
  );
}

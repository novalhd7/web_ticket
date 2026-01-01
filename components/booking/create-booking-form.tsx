"use client";

import { useState } from "react";
import { createBooking } from "@/app/booking/create/actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Props = {
  scheduleId: string;
  maxSeats: number;
  price?: number;
};

export default function CreateBookingForm({
  scheduleId,
  maxSeats,
  price = 0,
}: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "MIDTRANS">(
    "CASH"
  );
  const [seats, setSeats] = useState<number>(1);

  async function onSubmit(formData: FormData) {
    // jika user belum terautentikasi, arahkan ke login (kembali ke halaman ini setelah login)
    if (status !== "authenticated" || !session?.user) {
      router.push(
        `/auth/Login?callbackUrl=${encodeURIComponent(
          `/booking/${scheduleId}`
        )}`
      );
      return;
    }

    setLoading(true);

    try {
      const res = await createBooking(formData);

      // ✅ CASH
      if (paymentMethod === "CASH") {
        router.push("/booking/success");
        return;
      }

      // ✅ MIDTRANS
      if (res?.snapToken) {
        if (typeof window !== "undefined" && window.snap) {
          window.snap.pay(res.snapToken, {
            onSuccess: () => {
              alert("Pembayaran berhasil");
              router.push("/booking/success");
            },
            onPending: () => alert("Menunggu pembayaran"),
            onError: () => alert("Pembayaran gagal"),
            onClose: () => alert("Popup ditutup"),
          });
        } else {
          alert("Midtrans belum siap, refresh halaman");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat membuat booking");
    } finally {
      setLoading(false);
    }
  }

  // ✅ INI YANG KAMU LUPA
  return (
    <form action={onSubmit} className="space-y-4 rounded-xl border p-4">
      <input type="hidden" name="scheduleId" value={scheduleId} />

      {/* JUMLAH KURSI */}
      <div>
        <label className="text-sm font-medium">Jumlah Kursi</label>
        <input
          type="number"
          name="seats"
          min={1}
          max={maxSeats}
          required
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value || 1))}
          className="w-full rounded-md border px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">Tersisa kursi: {maxSeats}</p>
      </div>

      {/* PHONE */}
      <div>
        <label className="text-sm font-medium">No HP</label>
        <input
          type="tel"
          name="phone"
          required
          className="w-full rounded-md border px-3 py-2"
          placeholder="08xxxxxxxxxx"
        />
      </div>

      {/* PAYMENT */}
      <div>
        <label className="text-sm font-medium">Metode Pembayaran</label>
        <select
          name="paymentMethod"
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value as "CASH" | "MIDTRANS")
          }
          className="w-full rounded-md border px-3 py-2"
        >
          <option value="CASH">Bayar di Tempat</option>
          <option value="MIDTRANS">Online (Midtrans)</option>
        </select>
      </div>

      <button
        disabled={loading}
        className="w-full rounded-md bg-black text-white py-2 disabled:opacity-50"
      >
        {loading ? "Memproses..." : "Booking Sekarang"}
      </button>

      <div className="mt-2 p-3 border rounded bg-gray-50">
        <div className="flex justify-between text-sm">
          <span>Harga / orang</span>
          <span>Rp {price.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-sm mt-1 font-medium">
          <span>Total</span>
          <span>Rp {(price * seats).toLocaleString("id-ID")}</span>
        </div>
      </div>
    </form>
  );
}

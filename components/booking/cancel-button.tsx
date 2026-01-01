"use client";

import { cancelBooking } from "@/app/booking/canceled/action";
import { toast } from "sonner";

export default function CancelButton({ id }: { id: string }) {
  async function handleCancel() {
    try {
      await cancelBooking(id);
      toast.success("Booking dibatalkan");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal membatalkan");
    }
  }

  return (
    <button
      onClick={handleCancel}
      className="bg-red-500 text-white px-3 py-1 rounded"
    >
      Batalkan
    </button>
  );
}

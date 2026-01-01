"use client";

import { updateBookingStatus } from "./actions";

export default function UpdateStatus({ bookingId }: { bookingId: string }) {
  return (
    <select
      className="border rounded px-2 py-1"
      defaultValue=""
      onChange={async (e) => {
        const value = e.target.value as
          | "PENDING"
          | "CONFIRMED"
          | "CANCELLED"
          | "COMPLETED";
        try {
          await updateBookingStatus(bookingId, value);
          window.location.reload();
        } catch (err) {
          console.error(err);
          alert("Gagal mengubah status");
        }
      }}
    >
      <option value="" disabled>
        Ubah Status
      </option>
      <option value="CONFIRMED">CONFIRMED</option>
      <option value="CANCELLED">CANCELLED</option>
      <option value="COMPLETED">COMPLETED</option>
    </select>
  );
}

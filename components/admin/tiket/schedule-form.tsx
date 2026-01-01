"use client";

import { createSchedule } from "@/app/admin/dashboard/create-schedule/actions";
import { toast } from "sonner";

export default function CreateScheduleForm({
  cars,
}: {
  cars: { id: string; name: string }[];
}) {
  return (
    <form
      action={async (formData) => {
        try {
          await createSchedule(formData);
          toast.success("Schedule berhasil dibuat");
        } catch (e: unknown) {
          if (e instanceof Error) {
            toast.error(e.message);
          } else {
            toast.error("Terjadi kesalahan");
          }
        }
      }}
      className="space-y-4 bg-white p-6 rounded shadow"
    >
      <select name="carId" required className="border p-2 w-full">
        <option value="">Pilih Mobil</option>
        {cars.map((car) => (
          <option key={car.id} value={car.id}>
            {car.name}
          </option>
        ))}
      </select>

      <input type="date" name="date" required className="border p-2 w-full" />
      <input type="time" name="time" required className="border p-2 w-full" />

      <input
        name="origin"
        placeholder="Origin (contoh: Bengkulu)"
        required
        className="border p-2 w-full"
      />
      <input
        name="destination"
        placeholder="Destination (contoh: Padang)"
        required
        className="border p-2 w-full"
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Simpan Schedule
      </button>
    </form>
  );
}

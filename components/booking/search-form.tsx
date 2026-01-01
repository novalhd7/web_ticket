"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchForm() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    router.push(`/booking?date=${date}&passengers=${passengers}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white p-6 rounded shadow flex flex-wrap gap-4"
    >
      <div className="flex flex-col">
        <label className="text-sm mb-1">Tanggal</label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm mb-1">Penumpang</label>
        <input
          type="number"
          min={1}
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        />
      </div>

      <div className="flex items-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Cari Tiket
        </button>
      </div>
    </form>
  );
}

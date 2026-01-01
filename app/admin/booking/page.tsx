import prisma from "@/lib/prisma";
import UpdateStatus from "./update-status";
import Link from "next/link";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { user: true, schedule: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Status Booking</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>User</th>
            <th>Jadwal</th>
            <th>Kursi</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.user.email}</td>
              <td>
                {`${b.schedule.origin} → ${b.schedule.destination} — ${
                  b.schedule.date instanceof Date
                    ? b.schedule.date.toLocaleDateString()
                    : new Date(b.schedule.date).toLocaleDateString()
                } ${b.schedule.time}`}
              </td>
              <td>{b.seats}</td>
              <td>
                <StatusBadge status={b.status} />
              </td>
              <td>
                <UpdateStatus bookingId={b.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link
        href="/admin/dashboard"
        className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-semibold"
      >
        kembali
      </Link>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const cls =
    status === "CONFIRMED"
      ? "bg-green-100 text-green-800"
      : status === "CANCELLED"
      ? "bg-red-100 text-red-800"
      : status === "COMPLETED"
      ? "bg-blue-100 text-blue-800"
      : "bg-yellow-100 text-yellow-800";

  return <span className={`px-2 py-1 rounded ${cls}`}>{status}</span>;
}

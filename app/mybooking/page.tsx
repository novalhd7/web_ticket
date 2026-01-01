import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserBookings } from "@/lib/data";
import { notFound } from "next/navigation";
import { cancelBooking } from "@/app/booking/canceled/action";
import Link from "next/link";

// Server action wrapper for form
export async function handleCancel(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) throw new Error("Missing id");
  await cancelBooking(id);
}

export default async function MyBookingPage() {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const bookings = await getUserBookings(session.user.id);
  // Remove cancelled bookings from the list shown to the user
  const visibleBookings = bookings.filter((b) => b.status !== "CANCELLED");

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Booking Saya</h1>

      {visibleBookings.length === 0 && (
        <p className="text-gray-500">Belum ada booking</p>
      )}

      <div className="space-y-4">
        {visibleBookings.map((b) => (
          <div key={b.id} className="border p-4 rounded bg-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{b.schedule.car.name}</p>
                <p className="text-sm text-gray-600">
                  Tanggal: {new Date(b.schedule.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Jam: {b.schedule.time}</p>
                <p className="text-sm text-gray-600">Kursi: {b.seats}</p>
                <p className="text-sm text-gray-600">No. Telepon: {b.phone}</p>
                <p className="text-sm text-gray-600">
                  Metode Bayar: {b.paymentMethod}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">Status</p>
                <p className="mt-1">{b.status}</p>
                <p className="mt-2 text-xs text-gray-500">
                  Dibuat: {new Date(b.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              {b.status !== "CANCELLED" && b.status !== "CONFIRMED" && (
                <form action={handleCancel}>
                  <input type="hidden" name="id" value={b.id} />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Batalkan
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/"
        className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-semibold"
      >
        Kembali
      </Link>
    </div>
  );
}

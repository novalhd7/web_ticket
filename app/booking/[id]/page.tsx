import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import CreateBookingForm from "@/components/booking/create-booking-form";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await params;

  if (!id) return notFound();

  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: { car: true },
  });

  if (!schedule) return notFound();

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded shadow p-6">
          <div className="h-[300px] relative mb-4">
            <Image
              src={schedule.car.imageUrl}
              alt={schedule.car.name}
              fill
              className="object-cover rounded"
            />
          </div>

          <h1 className="text-2xl font-semibold">{schedule.car.name}</h1>
          <p className="text-gray-600 mt-1">
            {schedule.origin} → {schedule.destination}
          </p>
          <p className="mt-3">
            Tanggal: {new Date(schedule.date).toLocaleDateString()}
          </p>
          <p>Jam: {schedule.time}</p>
          <p className="mt-3">
            Harga / orang:{" "}
            <span className="font-semibold">
              Rp {schedule.car.price.toLocaleString("id-ID")}
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Kursi tersedia: {schedule.availableSeats}
          </p>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-medium mb-4">Checkout</h2>
          <CreateBookingForm
            scheduleId={schedule.id}
            maxSeats={schedule.availableSeats}
            price={schedule.car.price}
          />
        </div>
      </div>
    </div>
  );
}

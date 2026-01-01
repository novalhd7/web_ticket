import prisma from "@/lib/prisma";
import SearchForm from "@/components/booking/search-form";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type SearchParams = {
  date?: string;
  passengers?: string;
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  const date = params.date;
  const passengers = Number(params.passengers || 1);

  const schedules = date
    ? await prisma.schedule.findMany({
        where: {
          date: new Date(date),
          car: {
            capacity: {
              gte: passengers,
            },
          },
        },
        include: {
          car: true,
        },
        orderBy: { time: "asc" },
      })
    : [];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Cari Tiket</h1>

      {/* FORM SEARCH */}
      <SearchForm />

      {/* HASIL */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white rounded shadow overflow-hidden"
          >
            <div className="h-[200px] relative">
              <Image
                src={schedule.car.imageUrl}
                alt={schedule.car.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-5">
              <h3 className="text-xl font-semibold">{schedule.car.name}</h3>

              <p className="text-gray-500">Jam: {schedule.time}</p>

              <p className="mt-2">
                <span className="font-semibold">
                  Rp {schedule.car.price.toLocaleString("id-ID")}
                </span>
                <span className="text-sm text-gray-400"> / orang</span>
              </p>

              <p className="text-sm text-gray-500">
                Kapasitas: {schedule.car.capacity} orang
              </p>

              <Link
                href={
                  session?.user
                    ? `/booking/${schedule.id}`
                    : `/auth/Login?callbackUrl=${encodeURIComponent(
                        `/booking/${schedule.id}`
                      )}`
                }
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Pilih
              </Link>
            </div>
          </div>
        ))}

        {date && schedules.length === 0 && (
          <p className="text-gray-500 col-span-full">
            Tiket tidak ditemukan 😥
          </p>
        )}
      </div>
    </div>
  );
}

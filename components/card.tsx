import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { IoPeopleOutline } from "react-icons/io5";

type Schedule = {
  id: string;
  date: Date;
  time: string;
};

type CardProps = {
  id: string;
  title: string;
  price: number;
  capacity: number;
  image: string;
  schedules?: Schedule[];
};

export default async function Card({
  id,
  title,
  price,
  capacity,
  image,
  schedules = [],
}: CardProps) {
  const session = await getServerSession(authOptions);
  return (
    <div className="bg-white shadow-lg rounded-sm flex flex-col">
      <div className="h-[260px] relative">
        <Image src={image} fill alt={title} className="object-cover" />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-semibold">{title}</h3>

        <p className="mt-1 mb-3">
          Rp {price.toLocaleString("id-ID")}
          <span className="text-sm text-gray-400"> / orang</span>
        </p>

        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <IoPeopleOutline />
          <span>{capacity} Orang</span>
        </div>

        <div className="mb-5">
          <p className="text-sm font-medium mb-2">Jadwal</p>
          <div className="flex gap-2 flex-wrap">
            {schedules.length > 0 ? (
              schedules.slice(0, 3).map((s) => (
                <span
                  key={s.id}
                  className="px-3 py-1 text-xs bg-gray-100 rounded"
                >
                  {s.time}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">Belum ada jadwal</span>
            )}
          </div>
        </div>

        <Link
          href={
            session?.user
              ? schedules && schedules.length > 0
                ? `/booking/${schedules[0].id}`
                : `/booking?carId=${id}`
              : `/auth/Login?callbackUrl=${encodeURIComponent(
                  schedules && schedules.length > 0
                    ? `/booking/${schedules[0].id}`
                    : `/booking?carId=${id}`
                )}`
          }
          className="mt-auto bg-blue-500 text-white py-2 text-center rounded"
        >
          Pilih Tiket
        </Link>
      </div>
    </div>
  );
}

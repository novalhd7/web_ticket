import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import UpdateCarForm from "@/components/admin/tiket/update-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UpdateTiketPage({ params }: PageProps) {
  const { id } = await params; // ✅ WAJIB await

  if (!id) return notFound();

  const car = await prisma.car.findUnique({
    where: { id },
  });

  if (!car) return notFound();

  return (
    <div className="max-w-screen-xl px-4 py-16 mt-10 mx-auto">
      <UpdateCarForm
        car={{
          id: car.id,
          name: car.name,
          capacity: car.capacity,
          price: car.price,
          imageUrl: car.imageUrl,
        }}
      />
    </div>
  );
}

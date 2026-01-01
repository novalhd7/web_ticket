import prisma from "@/lib/prisma";
import CreateScheduleForm from "@/components/admin/tiket/schedule-form";

const CreateTiketPage = async () => {
  const cars = await prisma.car.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-screen-xl px-4 py-16 mt-10 mx-auto space-y-8">
      <CreateScheduleForm cars={cars} />
    </div>
  );
};

export default CreateTiketPage;

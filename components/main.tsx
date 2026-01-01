import Card from "@/components/card";
import { getCars } from "@/lib/data";

export default async function TiketPage() {
  const cars = await getCars();

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="grid gap-7 md:grid-cols-3">
        {cars.map((car) => (
          <Card
            key={car.id}
            id={car.id}
            title={car.name}
            price={car.price}
            capacity={car.capacity}
            image={car.imageUrl}
            schedules={car.schedules}
          />
        ))}
      </div>
    </div>
  );
}

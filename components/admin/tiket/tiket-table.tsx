import { getCar } from "@/lib/data";
import Image from "next/image";
import DeleteButton from "./delete-button";
import Link from "next/link";

const TiketTable = async () => {
  const cars = await getCar();

  if (!cars.length) {
    return <p className="mt-4 text-gray-500">No cars</p>;
  }

  return (
    <div className="bg-white p-4 mt-5 shadow-sm overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Capacity</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {cars.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.name}</td>

              <td className="border px-4 py-2">{item.capacity}</td>

              <td className="border px-4 py-2">
                Rp {item.price.toLocaleString("id-ID")}
              </td>

              <td className="border px-4 py-2">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={120}
                  height={80}
                  className="rounded object-cover"
                />
              </td>

              <td className="border px-4 py-2 space-x-2">
                <Link
                  href={`/admin/tiket/edit/${item.id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </Link>
                <Link
                  href={`/admin/tiket/schedule?carId=${item.id}`}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Schedule
                </Link>
                <DeleteButton id={item.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TiketTable;

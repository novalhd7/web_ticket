import Link from "next/link";
import TiketTable from "@/components/admin/tiket/tiket-table";
import { Suspense } from "react";

const TiketPage = () => {
  return (
    <div className="max-w-screen-xl px-4 py-16 mt-10 mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-4">Tiket Management</h1>
        <Link
          href="/admin/tiket/create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Tiket
        </Link>
        <Link
          href="/admin/dashboard"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Kembali
        </Link>
      </div>
      <Suspense>
        <TiketTable />
      </Suspense>
    </div>
  );
};

export default TiketPage;

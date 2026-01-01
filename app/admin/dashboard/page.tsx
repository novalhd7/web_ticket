import Link from "next/link";

const AdminDashboard = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <Link
        href="/admin/tiket"
        className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-semibold"
      >
        Kelola Tiket
      </Link>
      <Link
        href="/admin/booking"
        className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-semibold"
      >
        Update status Tiket
      </Link>
      <Link
        href="/"
        className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-semibold"
      >
        Kembali
      </Link>
    </div>
  );
};

export default AdminDashboard;

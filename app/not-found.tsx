import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-gray-600">Halaman yang kamu cari tidak ditemukan</p>

      <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded">
        Kembali ke Home
      </Link>
    </div>
  );
}

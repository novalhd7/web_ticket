"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const errorMap: Record<string, string> = {
  USER_NOT_FOUND: "Email tidak terdaftar",
  INVALID_CREDENTIALS: "Email atau password salah",
  NOT_ACTIVATED: "Akun belum diaktivasi. Cek email Anda.",
  OAUTH_ACCOUNT: "Silakan login menggunakan Google",
  INVALID_INPUT: "Data tidak valid",
};

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      redirect: false, // jangan auto-redirect
      email,
      password,
      callbackUrl: "/",
    });

    if (result?.error) {
      setError(errorMap[result.error] ?? result.error);
      return;
    }
    window.location.href = result?.url ?? "/";
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          required
        />
        <button className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500">
          Login
        </button>
        <p className="mt-4 text-center text-sm">
          Belum punya akun?{" "}
          <Link href="/auth/Register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

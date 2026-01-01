"use client";

import * as React from "react";
import { useActionState } from "react";
import { signUpCredentials } from "@/lib/actions/Register";
import Link from "next/link";

export default function FormRegister() {
  const [state, formAction] = useActionState(signUpCredentials, null);

  return (
    <form action={formAction} className="space-y-4 max-w-md mx-auto mt-10">
      <div>
        <label>Nama</label>
        <input name="nama" type="text" className="w-full border p-2 rounded" />
        {state && "error" in state && state.error.nama && (
          <p className="text-red-500 text-sm">{state.error.nama.join(", ")}</p>
        )}
      </div>

      <div>
        <label>Email</label>
        <input
          name="email"
          type="email"
          className="w-full border p-2 rounded"
        />
        {state && "error" in state && state.error.email && (
          <p className="text-red-500 text-sm">{state.error.email.join(", ")}</p>
        )}
      </div>

      <div>
        <label>Password</label>
        <input
          name="password"
          type="password"
          className="w-full border p-2 rounded"
        />
        {state && "error" in state && state.error.password && (
          <p className="text-red-500 text-sm">
            {state.error.password.join(", ")}
          </p>
        )}
      </div>

      <div>
        <label>Konfirmasi Password</label>
        <input
          name="ConfirmPassword"
          type="password"
          className="w-full border p-2 rounded"
        />
        {state && "error" in state && state.error.ConfirmPassword && (
          <p className="text-red-500 text-sm">
            {state.error.ConfirmPassword.join(", ")}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
      >
        Buat Akun
      </button>

      <p className="mt-4 text-center text-sm">
        Sudah punya akun?{" "}
        <Link href="/auth/Login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>

      {state && "message" in state && (
        <p className="mt-2 text-green-600 text-sm">{state.message}</p>
      )}
    </form>
  );
}

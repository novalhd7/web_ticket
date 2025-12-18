"use client";

import * as React from "react";
import Link from "next/link";
import { signUpCredentials } from "@/lib/actions";

const FormRegister = () => {
  const [state, formAction] = React.useActionState(signUpCredentials, null);
  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Nama
        </label>
        <input
          type="text"
          name="nama"
          placeholder="noval"
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
        />
        <div aria-live="polite" aria-atomic="true">
          <span className="text-sm text-red-500 mt-2">
            {state?.error?.nama}
          </span>
        </div>
      </div>
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          email
        </label>
        <input
          type="email"
          name="email"
          placeholder="noval@gmail.com"
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
        />
        <div aria-live="polite" aria-atomic="true">
          <span className="text-sm text-red-500 mt-2">
            {state?.error?.email}
          </span>
        </div>
      </div>
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="*"
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
        />
        <div aria-live="polite" aria-atomic="true">
          <span className="text-sm text-red-500 mt-2">
            {state?.error?.password}
          </span>
        </div>
      </div>
      <div>
        <label
          htmlFor="ConfirmPassword"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Konfirmasi Password
        </label>
        <input
          type="password"
          name="ConfirmPassword"
          placeholder="*"
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
        />
        <div aria-live="polite" aria-atomic="true">
          <span className="text-sm text-red-500 mt-2">
            {state?.error?.ConfirmPassword}
          </span>
        </div>
      </div>
      <button
        type="submit"
        className="w-full text-white bg-blue-700 font-medium rounded-lg px-5 py-2.5 text-center uppercase hover:bg-blue-800"
      >
        Buat akun
      </button>
      <p>
        Sudah Punya Akun?
        <Link href="/login">
          <span className="font-medium pl-1 text-blue-600 hover:text-blue-700">
            login
          </span>
        </Link>
      </p>
    </form>
  );
};
export default FormRegister;

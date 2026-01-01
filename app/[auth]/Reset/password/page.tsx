"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params?.get("token") || null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // if token present, we show password form instead of email form
  }, [token]);

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data?.message || "Sukses (cek email jika terdaftar)");
    } catch (error) {
      console.error(error);
      setMessage("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return setMessage("Token tidak ditemukan");
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      setMessage(data?.message || "Password berhasil diubah");
      if (data?.ok) {
        // redirect to login after short delay so user sees message
        setTimeout(() => router.push("/auth/Login"), 1500);
      }
    } catch (error) {
      console.error(error);
      setMessage("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 540, margin: "3rem auto", padding: "0 1rem" }}>
      <h1>Reset Password</h1>
      {!token ? (
        <>
          <p>Masukkan email Anda untuk menerima tautan reset password.</p>

          <form onSubmit={handleSendLink}>
            <label style={{ display: "block", marginBottom: 8 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginBottom: 12 }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{ padding: "8px 16px" }}
            >
              {loading ? "Mengirim..." : "Kirim Link Reset"}
            </button>
          </form>
        </>
      ) : (
        <>
          <p>Masukkan password baru Anda.</p>
          <form onSubmit={handleReset}>
            <label style={{ display: "block", marginBottom: 8 }}>
              Password Baru
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginBottom: 12 }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{ padding: "8px 16px" }}
            >
              {loading ? "Memproses..." : "Setel Ulang Password"}
            </button>
          </form>
        </>
      )}

      {message && (
        <div style={{ marginTop: 12, color: "#374151" }}>{message}</div>
      )}
    </div>
  );
}

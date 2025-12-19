// lib/mailer.ts
import nodemailer from "nodemailer";

// Buat transporter Mailtrap
export const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SERVER,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
  secure: false, // false untuk port 587
});

// Function kirim email aktivasi
export async function sendActivationEmail(email: string, token: string) {
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/activate?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAILTRAP_FROM,
    to: email,
    subject: "Aktivasi Akun IniTicker",
    html: `
      <h2>Aktivasi Akun</h2>
      <p>Klik link di bawah untuk mengaktifkan akun Anda:</p>
      <a href="${link}">${link}</a>
    `,
  });
}

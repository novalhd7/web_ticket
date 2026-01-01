import { z } from "zod";

export const LoginScema = z.object({
  email: z.string().email("invalid email"),
  password: z
    .string()
    .min(8, "password harus 8 karakter")
    .max(32, "password melebihi 32 karakter"),
});

export const RegisterScema = z
  .object({
    nama: z.string().min(1, "Nama harus lebih dari 1 karakter"),
    email: z.string().email("invalid email"),
    password: z
      .string()
      .min(8, "password harus 8 karakter")
      .max(32, "password melebihi 32 karakter"),
    ConfirmPassword: z
      .string()
      .min(8, "password harus 8 karakter")
      .max(32, "password melebihi 32 karakter"),
  })
  .refine((data) => data.password === data.ConfirmPassword, {
    message: "password tidak sama",
    path: ["ConfirmPassword"],
  });

export const carSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  capacity: z.coerce.number().min(1, "Capacity minimal 1"),
  price: z.coerce.number().min(1000, "Harga tidak valid"),
  imageUrl: z.string().url("Image tidak valid"),
});

export const scheduleSchema = z.object({
  carId: z.string().uuid(),
  date: z.coerce.date(),
  time: z.string().min(1, "Jam wajib diisi"),

  origin: z.string(),
  destination: z.string(),
});

export const schema = z.object({
  scheduleId: z.string().uuid(),
  seats: z.coerce.number().min(1),
  phone: z.string().min(10),
  paymentMethod: z.enum(["CASH", "MIDTRANS"]),
});

// Alias to avoid ambiguous import name issues with some bundlers
export const bookingSchema = schema;

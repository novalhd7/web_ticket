import { object, string } from "zod";

export const LoginScema = object({
  email: string().email("invalid email"),
  password: string()
    .min(8, "password harus 8 karakter")
    .max(32, "password melebihi 32 karakter"),
});

export const RegisterScema = object({
  nama: string().min(1, "Nama harus lebih dari 1 karakter"),
  email: string().email("invalid email"),
  password: string()
    .min(8, "password harus 8 karakter")
    .max(32, "password melebihi 32 karakter"),
  ConfirmPassword: string()
    .min(8, "password harus 8 karakter")
    .max(32, "password melebihi 32 karakter"),
}).refine((data) => data.password === data.ConfirmPassword, {
  message: "password tidak sama",
  path: ["ConfirmPassword"],
});

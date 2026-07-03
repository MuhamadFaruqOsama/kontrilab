import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email wajib diisi.").email("Masukkan email aktif yang valid."),
  password: z.string().min(1, "Password wajib diisi."),
});

export const registerRequestSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, "Nama pengguna minimal 2 karakter.")
    .max(40, "Nama pengguna maksimal 40 karakter."),
  email: z.string().trim().toLowerCase().min(1, "Email wajib diisi.").email("Masukkan email aktif yang valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

export const registerSchema = registerRequestSchema
  .extend({
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Konfirmasi password belum sama.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "Email wajib diisi.").email("Masukkan email aktif yang valid."),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password minimal 6 karakter."),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Konfirmasi password belum sama.",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

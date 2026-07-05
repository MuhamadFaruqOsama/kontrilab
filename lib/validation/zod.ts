import { z } from "zod";

export function getFirstZodError(error: z.ZodError) {
  return error.issues[0]?.message || "Input belum valid.";
}

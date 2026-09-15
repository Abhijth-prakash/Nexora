import { z } from "zod";

export const LoginSchema = z.object({
  email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
})


export type LoginData = z.infer<typeof LoginSchema>

export const EmailSchema = z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),
})


export type Email = z.infer<typeof EmailSchema>
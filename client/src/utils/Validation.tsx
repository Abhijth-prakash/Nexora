import { z } from "zod";

type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmpassword: string;
};

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),

    email: z.string().email("Email is invalid"),

    password: z.string().min(4, "Minimum 4 characters"),

    confirmpassword: z.string().min(4, "Minimum 4 characters"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords don't match",
    path: ["confirmpassword"],
  });

export type { RegisterData, RegisterRequest };
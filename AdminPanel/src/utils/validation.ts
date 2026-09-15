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

export const passwordSchema = z.object({

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password cannot exceed 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain uppercase, lowercase, number and special character"
      ),

    confirmpassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters")
      .max(128, "Confirm password cannot exceed 128 characters"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords don't match",
    path: ["confirmpassword"],
  });

  export type passwordData = z.infer<typeof passwordSchema>

  export type Resetpassdata = {
    token: string |null,
    password: string
  }
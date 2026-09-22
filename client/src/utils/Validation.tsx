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
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),

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

  export const OtpValidate = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
})

export type OtpForm = z.infer<typeof OtpValidate>

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

export const forgetpassSchema = z.object({
  email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),

})

export type forgetpassDAta = z.infer<typeof forgetpassSchema>

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


export type { RegisterData, RegisterRequest };


export const AddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),

  address: z.string().min(5, "Address is required"),

  city: z.string().min(2, "City is required"),

  state: z.string().min(2, "State is required"),

  country: z.string().min(2, "Country is required"),

  zipCode: z.string().min(4, "ZIP code is required"),

  type: z.string().min(1, "Address type is required"),
})

export type AddressFormData = z.infer<typeof AddressSchema>

export type Addressid = string

export type Email = string


export const ChangepassValidation = z.object({
    currentpassword: z
    .string()
    .min(1, "Password is required"),

      newpassword: z
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
  .refine((data) => data.newpassword === data.confirmpassword, {
    message: "Passwords don't match",
    path: ["confirmpassword"],
})


export type ChangePassData = z.infer<typeof ChangepassValidation>

export type passData = {
  currentpassword:string,
  newpassword:string
}

export const ProfileSchema = z.object({

    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),

})


export type ProfileData = z.infer<typeof ProfileSchema>
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


export const CategorySchema = z.object({
    name: z.string().min(1, "name is required"),

    description: z.string().min(1, "description is required"),

    subCategory: z.string().optional()
})

export type categoryData = z.infer<typeof CategorySchema>

export const subCategorySchema = z.object({
  subCategory: z.string().min(1, "subCategory is required")
})

export type subCategoryData = z.infer<typeof subCategorySchema>


export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),

  description: z.string().trim().min(1, "Description is required"),

  color: z.string().optional(),

  brand: z.string().trim().min(1, "Brand is required"),

  stock: z.coerce.number().min(0, "Stock cannot be negative"),

  price: z.coerce.number().min(0, "Price cannot be negative"),

  size: z.array(z.string()).optional(),

  rating: z.coerce.number().min(0).max(5).default(0),

});

export type ProductFormData = z.infer<typeof productSchema>;

export const updateproductSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  description: z.string().trim().min(1, "Product description is required"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  size: z.array(z.string().trim()).default([]).optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  color: z.string().trim().optional(),
  brand: z.string().trim().min(1, "Brand is required"),
  rating: z.coerce.number().min(0).max(5).default(0),
});




export const variantValidation = z.object({
  color: z.string().trim().min(1, "Color is required"),

  size: z.array(z.string()).optional().default([]),

  price: z
    .string()
    .trim()
    .min(1, "Price is required")
    .transform(Number)
    .pipe(z.number("Price must be a number").min(0, "Price must be at least 0")),

  stock: z
    .string()
    .trim()
    .min(1, "Stock is required")
    .transform(Number)
    .pipe(z.number("Stock must be a number").min(0, "Stock must be at least 0")),

  rating: z
    .string()
    .trim()
    .min(1, "Rating is required")
    .transform(Number)
    .pipe(
      z
        .number("Rating must be a number")
        .min(0, "Rating must be at least 0")
        .max(5, "Rating cannot exceed 5")
    ),
});

export type VariantFormData = z.output<typeof variantValidation>;



export const couponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .toUpperCase()
      .min(1, "Coupon code is required"),

    description: z
      .string()
      .trim()
      .max(300, "Description cannot exceed 300 characters")
      .optional(),

    discountType: z.enum(["percentage", "fixed"], {
      message: "Discount type must be percentage or fixed",
    }),

    discountValue: z.coerce
      .number()
      .positive("Discount value must be greater than 0"),

    maxDiscount: z.coerce
      .number()
      .min(0, "Maximum discount cannot be negative")
      .nullable()
      .optional(),

    minOrderAmount: z.coerce
      .number()
      .min(0, "Minimum order amount cannot be negative")
      .default(0),

    expiryDate: z.coerce.date({
      message: "A valid expiry date is required",
    }),

  usageLimit: z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.number()
    .int("Usage limit must be an integer")
    .min(1, "Usage limit must be at least 1")
    .optional()
    .nullable()
),
    perUserLimit: z.coerce
      .number()
      .int("Per-user limit must be an integer")
      .min(1, "Per-user limit must be at least 1")
      .default(1),

    applicableCategories: z
      .array(
        z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID")
      )
      .default([]),

    isActive: z.boolean().default(true),
  })
  .superRefine((value, ctx) => {
    if (
      value.discountType === "percentage" &&
      value.discountValue > 100
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Percentage discount cannot exceed 100",
      });
    }

    if (
      value.discountType === "fixed" &&
      value.maxDiscount != null
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["maxDiscount"],
        message:
          "maxDiscount is only applicable to percentage coupons",
      });
    }
  });

export type CouponFormInput = z.input<typeof couponSchema>;

export type CouponFormData = z.output<typeof couponSchema>;
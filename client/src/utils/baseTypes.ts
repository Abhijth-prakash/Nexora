export type BaseUser = {
  _id: string
  name: string
  email: string
  verified: boolean
  createdAt: string
  updatedAt: string,
  googleId: string
}

export type BaseAddress = {
    _id: string,
    user: string,
    type: string,
    fullName: string,
    phone: string,
    address: string,
    country:string,
    city:string,
    state:string,
    zipCode:string,
    isDefault:boolean

}

export type Basecategory={
    _id: string
    name:string
    description:string
    image:{
        url:string
        public_id:string
    }
    isVisible:boolean
    productCount:number
    slug:string
}

export type BaseProduct = {
  _id: string;
  name: string;
  description: string;
  color?: string;
  brand: string;
  stock: number;
  category: {
    _id: string;
    name: string;
  };
  subCategory: {
    _id: string;
    name: string;
  };
  visible: boolean;
  price: number;
  size: string[];
  rating: number;
  numReviews: number;
  images: string[];
  variants: BaseVarient[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type BaseVarient = {
  _id?: string;
  color?: string;
  size?: string[];
  price: number;
  stock: number;
  images: string[];
  rating: number;
};

export type BaseCartItem = {
  _id: string;
  productId?: string;
  variantId?: string | null;
  category?: string;
  name?: string;
  brand?: string;
  size?: string | null;
  color?: string | null;
  price?: number;
  image?: string | null;
  quantity: number;
  stock?: number;
  available: boolean;
  reason?: string | null;
  lineTotal?: number;
};


export type BaseCoupon = {
  _id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscount?: number | null;
  minOrderAmount: number;
  startDate: string;
  expiryDate: string;
  usageLimit?: number | null;
  usedCount: number;
  perUserLimit: number;
  applicableCategories: string[];
  isActive: boolean;
};

export type Baseorder = {
  _id: string;
  user: string;
  items: {
    product:
      | string
      | {
          _id: string;
          name?: string;
          images?: string[];
        };
    variantId: string | null;
    quantity: number;
    price: number;
  }[];
  address: string;
  totalAmount: number;
  coupon: string | null;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: "razorpay" | "cod";
  razorpayOrderId: string | null;
  orderDate: string;
  otp: string | null;
  otpExpiry: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
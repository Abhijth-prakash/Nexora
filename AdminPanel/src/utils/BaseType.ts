export type BaseUser = {
    _id: string,
    name:string,
    email:string,
    verified:boolean,
    banned:boolean
}


export type BaseAdmin={
  _id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
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

export type BaseSubcategory={
    _id: string
    name:string
    isVisible:boolean
    slug:string
    productCount:number
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

  user: string | BaseUser;

  items: {
    product: string | BaseProduct;
    variantId: string | BaseVarient | null;
    quantity: number;
    price: number;
  }[];

  address: string | BaseAddress;

  subtotal: number;
  discountAmount: number;
  totalAmount: number;

  coupon: string | BaseCoupon | null;

  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: "razorpay" | "cod";

  razorpayOrderId: string | null;

  orderDate: string;

  otp: string | null;
  otpExpiry: string | null;
  otpAttempts: number;
  otpVerified: boolean;

  createdAt: string;
  updatedAt: string;
  __v: number;
};


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
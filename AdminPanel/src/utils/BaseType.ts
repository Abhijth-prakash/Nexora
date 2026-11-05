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

 orderStatus:
  | "confirmed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "returned";

  return: string | BaseReturn | null;


  trackingDates: {
  confirmed: string | null;
  shipped: string | null;
  outForDelivery: string | null;
  delivered: string | null;
  cancelled: string | null;
  returnRequested: string | null;
  returned: string | null;
};

  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "cod";
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


export type BaseReturn = {
  _id: string;

  order: string | Baseorder;
  user: string | BaseUser;

  reason:
    | "damaged"
    | "wrong_item"
    | "defective"
    | "not_as_described"
    | "size_issue"
    | "changed_mind"
    | "other";

  description: string | null;

  status:
    | "requested"
    | "approved"
    | "rejected"
    | "pickup_scheduled"
    | "picked_up"
    | "received"
    | "refunded"
    | "cancelled";

  adminNote: string | null;
  rejectionReason: string | null;

  refund: {
    amount: number;
    status: "pending" | "processing" | "completed" | "failed";
    method: "wallet";
    refundedAt: string | null;
  };

  trackingDates: {
    requested: string;
    approved: string | null;
    rejected: string | null;
    pickedUp: string | null;
    received: string | null;
    refunded: string | null;
    cancelled: string | null;
  };

  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type getAllreturnResponse = BaseReturn[]
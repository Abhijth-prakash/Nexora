import  type { BaseUser,BaseAddress, Basecategory, BaseProduct,BaseCartItem, BaseCoupon } from "./baseTypes"

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type RegisterRes = {
  user: BaseUser
}

export type VerifyOtpResponse = {
  user: BaseUser
  expiresIn: string
  verification: {
    emailVerified: boolean
    verifiedAt: string
  }
}

export type VerifyOtpRequest = {
  otp: string
  email: string
}

export type LoginResponse = {
  user: BaseUser
}

export type profileResponse = {
  user: BaseUser,
}

export type LogoutResponse = null

export type ForgetpassResponse = null

export type Resetpass= {
  token:string | null,
  password:string
}

export type resetpassResponse = null


export type AddressResponse = {
  address: BaseAddress[]
}

export type addAddressResponse = null

export type deleteAddressResponse = null

export type updateAddressResponse = null

export type resendOtpResponse = null

export type changepasswordresponse = null

export type editProfileResponse = null

export type categoryresponse = Basecategory[]
export type productResponse = BaseProduct[]
export type getProductbyID = BaseProduct

export type CategoryTreeItem = {
  _id: string
  name: string
  slug: string
  subCategories: { _id: string; name: string; slug: string }[]
}

export type addtoCartResponse = null


export type AddToCartPayload ={
  productId: string;
  variantId?: string | null;
  size?: string | null;
  quantity?: number;
}


export type CartResponse = {
  items: BaseCartItem[];
  totalItems: number;
  subtotal: number;
};


export type MergeCartResponse = {
  skippedItems: {
    productId: string;
    reason: string;
  }[];
};

export type CouponResponse = BaseCoupon[]

export type CouponValidationResponse = {
  coupon: {
    _id: string;
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    maxDiscount: number | null;
  };
  discount: number;
  finalAmount: number;
};



export type orderSummaryResponse = {
  coupon: {
    _id: string;
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    maxDiscount: number | null;
  };
  discount: number;
  finalAmount: number;
  subtotal:number
};


export type orderVerificationResponse = {
  reservationId: string;
  expiresAt: string;
  address: BaseAddress;
  summary: orderSummaryResponse;
};

export type PaymentOrderResponse = {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
};
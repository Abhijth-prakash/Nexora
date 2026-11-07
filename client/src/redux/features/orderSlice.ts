import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { orderApi } from "../../utils/api"
import axios from "axios"
import type { BaseAddress, BaseCartItem, Baseorder, BaseReturn } from "../../utils/baseTypes";
import type { BuyNowPayload } from "../../utils/apiTypes";


export type orderType = {
  loading: boolean;
  ordererrors: string | null;
  subtotal: number;
  discount: number;
  finalAmount: number;
  coupon: {
    _id: string;
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    maxDiscount: number | null;
  } | null;
  reservationId:string|null
  address:BaseAddress|null
   razorpayOrderId: string|null
  amount: number
  currency: string|null
  keyId: string|null
  orderId:string|null
  orderDetails:Baseorder|null
  orders:Baseorder[]
  page:number
  pages:number|null
  totalOrders:number
  returns:BaseReturn[]
  buyNowItem: BuyNowPayload | null
  checkoutItems: BaseCartItem[]
};


const initialState:orderType = {
    loading:false,
    ordererrors:null,
    coupon:null,
    discount:0,
    finalAmount:0,
    subtotal:0,
    reservationId:null,
    address:null,
    razorpayOrderId:null,
    amount: 0,
    currency: null,
  keyId: null,
  orderId:null,
  orderDetails:null,
  orders:[],
  page:1,
  pages:null,
  totalOrders:0,
  returns:[],
  buyNowItem: null,
  checkoutItems: [],
}


//validatecart
export const validateCart = createAsyncThunk(
  "users/cart/validateCart",
  async (buyNowItem: BuyNowPayload | null | undefined, { rejectWithValue }) => {
    try {
      const response = await orderApi.stockValidation(
        buyNowItem ? { buyNowItem } : undefined
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Cart validation failed. Please try again."
        );
      }

      return rejectWithValue(
        "Cart validation failed. Please try again."
      );
    }
  }
);


//ordersumamary
export const getOrderSummary = createAsyncThunk(
  "cart/getOrderSummary",
  async (
    params:
      | string
      | undefined
      | { couponId?: string; isBuyNow?: boolean; buyNowItem?: BuyNowPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderApi.orderSummary(params);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to fetch order summary. Please try again."
        );
      }

      return rejectWithValue(
        "Failed to fetch order summary. Please try again."
      );
    }
  }
);

//orderVerification
export const GenerateOrder = createAsyncThunk(
  "order/orderVerification",
  async (
    data: {
      addressId: string;
      couponId?: string;
      isBuyNow?: boolean;
      buyNowItem?: BuyNowPayload;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderApi.GenerateOrder(data);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to verify order. Please try again."
        );
      }

      return rejectWithValue(
        "Failed to verify order. Please try again."
      );
    }
  }
);




//createPaymentOrder
export const createRazorpayment = createAsyncThunk(
  "order/createPaymentOrder",
  async (
    orderId:string,
    { rejectWithValue }
  ) => {
    try {
      const response = await orderApi.createRazorpayment(
        orderId
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to create payment order. Please try again."
        );
      }

      return rejectWithValue(
        "Failed to create payment order. Please try again."
      );
    }
  }
);

//verifypayment
export const verifyPayment = createAsyncThunk(
  "order/verifyPayment",
  async (
    payload: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
      paymentMethod:string;
      orderId:string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderApi.verifyPayment(payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Payment verification failed. Please contact support."
        );
      }
      return rejectWithValue(
        "Payment verification failed. Please contact support."
      );
    }
  }
);


//sendcodotp
export const sendCodOtp = createAsyncThunk(
  "order/sendCodOtp",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await orderApi.sendCodOtp(orderId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to send OTP. Please try again."
        );
      }
      return rejectWithValue("Failed to send OTP. Please try again.");
    }
  }
);


//otp veirfy
export const verifyCodOtp = createAsyncThunk(
  "order/verifyCodOtp",
  async (
    payload: { orderId: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderApi.verifyCodOtp(
        payload.orderId,
        payload.otp
      );

      return response.data;

    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to verify OTP. Please try again."
        );
      }

      return rejectWithValue(
        "Failed to verify OTP. Please try again."
      );
    }
  }
);


//getorders

export const getOrders = createAsyncThunk(
  "order/getOrders",
  
  async (
    { page = 1, search = "" }: { page?: number; search?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await orderApi.getOrders(page, search);

      return response.data;

    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to fetch orders. Please try again."
        );
      }

      return rejectWithValue(
        "Failed to fetch orders. Please try again."
      );
    }
  }
);


//cancelOrder
export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",

  async (
    { orderId, cancelReason }: { orderId: string; cancelReason: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderApi.cancelOrder(orderId, cancelReason);

      return response.data;

    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to cancel order. Please try again."
        );
      }

      return rejectWithValue(
        "Failed to cancel order. Please try again."
      );
    }
  }
);


export const payByWallet = createAsyncThunk(
  "order/payByWallet",

  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await orderApi.payByWallet(orderId);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Wallet payment failed. Please try again."
        );
      }

      return rejectWithValue("Wallet payment failed. Please try again.");
    }
  }
);


//generate return request
export const generateReturn = createAsyncThunk(
  "order/generateReturn",

  async (
    {
      orderId,
      payload,
    }: {
      orderId: string;
      payload: { reasonForreturning: string; description?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderApi.generateReturn(orderId, payload);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Return request failed. Please try again."
        );
      }

      return rejectWithValue("Return request failed. Please try again.");
    }
  }
);



//getUserReturns
export const getUserReturns = createAsyncThunk(
  "order/getUserReturns",

  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getUserReturns();

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to fetch returns. Please try again."
        );
      }

      return rejectWithValue("Failed to fetch returns. Please try again.");
    }
  }
);



const orderSlice = createSlice({
    name:'orderSLice',
    initialState,
    reducers:{
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        setBuyNowItem: (state, action: PayloadAction<BuyNowPayload | null>) => {
            state.buyNowItem = action.payload
        },
        clearBuyNow: (state) => {
            state.buyNowItem = null
            state.checkoutItems = []
        },
        clearOrderErrors: (state) => {
            state.ordererrors = null
        }
    },
    extraReducers: (build)=>{
        build

        //validateCart
        .addCase(validateCart.pending,(state)=>{
            state.loading = true
        })
        .addCase(validateCart.fulfilled,(state)=>{
            state.loading = false
        })
        .addCase(validateCart.rejected,(state,action)=>{
            state.loading = false
            state.ordererrors = action.payload as string
        })

        //orderSummary
        .addCase(getOrderSummary.pending,(state)=>{
            state.loading = true
            state.ordererrors = null
        })
        .addCase(getOrderSummary.fulfilled,(state,action)=>{
            state.loading = false
            state.ordererrors = null
            state.coupon = action.payload.coupon ?? null
            state.discount = action.payload.discount ?? 0
            state.subtotal = action.payload.subtotal
            state.finalAmount = action.payload.finalAmount
            if (action.payload.items) {
                state.checkoutItems = action.payload.items
            }
        })
        .addCase(getOrderSummary.rejected,(state,action)=>{
            state.loading = false
            state.ordererrors = action.payload as string
            // a rejected coupon must not leave a stale discount behind
            state.coupon = null
            state.discount = 0
        })

        //order verification

        .addCase(GenerateOrder.pending,(state)=>{
            state.loading = true
            state.ordererrors = null
            state.orderId = null
        })
        .addCase(GenerateOrder.fulfilled,(state,action)=>{
            state.loading = false
            state.coupon = action.payload.summary.coupon
            state.discount = action.payload.summary.discount
            state.subtotal = action.payload.summary.subtotal
            state.finalAmount = action.payload.summary.finalAmount
            state.address = action.payload.address
            state.reservationId = action.payload.reservationId
            state.orderId = action.payload.orderId
        })
        .addCase(GenerateOrder.rejected,(state,action)=>{
            state.loading = false
            state.ordererrors = action.payload as string
        })


        //paymentorder
        .addCase(createRazorpayment.pending,(state)=>{
            state.loading = true
        })
        .addCase(createRazorpayment.fulfilled,(state,action)=>{
            state.loading = false
            state.razorpayOrderId = action.payload.razorpayOrderId
            state.keyId = action.payload.keyId
            state.amount = action.payload.amount
            state.currency = action.payload.currency
            state.orderId = action.payload.orderId
      
        })
        .addCase(createRazorpayment.rejected,(state,action)=>{
            state.loading = false
            state.ordererrors = action.payload as string
        })


        //verifypayment
        .addCase(verifyPayment.pending,(state)=>{
            state.loading = true
        })
        .addCase(verifyPayment.fulfilled,(state,action)=>{
            state.loading = false
            state.orderDetails = action.payload
            
           
        })
        .addCase(verifyPayment.rejected,(state,action)=>{
            state.loading = false
            state.ordererrors = action.payload as string
        })


        //sendcodotp
        .addCase(sendCodOtp.pending,(state)=>{
            state.loading = true
        })
        .addCase(sendCodOtp.fulfilled,(state)=>{
            state.loading = false
           
        })
        .addCase(sendCodOtp.rejected,(state,action)=>{
            state.loading = false
            state.ordererrors = action.payload as string
        })


        //verify otp
        .addCase(verifyCodOtp.pending,(state)=>{
            state.loading = true
        })
        .addCase(verifyCodOtp.fulfilled,(state,action)=>{
            state.loading = false
            state.orderDetails = action.payload
           
        })
        .addCase(verifyCodOtp.rejected,(state,action)=>{
            state.loading = false
            state.ordererrors = action.payload as string
        })


        //payBywallet
        .addCase(payByWallet.pending,(state)=>{
            state.loading = true
        })
        .addCase(payByWallet.fulfilled,(state,action)=>{
            state.loading = false
            state.orderDetails = action.payload
           
        })
        .addCase(payByWallet.rejected,(state,action)=>{
            state.loading = false
            state.ordererrors = action.payload as string
        })


        //get orders
        .addCase(getOrders.pending,(state)=>{
            state.loading = true
        })
        .addCase(getOrders.fulfilled,(state,action)=>{
            state.loading = false
            state.orders = action.payload.orders
            state.page = action.payload.currentPage
            state.pages = action.payload.totalPages
            state.totalOrders = action.payload.totalOrders

        })
        .addCase(getOrders.rejected,(state,action)=>{
            state.loading = false
            state.ordererrors = action.payload as string
        })

        //get returns
        .addCase(getUserReturns.pending,(state)=>{
            state.loading = true
        })
        .addCase(getUserReturns.fulfilled,(state,action)=>{
            state.loading = false
           state.returns = action.payload
        })
        .addCase(getUserReturns.rejected,(state,action)=>{
            state.loading = false
            state.ordererrors = action.payload as string
        })
    }
})

export default orderSlice.reducer

export const { setPage, setBuyNowItem, clearBuyNow, clearOrderErrors } = orderSlice.actions
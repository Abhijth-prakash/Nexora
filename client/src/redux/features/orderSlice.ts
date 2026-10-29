import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { orderApi } from "../../utils/api"
import axios from "axios"
import type { BaseAddress } from "../../utils/baseTypes";


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
  orderId:null
}


//validatecart
export const validateCart = createAsyncThunk(
  "users/cart/validateCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.stockValidation();
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
  async (couponId: string | undefined, { rejectWithValue }) => {
    try {
      const response = await orderApi.orderSummary(couponId);
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
    data: { addressId: string; couponId?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderApi.GenerateOrder(
        data.addressId,
        data.couponId
      );

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
      otp:string;
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



const orderSlice = createSlice({
    name:'orderSLice',
    initialState,
    reducers:{},
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
        })
        .addCase(getOrderSummary.fulfilled,(state,action)=>{
            state.loading = false
            state.coupon = action.payload.coupon
            state.discount = action.payload.discount
            state.subtotal = action.payload.subtotal
            state.finalAmount = action.payload.finalAmount
        })
        .addCase(getOrderSummary.rejected,(state,action)=>{
            state.loading = false
            state.ordererrors = action.payload as string
        })

        //order verification

        .addCase(GenerateOrder.pending,(state)=>{
            state.loading = true
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
           
        })
        .addCase(verifyPayment.rejected,(state,action)=>{
            state.loading = false
            state.ordererrors = action.payload as string
        })


        //sendcodotp
        .addCase(sendCodOtp.pending,(state)=>{
            state.loading = true
        })
        .addCase(sendCodOtp.fulfilled,(state,action)=>{
            state.loading = false
           
        })
        .addCase(sendCodOtp.rejected,(state,action)=>{
            state.loading = false
            state.ordererrors = action.payload as string
        })
    }
})

export default orderSlice.reducer
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { orderApi } from "../../utils/api"
import axios from "axios"


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
};


const initialState:orderType = {
    loading:false,
    ordererrors:null,
    coupon:null,
    discount:0,
    finalAmount:0,
    subtotal:0
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
    }
})

export default orderSlice.reducer
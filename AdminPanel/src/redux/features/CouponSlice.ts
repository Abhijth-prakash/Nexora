
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Coupon_Api } from "../../utils/api";
import type { CouponFormData } from "../../utils/validation";
import type { BaseCoupon } from "../../utils/BaseType";


export type CouponType = {
  loading: boolean;
  error: string | null;
  Coupons :BaseCoupon[]
  page:number
  totalPages:number,
  totalCoupons:number
};

const initialState: CouponType = {
  loading: false,
  error: null,
  Coupons:[],
  page:1,
  totalPages:1,
  totalCoupons:0
  
};

//aggCOupom
export const addCoupon = createAsyncThunk(
  "coupon/addCoupon",
  async (data: CouponFormData, { rejectWithValue }) => {
    try {
      const response = await Coupon_Api.addCoupon(data);

      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to add coupon. Please try again."
        );
      }

      return rejectWithValue(
        "Failed to add coupon. Please try again."
      );
    }
  }
);


//getcoupns
export const getCoupons = createAsyncThunk(
  "coupon/getCoupons",
  async (
    {
      page,
      limit,
      search,
      filter,
    }: {
      page: number;
      limit: number;
      search: string;
      filter: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await Coupon_Api.getCoupons(
        page,
        limit,
        search,
        filter
      );

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to fetch coupons. Please try again."
        );
      }

      return rejectWithValue(
        "Failed to fetch coupons. Please try again."
      );
    }
  }
);

//activetoglle

export const activeToggle = createAsyncThunk(
  "coupon/activeToggle",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await Coupon_Api.activeToggle(id);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to toggle coupon status. Please try again."
        );
      }

      return rejectWithValue(
        "Failed to toggle coupon status. Please try again."
      );
    }
  }
);

//deleteCOupon
export const deleteCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await Coupon_Api.deleteCoupon(id);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to delete coupon. Please try again."
        );
      }

      return rejectWithValue(
        "Failed to delete coupon. Please try again."
      );
    }
  }
);



const CouponSlice = createSlice({
  name: "couponSlice",
  initialState,
  reducers: {
    clearCouponError: (state) => {
      state.error = null;
    },
    addpage:(state)=>{
        state.page +=1
    },
    minusPage:(state)=>{
        if(state.page>1){
            state.page -=1
        }
    }
  },

  extraReducers: (builder) => {
    builder
      // Add coupon 
      .addCase(addCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

     
      .addCase(addCoupon.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

   
      .addCase(addCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to add coupon. Please try again.";
      })

      //getcoupon
      .addCase(getCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCoupons.fulfilled, (state,action) => {
        state.loading = false;
        state.error = null;
        state.Coupons=action.payload.coupons
        state.totalPages = action.payload.totalPages
        state.totalCoupons = action.payload.totalCoupons
      })

      
      .addCase(getCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to add coupon. Please try again.";
      })

      //activetoggle
      .addCase(activeToggle.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      
      .addCase(activeToggle.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to add coupon. Please try again.";
      })

      //deleteCoupon
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteCoupon.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to add coupon. Please try again.";
      })
  },
});

export const { clearCouponError } = CouponSlice.actions;

export default CouponSlice.reducer;

export const {addpage,minusPage} = CouponSlice.actions
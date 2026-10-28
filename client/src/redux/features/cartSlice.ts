import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { CartApi } from "../../utils/api"
import type { AddToCartPayload } from "../../utils/apiTypes"
import type { BaseCartItem, BaseCoupon } from "../../utils/baseTypes"
import { getGuestCart } from "../../utils/guestCart"
import type { GuestCartItem } from "../../utils/guestCart"

export type Carttype = {
  cartItems:BaseCartItem[]
  loading: boolean
  errors: null | string
  totalItems:number
  subtotal:number
  guestItems: GuestCartItem[]
  coupons:BaseCoupon[]
  discount:number,
  finalAmount:number
  coupon:string|null
  cartId:string|null
}

const initialState: Carttype = {
  cartItems:[],
  loading: false,
  errors: null,
  totalItems:0,
  subtotal:0,
  guestItems: getGuestCart(),
  coupons:[],
  discount:0,
  finalAmount:0,
  coupon:null,
  cartId:null

}

//add to cart
export const addToCart = createAsyncThunk(
  "users/addToCart",
  async (payload: AddToCartPayload, { rejectWithValue }) => {
    try {
      const response = await CartApi.addToCart(payload)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Add to cart failed. Please try again."
        )
      }

      return rejectWithValue("Add to cart failed. Please try again.")
    }
  }
)

//get cart
export const getCart = createAsyncThunk(
  "users/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await CartApi.getCart()
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            " failed to fetch cart. Please try again."
        )
      }

      return rejectWithValue("failed to fetch cart. Please try again.")
    }
  }
)


//updateCartItem
export const updateCartItem = createAsyncThunk(
  "users/updateCartItem",
  async (
    { itemId, quantity }: { itemId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await CartApi.updateCartItem(itemId, quantity)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message || "Update cart failed. Please try again."
        )
      }
      return rejectWithValue("Update cart failed. Please try again.")
    }
  }
)


export const mergeGuestCart = createAsyncThunk(
  "users/cart/mergeGuestCart",
  async (items: AddToCartPayload[], { rejectWithValue }) => {
    try {
      const response = await CartApi.mergeGuestCart(items);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to merge guest cart. Please try again."
        );
      }

      return rejectWithValue("Failed to merge guest cart. Please try again.");
    }
  }
);




//get coupons for user

export const getCoupons = createAsyncThunk(
  'cart/getCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CartApi.getCoupons()
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Get coupons failed. Please try again."
        )
      }
      return rejectWithValue("Get coupons failed. Please try again.")
    }
  }
)




//validatecoupon
export const validateCoupon = createAsyncThunk(
  'cart/validateCoupon',
  async (
    data: {
      couponID: string;
      subtotal: number;
      category: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await CartApi.validateCoupon(data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Coupon validation failed. Please try again."
        );
      }

      return rejectWithValue(
        "Coupon validation failed. Please try again."
      );
    }
  }
);






export const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setGuestItems: (state, action: PayloadAction<GuestCartItem[]>) => {
      state.guestItems = action.payload
    },
  },
  extraReducers: (build) => {
    build

      //add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true
        state.errors = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false
        
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false
        state.errors = action.payload as string
      })

      //get cart
      .addCase(getCart.pending, (state) => {
        state.loading = true
        state.errors = null
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false
        state.cartItems = action.payload.items
        state.subtotal = action.payload.subtotal
        state.totalItems = action.payload.totalItems
        
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false
        state.errors = action.payload as string
      })


      //merge guest cart
      .addCase(mergeGuestCart.pending, (state) => {
        state.loading = true
        state.errors = null
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.loading = false
        
      })
      .addCase(mergeGuestCart.rejected, (state, action) => {
        state.loading = false
        state.errors = action.payload as string
      })


      //get coupns for user
      .addCase(getCoupons.pending, (state) => {
        state.loading = true
        state.errors = null
      })
      .addCase(getCoupons.fulfilled, (state, action) => {
        state.coupons= action.payload
        state.loading = false
        
      })
      .addCase(getCoupons.rejected, (state, action) => {
        state.loading = false
        state.errors = action.payload as string
      })


      //get coupns for user
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true
        state.errors = null
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.coupon= action.payload.coupon._id
        state.finalAmount = action.payload.finalAmount
        state.discount = action.payload.discount
        state.loading = false
        
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false
        state.errors = action.payload as string
      })


      //updateQuanitty
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false
        state.cartItems = action.payload.items
        state.subtotal = action.payload.subtotal
        state.totalItems = action.payload.totalItems
        
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false
        state.errors = action.payload as string
      })

      
      
  },
})

export const { setGuestItems } = CartSlice.actions

export default CartSlice.reducer
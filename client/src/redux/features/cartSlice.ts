import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { CartApi } from "../../utils/api"
import type { AddToCartPayload, addtoCartResponse } from "../../utils/apiTypes"

export type Carttype = {
  loading: boolean
  errors: null | string
  cart: addtoCartResponse | null
}

const initialState: Carttype = {
  loading: false,
  errors: null,
  cart: null,
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

export const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build

      //add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true
        state.errors = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false
        state.errors = action.payload as string
      })
  },
})

export default CartSlice.reducer
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { orderApi } from "../../utils/api";
import type { Baseorder } from "../../utils/BaseType";

export type OrderQuery = {
    page: number
    search: string
    status: string
    payment: string
}

export type OrderStats = {
    total: number
    confirmed: number
    shipped: number
    delivered: number
}

export type OrderState = {
    orders: Baseorder[]
    loading: boolean
    error: string | null
    page: number
    pages: number | null
    totalOrders: number
    stats: OrderStats
    lastQuery: OrderQuery | null
}

const initialState: OrderState = {
    orders: [],
    loading: false,
    error: null,
    page: 1,
    pages: null,
    totalOrders: 0,
    stats: { total: 0, confirmed: 0, shipped: 0, delivered: 0 },
    lastQuery: null
}


// ================= GET ORDERS =================

export const getOrders = createAsyncThunk(
  "admin/getorders",

  async ({page,search,status,payment}:{page:number,search:string,status:string,payment:string}, { rejectWithValue }) => {
    try {

      const response = await orderApi.getOrders(page,search,status,payment)
      return response.data

    } catch (error) {

      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Failed to get orders. Please try again."
        )
      }

      return rejectWithValue(
        "Failed to get orders. Please try again."
      )
    }
  }
)


// ================= UPDATE ORDER STATUS =================

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",

  async ({id,status}:{id:string,status:string}, { rejectWithValue }) => {
    try {

      const response = await orderApi.updateOrderStatus(id,status)
      return response.data

    } catch (error) {

      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Failed to update order status. Please try again."
        )
      }

      return rejectWithValue(
        "Failed to update order status. Please try again."
      )
    }
  }
)


// ================= SLICE =================

const orderSlice = createSlice({

    name: "adminorderslice",

    initialState,

    reducers: {

        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        }

    },

    extraReducers: (build) => {

        build

        //get orders
        .addCase(getOrders.pending, (state) => {
            state.loading = true
            state.error = null
        })

        .addCase(getOrders.fulfilled, (state, action) => {
            state.loading = false
            state.orders = action.payload.orders
            state.page = action.payload.currentPage
            state.pages = action.payload.totalPages
            state.totalOrders = action.payload.totalOrders
            state.stats = action.payload.stats
            state.lastQuery = action.meta.arg
        })

        .addCase(getOrders.rejected, (state, action) => {
            state.loading = false
            state.error = (action.payload as string) || "Failed to get orders"
        })
    }
})


export default orderSlice.reducer

export const { setPage } = orderSlice.actions
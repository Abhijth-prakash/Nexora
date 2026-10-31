import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { orderApi } from "../../utils/api";
import type { Baseorder } from "../../utils/BaseType";
import type { getOrderResponse } from "../../utils/apiTypes";


export type OrderState = {
    orders:Baseorder[]
    loading:boolean
    error:string | null
}

const initialState:OrderState = {
    orders:[],
    loading:false,
    error:null
}

//get orders
export const getOrders = createAsyncThunk<getOrderResponse, void, { rejectValue: string }>(
    'admin/getorders',
    async (_,{rejectWithValue})=>{
        try{
            const response = await orderApi.getOrders()
            return response.data

        }catch(error){

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


const orderSlice = createSlice({
    name:"adminorderslice",
    initialState,
    reducers:{},
    extraReducers:(build)=>{
        build

        //get orders
        .addCase(getOrders.pending,(state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(getOrders.fulfilled,(state,action)=>{
            state.loading = false
            state.orders = action.payload

        })
        .addCase(getOrders.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload as string
        })
    }
})


export default orderSlice.reducer
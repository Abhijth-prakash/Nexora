import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { BaseAddress } from "../../utils/baseTypes";
import { addressApi } from "../../utils/api";


type AddressState = {
  address: BaseAddress[] 
  loading: boolean,
  error: string | null
}

const initialState: AddressState = {
  address: [],
  loading: false,
  error: null
}


export const getAddress = createAsyncThunk(
    'profile/getaddress',
    async (_,{rejectWithValue})=>{
        try{

            const response = await addressApi.getAddress()
            return response.data.address

        }catch(error){
              if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.error?.message ||
        "Get profile failed. Please try again."
      );
    }

    return rejectWithValue(
      "Get profile failed. Please try again."
    );
        }
    }
)

const addressSlice = createSlice({
    name:"addressSlice",
    initialState,
    reducers:{},
    extraReducers:(build)=>{
        build

        .addCase(getAddress.pending,(state)=>{
            state.loading = true
        })
        .addCase(getAddress.fulfilled,(state,action)=>{
            state.address = action.payload
            state.loading = false
        })
        .addCase(getAddress.rejected,(state,action)=>{
            state.error = action.payload as string
        })

    }

})

export default addressSlice.reducer
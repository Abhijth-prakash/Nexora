import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { BaseAddress } from "../../utils/baseTypes";
import { addressApi } from "../../utils/api";
import type { AddressFormData } from "../../utils/Validation";


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


//get address
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

//add address 

export const addAddress = createAsyncThunk(
    'profile/addAddress',
     async (addressData:AddressFormData,{rejectWithValue})=>{
        try{
            const response = await addressApi.addAddress(addressData)
            return response.data
        }catch(error){
             if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.error?.message ||
        "failed to add address. Please try again."
      );
    }

    return rejectWithValue(
      "failed to add address. Please try again."
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

        //getaddress
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

        //editAddress

        .addCase(addAddress.pending,(state)=>{
            state.loading = true
        })
        .addCase(addAddress.fulfilled,(state)=>{
            state.loading = false
        })
        .addCase(addAddress.rejected,(state,action)=>{
            state.error = action.payload as string
        })

    }

})

export default addressSlice.reducer
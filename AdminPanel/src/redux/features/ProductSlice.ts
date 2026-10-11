import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Product_Api } from "../../utils/api";


export type ProductState = {
    loading:boolean,
     error: string | null
}

const initialState:ProductState = {
    loading:false,
    error:null
}

export const addProduct = createAsyncThunk(
    'admin/addproduct',
    async (data:FormData,{rejectWithValue})=>{
        try{
            const response = await Product_Api.addProduct(data)
            return response.data

        }catch(error){

              if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Failed to add product. Please try again."
        )
      }

      return rejectWithValue(
        "Failed to add product. Please try again."
      )

        }
    }
)



const productSlice = createSlice({
    name:"productslice",
    initialState,
    reducers:{},
    extraReducers:(build)=>{
            build

            .addCase(addProduct.pending,(state,)=>{
                state.loading = true
            })
            .addCase(addProduct.fulfilled,(state,)=>{
                state.loading = false
            })
            .addCase(addProduct.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload as string
            })
    }

})



export default productSlice.reducer
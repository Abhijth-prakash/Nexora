import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Product_Api } from "../../utils/api";
import type { BaseProduct } from "../../utils/BaseType";


export type ProductState = {
    products:BaseProduct[]
    loading:boolean,
     error: string | null
     page:number,
     totalPages:number,
}

const initialState:ProductState = {
    loading:false,
    error:null,
    products:[],
    page:1,
    totalPages:1,
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


export const getProducts = createAsyncThunk(
    'admin/getproducts',
    async ({page,search,sort,filter}:{page:number,search:string,sort:string,filter:string},{rejectWithValue})=>{
        try{
            const response = await Product_Api.getProducts(page,search,sort,filter)
            return response.data

        }catch(error){

              if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Failed to get products. Please try again."
        )
      }

      return rejectWithValue(
        "Failed to get products. Please try again."
      )

        }
    }
)


export const visiblityToggle = createAsyncThunk(
    'admin/products/visible',
    async (id:string,{rejectWithValue})=>{
        try{
            const response = await Product_Api.visiblityToggle(id)
            return response.data

        }catch(error){

              if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Failed to toggle  product visiblity. Please try again."
        )
      }

      return rejectWithValue(
        "Failed to toggle  product visiblity. Please try again."
      )

        }
    }
)



const productSlice = createSlice({
    name:"productslice",
    initialState,
    reducers:{
        addpage:(state)=>{
            state.page+=1
        },
        minupage:(state)=>{
            if(state.page>1){
                state.page-=1
            }
        }
    },
    extraReducers:(build)=>{
            build

            //add product

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

            //get product
            .addCase(getProducts.pending,(state,)=>{
                state.loading = true
            })
            .addCase(getProducts.fulfilled,(state,action)=>{
                state.loading = false
                state.totalPages = Number(action.payload.totalPages)
                state.products = action.payload.products

            })
            .addCase(getProducts.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload as string
            })

            //visible product
            .addCase(visiblityToggle.pending,(state,)=>{
                state.loading = true
            })
            .addCase(visiblityToggle.fulfilled,(state,action)=>{
                state.loading = false
            })
            .addCase(visiblityToggle.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload as string
            })
    }

})



export default productSlice.reducer
export const{addpage,minupage} = productSlice.actions
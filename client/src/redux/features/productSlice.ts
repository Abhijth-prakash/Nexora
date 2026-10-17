import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Basecategory, BaseProduct } from "../../utils/baseTypes"
import axios from "axios"
import { ProductApi } from "../../utils/api"

type ProductState = {
  categories: Basecategory[]
  loading: boolean,
  error: string | null,
  products: BaseProduct[]
  product:BaseProduct | null,
  page:number,
  totalpages:number
}

const initialState: ProductState = {
  categories: [],
  loading: false,
  error: null,
  products:[],
  product:null,
  page:1,
  totalpages:3
}


//getcategories
export const getCategories = createAsyncThunk(
    'users/categories',
    async(limit:number,{rejectWithValue})=>{
        try{

            const response = await ProductApi.getCategories(limit)
            return response.data
        }catch(error){
              if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.error?.message ||
        "Get categories failed. Please try again."
      );
    }

    return rejectWithValue(
     "Get categories failed. Please try again."
    );
        }
    }
)

//get products
export const getProducts = createAsyncThunk(
    'users/products',
    async({limit,slug,page}:{limit:number,slug:string,page:number},{rejectWithValue})=>{
        try{

            const response = await ProductApi.getProducts(limit,slug,page)
            return response.data
        }catch(error){
              if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.error?.message ||
        "Get products failed. Please try again."
      );
    }

    return rejectWithValue(
       "Get products failed. Please try again."
    );
        }
    }
)


//get product by id
export const getProductbyID = createAsyncThunk(
    'users/product by id',
    async(id:string,{rejectWithValue})=>{
        try{

            const response = await ProductApi.getProductbyID(id)
            return response.data
        }catch(error){
              if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.error?.message ||
        "Get product failed. Please try again."
      );
    }

    return rejectWithValue(
       "Get product failed. Please try again."
    );
        }
    }
)




export const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
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

    //getcategories
    .addCase(getCategories.pending,(state)=>{
        state.loading = true
    })
    .addCase(getCategories.fulfilled,(state,action)=>{
        state.loading = false
        state.categories = action.payload
    })
    .addCase(getCategories.rejected,(state)=>{
        state.loading = false
    })

    //get products
    .addCase(getProducts.pending,(state)=>{
        state.loading = true
    })
    .addCase(getProducts.fulfilled,(state,action)=>{
        state.loading = false
        state.products = action.payload
    })
    .addCase(getProducts.rejected,(state)=>{
        state.loading = false
    })
    //get product by id
    .addCase(getProductbyID.pending,(state)=>{
        state.loading = true
    })
    .addCase(getProductbyID.fulfilled,(state,action)=>{
        state.loading = false
        state.product = action.payload
    })
    .addCase(getProductbyID.rejected,(state)=>{
        state.loading = false
    })
  }

})

export default ProductSlice.reducer

export const {addpage,minupage} = ProductSlice.actions
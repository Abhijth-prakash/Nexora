import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Product_Api } from "../../utils/api";
import type { BaseProduct } from "../../utils/BaseType";


export type ProductState = {
    products:BaseProduct[]
    product:BaseProduct | null
    loading:boolean,
     error: string | null
     page:number,
     totalPages:number,
     lastQuery:{
        page:number,
        search:string,
        sort:string,
        filter:string
     }|null,
     productId:string
}

const initialState:ProductState = {
    loading:false,
    error:null,
    products:[],
    page:1,
    totalPages:1,
    product:null,
    lastQuery:null,
    productId:""
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

//add variant
export const addVarient = createAsyncThunk(
    'admin/addVarient',
    async ({data,id}:{data:FormData,id:string},{rejectWithValue})=>{
        try{
            const response = await Product_Api.addVarient(id,data)
            return response.data

        }catch(error){

              if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Failed to add varient. Please try again."
        )
      }

      return rejectWithValue(
        "Failed to add varient. Please try again."
      )

        }
    }
)

export const updateProduct = createAsyncThunk(
    'admin/updateproduct',
    async ({id,data}:{id:string,data:FormData},{rejectWithValue})=>{
        try{
            const response = await Product_Api.updateProduct(id,data)
            return response.data

        }catch(error){

              if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Failed to update product. Please try again."
        )
      }

      return rejectWithValue(
        "Failed to update product. Please try again."
      )

        }
    }
)

//get products
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

//visiblity toggle
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



//delete product
export const deleteProduct = createAsyncThunk(
    'admin/products/delete',
    async (id:string,{rejectWithValue})=>{
        try{
            const response = await Product_Api.deleteProduct(id)
            return response.data

        }catch(error){

              if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Failed to delete  product visiblity. Please try again."
        )
      }

      return rejectWithValue(
        "Failed to delete  product visiblity. Please try again."
      )

        }
    }
)


//delete varient
export const deleteVarient = createAsyncThunk(
    'admin/products/varient',
    async ({id,variantId}:{id:string,variantId:string},{rejectWithValue})=>{
        try{
            const response = await Product_Api.deleteVarient(id,variantId)
            return response.data

        }catch(error){

              if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Failed to delete  product varient. Please try again."
        )
      }

      return rejectWithValue(
 "Failed to delete  product varient. Please try again."
      )

        }
    }
)


//get product by id
export const getProductbyid = createAsyncThunk(
    'admin/productsbyid',
    async (id:string,{rejectWithValue})=>{
        try{
            const response = await Product_Api.getProductbyid(id)
            return response.data

        }catch(error){

              if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Failed to get  product . Please try again."
        )
      }

      return rejectWithValue(
        "Failed to get  product . Please try again."
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
                state.lastQuery= action.meta.arg

            })
            .addCase(getProducts.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload as string
            })

            //visible product
            .addCase(visiblityToggle.pending,(state,)=>{
                state.loading = true
            })
            .addCase(visiblityToggle.fulfilled,(state)=>{
                state.loading = false
            })
            .addCase(visiblityToggle.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload as string
            })


            //delete product
            .addCase(deleteProduct.pending,(state,)=>{
                state.loading = true
            })
            .addCase(deleteProduct.fulfilled,(state,)=>{
                state.loading = false
            })
            .addCase(deleteProduct.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload as string
            })


            //get product by id
            .addCase(getProductbyid.pending, (state, action) => {
                state.loading = true;
                 if (state.productId !== action.meta.arg) {
                 state.product = null;  }
            })
            .addCase(getProductbyid.fulfilled,(state,action)=>{
                state.loading = false
                state.product = action.payload
                state.productId = action.meta.arg
            })
            .addCase(getProductbyid.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload as string
            })


            //update product 
            .addCase(updateProduct.pending,(state,)=>{
                state.loading = true
                state.productId=""
            })
            .addCase(updateProduct.fulfilled,(state,)=>{
                state.loading = false
                
            })
            .addCase(updateProduct.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload as string
            })


            //add vairent 
            .addCase(addVarient.pending,(state,)=>{
                state.loading = true
            })
            .addCase(addVarient.fulfilled,(state,)=>{
                state.loading = false
            })
            .addCase(addVarient.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload as string
            })


            //delete vairent 
            .addCase(deleteVarient.pending,(state,)=>{
                state.loading = true
            })
            .addCase(deleteVarient.fulfilled,(state,)=>{
                state.loading = false
            })
            .addCase(deleteVarient.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload as string
            })
    }

})



export default productSlice.reducer
export const{addpage,minupage} = productSlice.actions
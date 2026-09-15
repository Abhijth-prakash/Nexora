import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { BaseAdmin } from "../../utils/apiTypes";
import type { LoginData } from "../../utils/validation";
import axios from "axios";
import { Admin_Api } from "../../utils/api";


type AdminState = {
  admin: BaseAdmin | null
  loading: boolean,
  error: string | null
}

const initialState: AdminState = {
  admin: null,
  loading: false,
  error: null
}


export const login = createAsyncThunk(
    'admin/login',
    async (adminData:LoginData,{ rejectWithValue })=>{
        try{

            const response = await Admin_Api.login(adminData)
            return response.data.admin

        }catch(error){

            if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Registration failed. Please try again."
        );
      }

      return rejectWithValue(
        "Registration failed. Please try again."
      );

        }
    }
)



const adminSLice = createSlice({
    name:"adminslice",
    initialState,
    reducers:{},
    extraReducers: (build)=>{
        build

        .addCase(login.pending,(state)=>{
            state.loading = true
        })
        .addCase(login.fulfilled,(state,action)=>{
            state.loading = false
            state.admin = action.payload
        })
        .addCase(login.rejected,(state,action)=>{
            state.loading= false
            state.error = action.payload as string
        })


        
    }
}
    
) 

export default adminSLice.reducer
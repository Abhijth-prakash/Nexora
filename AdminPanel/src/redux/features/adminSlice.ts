import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { BaseAdmin } from "../../utils/BaseType";
import type { Email, LoginData,  Resetpassdata } from "../../utils/validation";
import axios from "axios";
import { Admin_Api } from "../../utils/api";


type AdminState = {
  admin: BaseAdmin | null
  loading: boolean,
  Authenticated : boolean,
  error: string | null
}

const initialState: AdminState = {
  admin: null,
  loading: false,
  error: null,
  Authenticated:false
}

//admin login
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


//admin/forgetpass

export const Forgetpass =  createAsyncThunk(
    'admin/resetpass',
    async (Email:Email, { rejectWithValue })=>{
        try{
        const response = await Admin_Api.Forgetpass(Email)
        return response.data
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

//admin/reset passs

export const resetPass = createAsyncThunk(
    "admin/forgetpass",
    async(adminData:Resetpassdata,{rejectWithValue})=>{
        try{
                const response = await Admin_Api.Resetpass(adminData)
                return response.data
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


        //login
        .addCase(login.pending,(state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(login.fulfilled,(state,action)=>{
            state.loading = false
            state.admin = action.payload
            state.Authenticated = true
            state.error = null
        })
        .addCase(login.rejected,(state,action)=>{
            state.loading= false
            state.error = action.payload as string
        })

        //forgetpass
        .addCase(Forgetpass.pending,(state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(Forgetpass.fulfilled,(state)=>{
            state.loading = false
            state.error = null
        })
        .addCase(Forgetpass.rejected,(state,action)=>{
            state.loading= false
            state.error = action.payload as string
        })

        //resetpass
        .addCase(resetPass.pending,(state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(resetPass.fulfilled,(state)=>{
            state.loading = false
            state.error = null
        })
        .addCase(resetPass.rejected,(state,action)=>{
            state.loading= false
            state.error = action.payload as string
        })


        
    }
}
    
) 

export default adminSLice.reducer
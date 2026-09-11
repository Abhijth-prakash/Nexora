import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AUTH_Api } from "../../utils/api"
import type { OtpForm, RegisterRequest } from '../../utils/Validation'
import axios from "axios"
import type { BaseUser } from "../../utils/apiTypes"


type UserState = {
  user: BaseUser | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null
}

//registering user
export const registerUser = createAsyncThunk(
  "auth/register",

  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await AUTH_Api.register(userData);

      return response.data.user;

    } catch (error) {

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
  },
);


//veirifying otp

export const veirifyingOtp = createAsyncThunk(
  "auth/veirify",

  async (otp: OtpForm, { rejectWithValue }) => {
    try {
      const response = await AUTH_Api.Veirfy(otp);
      console.log(response.data.user)
      return response.data.user;

    } catch (error) {

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
  },
);





const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
  },
  extraReducers:(build)=>{
    build
   .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Verify OTP
      .addCase(veirifyingOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(veirifyingOtp.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })

      .addCase(veirifyingOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})


export default userSlice.reducer
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AUTH_Api } from "../../utils/api"
import type {  RegisterRequest,LoginData, forgetpassDAta, Email } from '../../utils/Validation'
import axios from "axios"
import type {  Resetpass, VerifyOtpRequest } from "../../utils/apiTypes"
import type { BaseUser } from "../../utils/baseTypes"


type UserState = {
  user: BaseUser | null
  loading: boolean,
  logged: boolean,
  error: string | null,
  google: boolean
}

const initialState: UserState = {
  user: null,
  loading: false,
  logged:false,
  error: null,
  google:false
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

  async (verifyData: VerifyOtpRequest, { rejectWithValue }) => {
    try {
      const response = await AUTH_Api.Veirfy(verifyData);
      return response.data.user;

    } catch (error) {

      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "verification failed. Please try again."
        );
      }

      return rejectWithValue(
        "verification  failed. Please try again."
      );
    }
  },
);

//login user


export const Loginuser = createAsyncThunk(
  "auth/Loginuser",

  async (userData: LoginData, { rejectWithValue }) => {
    try {
      const response = await AUTH_Api.login(userData); 
      return response.data.user;

    } catch (error) {

      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Login failed. Please try again."
        );
      }

      return rejectWithValue(
        "Login failed. Please try again."
      );
    }
  },
);


//getUserProfile


export const UserProfile = createAsyncThunk(
  "auth/getUserProfile",

async (_, { rejectWithValue }) => {
  try {
    const response = await AUTH_Api.getProfile();

    return response.data.user;
  } catch (error) {
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
);


//logout


export const logout = createAsyncThunk(
  "auth/userlogout",

async (_, { rejectWithValue }) => {
  try {
    const response = await AUTH_Api.logout();

    return response.data;
  } catch (error) {
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
);


//forget-pass


export const forgetpassword = createAsyncThunk(
  "auth/Forgetpass",

  async (userEmail: forgetpassDAta, { rejectWithValue }) => {
    try {
      const response = await AUTH_Api.forgetpass(userEmail); 
      return response.data;

    } catch (error) {

      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "reset email failed to send.."
        );
      }

      return rejectWithValue(
        "reset email failed to send. Please try again."
      );
    }
  },
);


//resetpass

export const resetPass = createAsyncThunk(
  "auth/resetPass",

  async (userData:Resetpass, { rejectWithValue }) => {
    try {
      const response = await AUTH_Api.resetpass(userData); 
      return response.data;

    } catch (error) {

      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "password reset failed.."
        );
      }

      return rejectWithValue(
        "password reset failed"
      );
    }
  },
);


export const resendOtp = createAsyncThunk(
  'user/resendOtp',

  async (useremail:Email,{rejectWithValue})=>{
    try{  
      const response = await AUTH_Api.resendOtp(useremail)
      return response.data

    }catch(error){

      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "resned otp failed.."
        );
      }

      return rejectWithValue(
        "resned otp failed"
      );

    }
  }
)

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
        state.logged = true
        state.user = action.payload
      })

      .addCase(veirifyingOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      //login user
       .addCase(Loginuser.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(Loginuser.fulfilled, (state, action) => {
        state.loading = false
        state.logged = true
        state.user = action.payload
      })

      .addCase(Loginuser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      //get ptofile
        .addCase(UserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(UserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.logged = true
       state.google = !!action.payload.googleId
        state.user = action.payload
      })

      .addCase(UserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      //logout

        .addCase(logout.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.logged = false
      })

      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      //forgetpass

        .addCase(forgetpassword.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(forgetpassword.fulfilled, (state) => {
        state.loading = false
        state.logged = false
      })

      .addCase(forgetpassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      //password reset 

        .addCase(resetPass.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(resetPass.fulfilled, (state) => {
        state.loading = false
        state.logged = false
      })

      .addCase(resetPass.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })


      //resend otp 


         .addCase(resendOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false
        state.logged = false
      })

      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
  }
})


export default userSlice.reducer
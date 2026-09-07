import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AUTH_Api } from "../../utils/api"
import type { RegisterData } from '../../utils/Validation'
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


export const register = createAsyncThunk(
  "auth/register",
  async (userData:RegisterData, { rejectWithValue }) => {
    try {
      const response = await AUTH_Api.register(userData);
      console.log(response.data)
      return response.data.user;
    } catch (error) {
  if (axios.isAxiosError(error)) {
    return rejectWithValue(
      error.response?.data?.error?.message || "Registration failed. Please try again."
    )
  }
  return rejectWithValue("Registration failed. Please try again.")
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
    .addCase(register.pending,(state)=>{
        state.loading = true
    })
    .addCase(register.fulfilled,(state,action)=>{
        state.loading= false
        state.user = action.payload
    })
  }
})


export default userSlice.reducer
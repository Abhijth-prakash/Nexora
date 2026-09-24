import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { BaseUser } from "../../utils/BaseType"
import axios from "axios"
import { user_APi } from "../../utils/api"

type UserState = {
  user: BaseUser[]
  loading: boolean
  page: number
  pages: number | null
  totalUsers: number
  error: string | null
}

const initialState: UserState = {
  user: [],
  loading: false,
  error: null,
  page: 1,
  pages: null,
  totalUsers: 0,
}


// ================= GET USERS =================

export const getUser = createAsyncThunk(
  "users/getUsers",

  async ({page,search,filter}:{page:number,search:string,filter:string}, { rejectWithValue }) => {
    try {

      const response = await user_APi.getusers(page,search,filter)
      return response.data

    } catch (error) {

      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Failed to get users. Please try again."
        )
      }

      return rejectWithValue(
        "Failed to get users. Please try again."
      )
    }
  }
)



//block user

export const blockuser = createAsyncThunk(
  'admin/blockuser',
  async(userId:string,{rejectWithValue})=>{
    try{
      const response = await user_APi.blockUser(userId)
      return response.data
    }catch(error){

        if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Failed to block user. Please try again."
        )
      }

      return rejectWithValue(
        "Failed to block user. Please try again."
      )
    }
  }
)


//unblock user

export const unblockUser = createAsyncThunk(
  'admin/unblockuser',
  async(userId:string,{rejectWithValue})=>{
    try{
      const response = await user_APi.UnblockUser(userId)
      return response.data
    }catch(error){

        if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Failed to block user. Please try again."
        )
      }

      return rejectWithValue(
        "Failed to block user. Please try again."
      )
    }
  }
)


// ================= SLICE =================

const UserSlice = createSlice({

  name: "userSlice",

  initialState,

  reducers: {

    addPage: (state) => {
      state.page += 1
    },

    minusPage: (state) => {

      if (state.page > 1) {
        state.page -= 1
      }

    },

  },

  extraReducers: (builder) => {

    builder


      .addCase(getUser.pending, (state) => {

        state.loading = true
        state.error = null

      })


      .addCase(getUser.fulfilled, (state, action) => {

        state.loading = false

        state.user = action.payload.data.users

        state.page = action.payload.data.currentPage

        state.pages = action.payload.data.totalPages

        state.totalUsers = action.payload.data.totalUsers

      })

      .addCase(getUser.rejected, (state, action) => {

        state.loading = false

        state.error =
          (action.payload as string) ||
          "Failed to get users"

      })

      //block user
      .addCase(blockuser.pending,(state)=>{
        state.loading = true
      })
      .addCase(blockuser.fulfilled,(state)=>{
        state.loading = false
      })
      .addCase(blockuser.rejected,(state,action)=>{
        state.loading = false
        state.error = action.payload as string
      })

      //unblock user
      .addCase(unblockUser.pending,(state)=>{
        state.loading = true
      })
      .addCase(unblockUser.fulfilled,(state)=>{
        state.loading = false
      })
      .addCase(unblockUser.rejected,(state,action)=>{
        state.loading = false
        state.error = action.payload as string
      })

  }

})


export default UserSlice.reducer

export const {
  addPage,
  minusPage
} = UserSlice.actions
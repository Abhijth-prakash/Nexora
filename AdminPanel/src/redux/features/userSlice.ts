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

  async (page: number, { rejectWithValue }) => {
    try {

      const response = await user_APi.getusers(page)
      console.log(response.data)
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

      // ================= PENDING =================

      .addCase(getUser.pending, (state) => {

        state.loading = true
        state.error = null

      })


      // ================= SUCCESS =================

      .addCase(getUser.fulfilled, (state, action) => {

        state.loading = false

        state.user = action.payload.data.users

        state.page = action.payload.data.currentPage

        state.pages = action.payload.data.totalPages

        state.totalUsers = action.payload.data.totalUsers

      })


      // ================= ERROR =================

      .addCase(getUser.rejected, (state, action) => {

        state.loading = false

        state.error =
          (action.payload as string) ||
          "Failed to get users"

      })

  }

})


export default UserSlice.reducer

export const {
  addPage,
  minusPage
} = UserSlice.actions
import { createSlice } from "@reduxjs/toolkit"

type UserState = {
  user: string | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null
}

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
   
  },
  extraReducers:(build)=>{
    build
  }
})


export default userSlice.reducer
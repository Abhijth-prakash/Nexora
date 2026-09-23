import { configureStore } from "@reduxjs/toolkit";
import adminSlice from './features/adminSlice'
import userSlice from './features/userSlice'


export const store = configureStore({
  reducer: {
    AdminData:adminSlice,
    UsersData:userSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
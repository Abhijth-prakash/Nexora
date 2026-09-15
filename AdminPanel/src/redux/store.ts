import { configureStore } from "@reduxjs/toolkit";
import adminSlice from './features/adminSlice'


export const store = configureStore({
  reducer: {
    AdminData:adminSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
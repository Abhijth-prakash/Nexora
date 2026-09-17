import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/features/userSlice";
import addressReducer from '../redux/features/addressSlice'

export const store = configureStore({
  reducer: {
    userData: userReducer,
    addressData:addressReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
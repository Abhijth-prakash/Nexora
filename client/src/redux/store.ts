import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/features/userSlice";
import addressReducer from '../redux/features/addressSlice'
import productReducer from '../redux/features/productSlice'
import cartReducer from '../redux/features/cartSlice'

export const store = configureStore({
  reducer: {
    userData: userReducer,
    addressData:addressReducer,
    productData:productReducer,
    cartData:cartReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
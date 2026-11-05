import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/features/userSlice";
import addressReducer from '../redux/features/addressSlice'
import productReducer from '../redux/features/productSlice'
import cartReducer from '../redux/features/cartSlice'
import orderReducer from '../redux/features/orderSlice'
import walletReducer from '../redux/features/walletSlice'
export const store = configureStore({
  reducer: {
    userData: userReducer,
    addressData:addressReducer,
    productData:productReducer,
    cartData:cartReducer,
    orderData:orderReducer,
    walletData:walletReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
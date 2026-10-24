import { configureStore } from "@reduxjs/toolkit";
import adminSlice from './features/adminSlice'
import userSlice from './features/userSlice'
import categorySlice from './features/categorySlice'
import prodcutSLice from './features/ProductSlice'
import CouponSLice from './features/CouponSlice'


export const store = configureStore({
  reducer: {
    AdminData:adminSlice,
    UsersData:userSlice,
    categoryData:categorySlice,
    productData:prodcutSLice,
    couponData:CouponSLice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
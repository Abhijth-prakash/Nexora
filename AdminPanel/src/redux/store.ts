import { configureStore } from "@reduxjs/toolkit";
import adminSlice from './features/adminSlice'
import userSlice from './features/userSlice'
import categorySlice from './features/categorySlice'
import prodcutSLice from './features/ProductSlice'


export const store = configureStore({
  reducer: {
    AdminData:adminSlice,
    UsersData:userSlice,
    categoryData:categorySlice,
    productData:prodcutSLice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
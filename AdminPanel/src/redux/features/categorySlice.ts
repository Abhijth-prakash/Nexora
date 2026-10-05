import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Basecategory } from "../../utils/BaseType";
import { Categroy_APi } from "../../utils/api";
import axios from "axios";
import type { categoryData } from "../../utils/validation";

export type CategoryState = {
    categories: Basecategory[];
    loading: boolean;
    error: string | null;
};

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};


//getallcatergories
export const getAllCategories = createAsyncThunk(
    "admin/categories/getall",
    async (_, { rejectWithValue }) => {
        try {
            const response = await Categroy_APi.getCategories();

            return response.data;

        } catch (error) {

            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.error?.message ||
                    "Failed to get categories. Please try again."
                );
            }

            return rejectWithValue(
                "Failed to get categories. Please try again."
            );
        }
    }
);

//addCategory

export const addCategory = createAsyncThunk(
    'admin/addCategory',
    async (data:categoryData,{rejectWithValue})=>{
        try{
            const response = await Categroy_APi.addCategory(data)
            return response.data

        }catch(error){
             if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.error?.message ||
                    "Failed to add categories. Please try again."
                );
            }

            return rejectWithValue(
                "Failed to add categories. Please try again."
            );
        }
    }
)

const categorySlice = createSlice({
    name: "categorySlice",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

            //getting categories
            .addCase(getAllCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload
            })

            .addCase(getAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //adding categories
            .addCase(addCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(addCategory.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(addCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export default categorySlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Basecategory } from "../../utils/BaseType";
import { Categroy_APi } from "../../utils/api";
import axios from "axios";

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

const categorySlice = createSlice({
    name: "categorySlice",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder
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
            });
    }
});

export default categorySlice.reducer;
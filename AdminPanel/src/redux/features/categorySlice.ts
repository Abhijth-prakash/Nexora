import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Basecategory, BaseSubcategory } from "../../utils/BaseType";
import { Categroy_APi } from "../../utils/api";
import axios from "axios";
import type { categoryData } from "../../utils/validation";


export type CategoryState = {
  categories: Basecategory[];
  category: Basecategory | null;
  loading: boolean;
  error: string | null;
  subCategories: BaseSubcategory[];
  fetched: boolean;
  fetchByid: boolean;
  Catid: string | null;
  page:number
  totalPages :number
  totalCategries:number|null
  lastQuery: {
  page: number
  search: string
  filter: string
} | null
};

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  subCategories: [],
  category: null,
  fetched: false,
  fetchByid: false,
  Catid: null,
  page:1,
  totalPages:1,
  totalCategries:null,
  lastQuery:null
};

//getcatergories
export const getCategories = createAsyncThunk(
  "admin/categories/",
  async ({page,search,filter}:{page:number,search:string,filter:string}, { rejectWithValue }) => {
    try {
      const response = await Categroy_APi.getCategories(page,search,filter);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to get categories. Please try again.",
        );
      }

      return rejectWithValue("Failed to get categories. Please try again.");
    }
  },
);


//getallcatergories
export const getallCategories = createAsyncThunk(
  "admin/categories/all",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Categroy_APi.getallCategories();

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to get categories. Please try again.",
        );
      }

      return rejectWithValue("Failed to get categories. Please try again.");
    }
  },
);

//addCategory

export const addCategory = createAsyncThunk(
  "admin/addCategory",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await Categroy_APi.addCategory(data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to add categories. Please try again.",
        );
      }

      return rejectWithValue("Failed to add categories. Please try again.");
    }
  },
);

//get categroy by id

export const getCategory = createAsyncThunk(
  "admin/getCategory",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await Categroy_APi.getCategory(id);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to get category. Please try again.",
        );
      }

      return rejectWithValue("Failed to get category. Please try again.");
    }
  },
);


//delete category

export const deleteCategory = createAsyncThunk(
    'admin/deleteCategory',
    async(id:string,{rejectWithValue})=>{
        try{
            const response = await Categroy_APi.deleteCategory(id)
            return response.data

        }catch(error){

                  if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to delete category. Please try again.",
        );
      }

      return rejectWithValue("Failed to delte category. Please try again.");

        }
    }
)

//update category

export const updateCategory = createAsyncThunk(
    "admin/updateCategory",
    async (
        { data, id }: { data: FormData; id: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await Categroy_APi.updateCategory(data, id)

            return response.data

        } catch (error) {

            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.error?.message ||
                    "Failed to update category. Please try again."
                )
            }

            return rejectWithValue(
                "Failed to update category. Please try again."
            )
        }
    }
)

//hide category
export const hideCategory = createAsyncThunk(
    "admin/hideCategory",
    async (
        id:string,
        { rejectWithValue }
    ) => {
        try {
            const response = await Categroy_APi.hideCategory(id)

            return response.data

        } catch (error) {

            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.error?.message ||
                    "Failed to hide category. Please try again."
                )
            }

            return rejectWithValue(
                "Failed to hide category. Please try again."
            )
        }
    }
)


export const unhideCategory = createAsyncThunk(
    "admin/unhideCategory",
    async (
        id:string,
        { rejectWithValue }
    ) => {
        try {
            const response = await Categroy_APi.unhideCategory(id)

            return response.data

        } catch (error) {

            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.error?.message ||
                    "Failed to unhide category. Please try again."
                )
            }

            return rejectWithValue(
                "Failed to unhide category. Please try again."
            )
        }
    }
)


//delete subCategory



export const deleteSubCategory = createAsyncThunk(
    "admin/deleteSubCategory",
    async (
       {  id,subId }: { id: string; subId: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await Categroy_APi.deleteSubCategory(id,subId)

            return response.data

        } catch (error) {

            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.error?.message ||
                    "Failed to delete  subcategory. Please try again."
                )
            }

            return rejectWithValue(
                  "Failed to delete  subcategory. Please try again."
            )
        }
    }
)





const categorySlice = createSlice({
  name: "categorySlice",

  initialState,

  reducers: {
    addpage: (state)=>{
        state.page +=1
    },
    minuspage:(state)=>{
        if(state.page>1){
            state.page -=1
        }
    },
    // go back to the first page (used when search or filter changes)
    resetpage:(state)=>{
        state.page = 1
    }
  },

  extraReducers: (builder) => {
    builder

      //getting categories
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.categories = action.payload.categories
        state.totalCategries = action.payload.totalCategries
        state.totalPages = action.payload.totalPages
        state.lastQuery= action.meta.arg

        // if the current page no longer exists (e.g. filter left fewer pages,
        // or the last item on the last page was deleted), jump to the last valid page.
        // Changing `page` makes the component's useEffect fetch that page.
        if (state.totalPages > 0 && state.page > state.totalPages) {
          state.page = state.totalPages
        }
      })

      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      //getting aallcategories
      .addCase(getallCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getallCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.categories = action.payload
      })

      .addCase(getallCategories.rejected, (state, action) => {
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
      })

      //get category by id
      .addCase(getCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.category = null;
        state.subCategories = [];
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload.category;
        state.subCategories = action.payload.subCategories;
        state.fetchByid = true;
        state.Catid = action.payload.category._id;
      })

      .addCase(getCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //delete category

      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
    
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //hide category
      .addCase(hideCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
    
      })
      .addCase(hideCategory.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(hideCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })



        //unhide category
      .addCase(unhideCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
    
      })
      .addCase(unhideCategory.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(unhideCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      //deleteSubcategory
      .addCase(deleteSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
    
      })
      .addCase(deleteSubCategory.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


    
  },
});

export default categorySlice.reducer;
export const{addpage,minuspage,resetpage} = categorySlice.actions
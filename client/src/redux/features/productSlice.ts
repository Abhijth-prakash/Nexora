import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Basecategory, BaseProduct } from "../../utils/baseTypes"
import axios from "axios"
import { CartApi, ProductApi } from "../../utils/api"
import type { CategoryTreeItem } from "../../utils/apiTypes"
import type { PayloadAction } from "@reduxjs/toolkit"

type ProductState = {
  categories: Basecategory[]
  loading: boolean
  error: string | null
  products: BaseProduct[]
  product: BaseProduct | null
  page: number
  totalpages: number
  categoryTree: CategoryTreeItem[]
  brand: string[]
  brands: string[]
  category: string
  subCategory: string
  sort: string
  minPrice: number
  maxPrice: number
  categoriesLimit: number | null
  productsKey: string | null
}

const initialState: ProductState = {
  categories: [],
  loading: false,
  error: null,
  products: [],
  product: null,
  page: 1,
  totalpages: 3,
  categoryTree: [],
  brand: [],
  brands: [],
  category: '',
  subCategory: '',
  sort: '',
  minPrice: 0,
  maxPrice: 10000,
  categoriesLimit: null,
  productsKey: null
}

type GetProductsArgs = {
  limit: number
  slug: string
  page: number
  subCategory: string
  category: string
  brand: string[]
  minprice: number
  maxprice: number
  sort: string
}

const getProductState = (getState: () => unknown) =>
  (getState() as { productData: ProductState }).productData

// get categories
export const getCategories = createAsyncThunk(
  'users/categories',
  async (limit: number, { rejectWithValue }) => {
    try {
      const response = await ProductApi.getCategories(limit)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Get categories failed. Please try again."
        )
      }
      return rejectWithValue("Get categories failed. Please try again.")
    }
  },
  {
    condition: (limit, { getState }) => {
      const s = getProductState(getState)
      if (s.categories.length > 0 && s.categoriesLimit === limit) return false
    }
  }
)

// get products
export const getProducts = createAsyncThunk(
  'users/products',
  async (
    { limit, slug, page, subCategory, category, brand, minprice, maxprice, sort }: GetProductsArgs,
    { rejectWithValue }
  ) => {
    try {
      const response = await ProductApi.getProducts(limit, slug, page, subCategory, category, brand, minprice, maxprice, sort)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Get products failed. Please try again."
        )
      }
      return rejectWithValue("Get products failed. Please try again.")
    }
  },
  {
    condition: (args, { getState }) => {
      const s = getProductState(getState)
      if (s.products.length > 0 && s.productsKey === JSON.stringify(args)) return false
    }
  }
)

// get product by id
export const getProductbyID = createAsyncThunk(
  'users/product by id',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ProductApi.getProductbyID(id)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
          "Get product failed. Please try again."
        )
      }
      return rejectWithValue("Get product failed. Please try again.")
    }
  }
)

// get category tree
export const getCategoryTree = createAsyncThunk(
  'users/categoryTree',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ProductApi.getCategoryTree()
      return response.data
    } catch (error) {
      return rejectWithValue("Failed to load categories")
    }
  },
  {
    condition: (_, { getState }) => {
      if (getProductState(getState).categoryTree.length > 0) return false
    }
  }
)



export const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addpage: (state) => {
      state.page += 1
    },
    minupage: (state) => {
      if (state.page > 1) {
        state.page -= 1
      }
    },
    setBrand: (state, action: PayloadAction<string[]>) => {
      state.brand = action.payload
      state.page = 1
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload
      state.subCategory = ''
      state.page = 1
    },
    setSubCategory: (state, action: PayloadAction<string>) => {
      state.subCategory = action.payload
      state.page = 1
    },

    // Clear cached products when entering the home page
    clearProducts: (state) => {
      state.products = []
      state.productsKey = null
    },

    resetFilters: (state) => {
      state.brand = []
      state.brands = []
      state.category = ''
      state.subCategory = ''
      state.sort = ''
      state.minPrice = 0
      state.maxPrice = 10000
      state.page = 1
      state.products = []
      state.productsKey = null
    },
  },
  extraReducers: (build) => {
    build
      // get categories
      .addCase(getCategories.pending, (state) => {
        state.loading = true
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
        state.categoriesLimit = action.meta.arg
      })
      .addCase(getCategories.rejected, (state) => {
        state.loading = false
      })

      // get products
      .addCase(getProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
        state.brands = [...new Set(action.payload.map(product => product.brand))]
        state.productsKey = JSON.stringify(action.meta.arg)
      })
      .addCase(getProducts.rejected, (state) => {
        state.loading = false
      })

      // get product by id
      .addCase(getProductbyID.pending, (state) => {
        state.loading = true
        state.product = null
      })
      .addCase(getProductbyID.fulfilled, (state, action) => {
        state.loading = false
        state.product = action.payload
      })
      .addCase(getProductbyID.rejected, (state) => {
        state.loading = false
      })

      // get category tree
      .addCase(getCategoryTree.pending, (state) => {
        state.loading = true
      })
      .addCase(getCategoryTree.fulfilled, (state, action) => {
        state.loading = false
        state.categoryTree = action.payload
      })
      .addCase(getCategoryTree.rejected, (state) => {
        state.loading = false
      })
  }
})

export default ProductSlice.reducer

export const {
  addpage,
  minupage,
  setBrand,
  setCategory,
  setSubCategory,
  clearProducts,
  resetFilters
} = ProductSlice.actions
import type { BaseAdmin, Basecategory, BaseUser,BaseSubcategory, BaseProduct,BaseCoupon } from "./BaseType"


export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}



//auth
export type LoginResponse = {
    admin:BaseAdmin
}

export type LogoutResponse = null

export type Forgetpass = null
export type Resetpass = null



//users
export type GetUsersResponse = {
  data:{
  users:[]
  totalUsers: number,
  totalPages: number,
  currentPage: number,
  limit: number
  } 
  users: BaseUser[]
}

export type BlockUserresponse = null
export type UnBlockUserresponse = null



//category

export type GetCategoryResponse = {
  categories:Basecategory[]
  totalCategries:number
  totalPages:number
}

export type getallCategoryRespose = Basecategory[]


export type AddCategoryResponse = null
export type GetCategoryByidResponse = {
  category: Basecategory;
  subCategories: BaseSubcategory[];
};
export type deleteCategoryResponse = null
export type updateCategoryResponse = null
export type hideCategoryResponse = null
export type unHideCategoryResponse = null

export type deleteSubCategoryResponse = null



//products

export type AddProductResponse = null

export type getProductsResponse = {
 products: BaseProduct[]
 totalPages: string
}

export type visibleResponse = null

export type updateProductResponse = null

export type addVarientResponse = null
export type deleteVarientResponse = null
export type getProductbyidResponse = BaseProduct


//coupons

export type addCouponResponse = null

export type GetCouponsResponse = {
  coupons: BaseCoupon[];
  totalPages: number;
  currentPage: number;
  totalCoupons: number;
};

export type activeToggleresponse = null


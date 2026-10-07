import type { BaseAdmin, Basecategory, BaseUser,BaseSubcategory } from "./BaseType"


export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}


export type LoginResponse = {
    admin:BaseAdmin
}

export type LogoutResponse = null

export type Forgetpass = null
export type Resetpass = null


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



export type GetCategoryResponse = {
  categories:Basecategory[]
  totalCategries:number
  totalPages:number
}


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


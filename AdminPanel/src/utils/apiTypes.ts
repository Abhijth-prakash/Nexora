import type { BaseAdmin, Basecategory, BaseUser } from "./BaseType"


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



export type GetCategoryResponse = Basecategory[]
export type AddCategoryResponse = null

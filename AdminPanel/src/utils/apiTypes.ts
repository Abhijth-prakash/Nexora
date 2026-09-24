import type { BaseAdmin, BaseUser } from "./BaseType"


export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}


export type LoginResponse = {
    admin:BaseAdmin
}

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
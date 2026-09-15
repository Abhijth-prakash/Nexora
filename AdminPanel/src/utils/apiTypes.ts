export type BaseAdmin={
  _id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}


export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}


export type LoginResponse = {
    admin:BaseAdmin
}

export type Forgetpass = null
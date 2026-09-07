

export type BaseUser = {
  _id: string
  name: string
  email: string
  Verified: boolean
  createdAt: string
  updatedAt: string
}

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type RegisterRes = {
  user: BaseUser
}


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

export type VerifyOtpResponse = {
  user: BaseUser
  expiresIn: string
  verification: {
    emailVerified: boolean
    verifiedAt: string
  }
}

export type VerifyOtpRequest = {
  otp: string
  email: string
}

export type LoginResponse = {
  user: BaseUser
}
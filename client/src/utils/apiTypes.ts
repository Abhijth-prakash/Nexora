import  type { BaseUser,BaseAddress } from "./baseTypes"

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

export type profileResponse = {
  user: BaseUser,
}

export type LogoutResponse = null

export type ForgetpassResponse = null

export type Resetpass= {
  token:string | null,
  password:string
}

export type resetpassResponse = null


export type AddressResponse = {
  address: BaseAddress[]
}

export type addAddressResponse = null

export type deleteAddressResponse = null

export type updateAddressResponse = null

export type resendOtpResponse = null
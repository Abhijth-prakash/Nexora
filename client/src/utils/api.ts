import axios from "axios";
import { BASE_URL } from '../config'
import type {  RegisterRequest,LoginData, forgetpassDAta, AddressFormData, Addressid } from '../utils/Validation'
import type { addAddressResponse, AddressResponse, ApiResponse, deleteAddressResponse, ForgetpassResponse, LoginResponse, LogoutResponse, profileResponse, RegisterRes,Resetpass,resetpassResponse,VerifyOtpRequest,VerifyOtpResponse } from '../utils/apiTypes'


const ClientApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

//auth_api

export const AUTH_Api = {
  register: async (userData: RegisterRequest): Promise<ApiResponse<RegisterRes>> => {
    const response = await ClientApi.post<ApiResponse<RegisterRes>>("/auth/register", userData)
    return response.data
  },
  Veirfy: async (verifyData: VerifyOtpRequest): Promise<ApiResponse<VerifyOtpResponse>> => {
  const response = await ClientApi.post<ApiResponse<VerifyOtpResponse>>("/auth/verify",verifyData)
  return response.data
},
  login: async (userData: LoginData): Promise<ApiResponse<LoginResponse>> => {
  const response = await ClientApi.post<ApiResponse<LoginResponse>>("/auth/login",userData)
  return response.data
},
  getProfile: async (): Promise<ApiResponse<profileResponse>> => {
  const response = await ClientApi.get<ApiResponse<profileResponse>>("/auth/user")
  return response.data
},
    logout: async (): Promise<ApiResponse<LogoutResponse>> => {
  const response = await ClientApi.get<ApiResponse<LogoutResponse>>("/auth/logout")
  return response.data
},

 forgetpass: async (userEmail: forgetpassDAta): Promise<ApiResponse<ForgetpassResponse>> => {
  const response = await ClientApi.post<ApiResponse<ForgetpassResponse>>("/auth/forgetpassword",userEmail)
  return response.data
},
  resetpass: async (userData: Resetpass): Promise<ApiResponse<resetpassResponse>> => {
  const response = await ClientApi.post<ApiResponse<ForgetpassResponse>>("/auth/resetpassword",userData)
  return response.data
},

}

//address api 

export const addressApi = {

  getAddress: async (): Promise<ApiResponse<AddressResponse>> =>{
    const response = await ClientApi.get<ApiResponse <AddressResponse>>('/profile/address')
    return response.data
  },
  addAddress: async (addressData:AddressFormData): Promise<ApiResponse<addAddressResponse>> =>{
    const response = await ClientApi.post<ApiResponse <addAddressResponse>>('/profile/address',addressData)
    return response.data
  },
  deleteAddress: async (id: Addressid): Promise<ApiResponse<deleteAddressResponse>> => {
  const response = await ClientApi.delete<ApiResponse<deleteAddressResponse>>("/profile/address", {data: { id }})
  return response.data
},

}



export default ClientApi;
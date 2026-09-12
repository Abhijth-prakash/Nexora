import axios from "axios";
import { BASE_URL } from '../config'
import type {  RegisterRequest,LoginData } from '../utils/Validation'
import type { ApiResponse, LoginResponse, RegisterRes,VerifyOtpRequest,VerifyOtpResponse } from '../utils/apiTypes'

const ClientApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

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
}



export default ClientApi;
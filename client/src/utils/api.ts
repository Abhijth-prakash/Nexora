import axios from "axios";
import { BASE_URL } from '../config'
import type { OtpForm, RegisterRequest } from '../utils/Validation'
import type { ApiResponse, RegisterRes,VerifyOtpResponse } from '../utils/apiTypes'

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
  Veirfy: async (otp: OtpForm): Promise<ApiResponse<VerifyOtpResponse>> => {
  const response = await ClientApi.post<ApiResponse<VerifyOtpResponse>>("/auth/verify",otp)
  return response.data
},
}



export default ClientApi;
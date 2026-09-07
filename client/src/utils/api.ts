import axios from "axios";
import { BASE_URL } from '../config'
import type { RegisterData } from '../utils/Validation'
import type { ApiResponse, RegisterRes } from '../utils/apiTypes'

const ClientApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

export const AUTH_Api = {
  register: async (userData: RegisterData): Promise<ApiResponse<RegisterRes>> => {
    const response = await ClientApi.post<ApiResponse<RegisterRes>>("/auth/register", userData)
    return response.data
  }
}

export default ClientApi;
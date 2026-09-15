import axios from "axios";
import { BASE_URL } from '../config'
import type { LoginData } from "./validation";
import type { ApiResponse,LoginResponse } from "./apiTypes";


const ClientApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});


export const Admin_Api = {
  login: async (AdminData:LoginData ): Promise<ApiResponse<LoginResponse>> => {
    const response = await ClientApi.post<ApiResponse<LoginResponse>>("/admin/login", AdminData)
    return response.data
  },
}




export default ClientApi;
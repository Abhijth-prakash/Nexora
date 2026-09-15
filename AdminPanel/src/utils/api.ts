import axios from "axios";
import { BASE_URL } from '../config'
import type { Email, LoginData, passwordData, Resetpassdata } from "./validation";
import type { ApiResponse,Forgetpass,LoginResponse, Resetpass } from "./apiTypes";


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
  Forgetpass: async (Email:Email ): Promise<ApiResponse<Forgetpass>> => {
    const response = await ClientApi.post<ApiResponse<Forgetpass>>("/admin/forgetpass", Email)
    return response.data
  },
  Resetpass: async (adminData:Resetpassdata ): Promise<ApiResponse<Resetpass>> => {
    const response = await ClientApi.post<ApiResponse<Resetpass>>("/admin/resetpass", adminData)
    return response.data
  },
}




export default ClientApi;
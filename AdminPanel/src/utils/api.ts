import axios from "axios";
import { BASE_URL } from '../config'
import type { Email, LoginData,  Resetpassdata } from "./validation";
import type { ApiResponse,BlockUserresponse,Forgetpass,GetUsersResponse,LoginResponse, Resetpass } from "./apiTypes";


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

export const user_APi = {
  getusers: async (page: number): Promise<ApiResponse<GetUsersResponse>> => {
  const response = await ClientApi.get<ApiResponse<GetUsersResponse>>("/admin/users/view",{params: {page}})
  return response.data
  },
  blockUser: async (userId: string): Promise<ApiResponse<BlockUserresponse>> => {
  const response = await ClientApi.post<ApiResponse<BlockUserresponse>>("/admin/users/block",{userId})
  return response.data
  },

}




export default ClientApi;
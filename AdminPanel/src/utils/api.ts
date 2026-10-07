import axios from "axios";
import { BASE_URL } from '../config'
import type { categoryData, Email, LoginData,  Resetpassdata } from "./validation";
import type { AddCategoryResponse, ApiResponse,BlockUserresponse,deleteCategoryResponse,deleteSubCategoryResponse,Forgetpass,GetCategoryByidResponse,GetCategoryResponse,GetUsersResponse,hideCategoryResponse,LoginResponse, LogoutResponse, Resetpass, UnBlockUserresponse, unHideCategoryResponse, updateCategoryResponse } from "./apiTypes";


const ClientApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

//adminAuth
export const Admin_Api = {
  login: async (AdminData:LoginData ): Promise<ApiResponse<LoginResponse>> => {
    const response = await ClientApi.post<ApiResponse<LoginResponse>>("/admin/login", AdminData)
    return response.data
  },
  logout: async ( ): Promise<ApiResponse<LogoutResponse>> => {
    const response = await ClientApi.get<ApiResponse<LogoutResponse>>("/admin/logout")
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
//adminuserApi
export const user_APi = {
  getusers: async (page:number,search:string,filter:string): Promise<ApiResponse<GetUsersResponse>> => {
  const response = await ClientApi.get<ApiResponse<GetUsersResponse>>("/admin/users/view",{params: {page,search,filter}})
  return response.data
  },
  blockUser: async (userId: string): Promise<ApiResponse<BlockUserresponse>> => {
  const response = await ClientApi.post<ApiResponse<BlockUserresponse>>("/admin/users/block",{userId})
  return response.data
  },
  UnblockUser: async (userId: string): Promise<ApiResponse<UnBlockUserresponse>> => {
  const response = await ClientApi.post<ApiResponse<UnBlockUserresponse>>("/admin/users/unblock",{userId})
  return response.data
  },

}

//category
export const Categroy_APi = {
  getCategories: async (): Promise<ApiResponse<GetCategoryResponse>> =>{
    const response = await ClientApi.get<ApiResponse<GetCategoryResponse>>("/admin/category")
    return response.data
  },
  getCategory: async (id:string): Promise<ApiResponse<GetCategoryByidResponse>> =>{
    const response = await ClientApi.get<ApiResponse<GetCategoryByidResponse>>(`/admin/category/${id}`)
    return response.data
  },
  addCategory: async (data:categoryData): Promise<ApiResponse<AddCategoryResponse>> =>{
    const response = await ClientApi.post<ApiResponse<AddCategoryResponse>>("/admin/category",data)
    return response.data
  },
    deleteCategory: async (id:string): Promise<ApiResponse<deleteCategoryResponse>> =>{
    const response = await ClientApi.delete<ApiResponse<deleteCategoryResponse>>(`/admin/category/${id}`)
    return response.data
  },
updateCategory: async (Data: categoryData,id: string): Promise<ApiResponse<updateCategoryResponse>> => {
    const response = await ClientApi.patch<ApiResponse<updateCategoryResponse>>(`/admin/category/${id}`,Data)
    return response.data
},
hideCategory: async (id: string): Promise<ApiResponse<hideCategoryResponse>> => {
    const response = await ClientApi.post<ApiResponse<hideCategoryResponse>>(`/admin/category/hide/${id}`)
    return response.data
},
unhideCategory: async (id: string): Promise<ApiResponse<unHideCategoryResponse>> => {
    const response = await ClientApi.post<ApiResponse<unHideCategoryResponse>>(`/admin/category/unhide/${id}`)
    return response.data
},
deleteSubCategory: async (id: string,subId:string): Promise<ApiResponse<deleteSubCategoryResponse>> => {
    const response = await ClientApi.delete<ApiResponse<deleteSubCategoryResponse>>(`/admin/category/subCategory/${id}/${subId}`)
    return response.data
},
}





export default ClientApi;
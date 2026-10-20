import axios from "axios";
import { BASE_URL } from '../config'
import type {  RegisterRequest,LoginData, forgetpassDAta, AddressFormData, Addressid, Email, passData, ProfileData } from '../utils/Validation'
import type { addAddressResponse, AddressResponse, AddToCartPayload, addtoCartResponse, ApiResponse, CartResponse, categoryresponse, CategoryTreeItem, changepasswordresponse, deleteAddressResponse, editProfileResponse, ForgetpassResponse, LoginResponse, LogoutResponse, productResponse, profileResponse, RegisterRes,resendOtpResponse,Resetpass,resetpassResponse,updateAddressResponse,VerifyOtpRequest,VerifyOtpResponse } from '../utils/apiTypes'
import type { BaseProduct } from "./baseTypes";


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
  resendOtp: async (userEmail: Email): Promise<ApiResponse<resendOtpResponse>> => {
   const response = await ClientApi.post<ApiResponse<resendOtpResponse>>( "/auth/resendOtp", { email: userEmail })

  return response.data
},
  changepassword: async (passwords:passData): Promise<ApiResponse<changepasswordresponse>> => {
   const response = await ClientApi.post<ApiResponse<changepasswordresponse>>( "/auth/changePassword", passwords)

  return response.data
},
  editProfile: async (profileData:ProfileData): Promise<ApiResponse<editProfileResponse>> => {
   const response = await ClientApi.post<ApiResponse<editProfileResponse>>( "/auth/editProfile", profileData)

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
  updateAddress: async (updateData: AddressFormData,id: string): Promise<ApiResponse<updateAddressResponse>> => {
  const response = await ClientApi.patch<ApiResponse<updateAddressResponse>>(`/profile/address/${id}`,updateData
  )

  return response.data
},
  deleteAddress: async (id: Addressid): Promise<ApiResponse<deleteAddressResponse>> => {
  const response = await ClientApi.delete<ApiResponse<deleteAddressResponse>>("/profile/address", {data: { id }})
  return response.data
},

}

export const ProductApi = {
  getCategories: async (limit: number): Promise<ApiResponse<categoryresponse>> => {
    const response = await ClientApi.get<ApiResponse<categoryresponse>>('/users/category', {
      params: { limit },
    })
    return response.data
  },
  getProducts: async (limit: number,slug:string,page:number,subCategory:string,category:string,brand:string[],minprice:number,maxprice:number,sort:string): Promise<ApiResponse<productResponse>> => {
    const response = await ClientApi.get<ApiResponse<productResponse>>('/users/products', {
      params: { limit,slug,page,subCategory,category,brand:brand.join(','),minprice,maxprice,sort },
    })
    return response.data
  },
  getProductbyID: async (id:string): Promise<ApiResponse<BaseProduct>> => {
    const response = await ClientApi.get<ApiResponse<BaseProduct>>('/users/product', {
      params: { id },
    })
    return response.data
  },
  getCategoryTree: async (): Promise<ApiResponse<CategoryTreeItem[]>> => {
  const response = await ClientApi.get<ApiResponse<CategoryTreeItem[]>>('/users/category-tree')
  return response.data
},
}

export const CartApi = {
  addToCart: async (
    payload: AddToCartPayload
  ): Promise<ApiResponse<addtoCartResponse>> => {
    const response = await ClientApi.post<ApiResponse<addtoCartResponse>>(
      "/users/cart",
      payload
    );
    return response.data;
  },
  getCart: async (
  ): Promise<ApiResponse<CartResponse>> => {
    const response = await ClientApi.get<ApiResponse<CartResponse>>(
      "/users/cart",
    );
    return response.data;
  },
  
  updateCartItem: async (
  itemId: string,
  quantity: number
): Promise<ApiResponse<CartResponse>> => {
  const response = await ClientApi.patch<ApiResponse<CartResponse>>(
    `/users/cart/${itemId}`,
    { quantity }
  );
  return response.data;
},
};



export default ClientApi;
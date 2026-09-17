export type BaseUser = {
  _id: string
  name: string
  email: string
  Verified: boolean
  createdAt: string
  updatedAt: string
}

export type BaseAddress = {
    _id: string,
    user: string,
    type: string,
    fullName: string,
    phone: string,
    address: string,
    country:string,
    city:string,
    state:string,
    zipCode:string,
    isDefault:boolean

}
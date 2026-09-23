export type BaseUser = {
    _id: string,
    name:string,
    email:string,
    verified:boolean,
    banned:boolean
}


export type BaseAdmin={
  _id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

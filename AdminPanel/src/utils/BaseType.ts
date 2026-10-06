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


export type Basecategory={
    _id: string
    name:string
    description:string
    isVisible:boolean
    productCount:number
    slug:string
}

export type BaseSubcategory={
    _id: string
    name:string
    isVisible:boolean
}
export type BaseUser = {
  _id: string
  name: string
  email: string
  verified: boolean
  createdAt: string
  updatedAt: string,
  googleId: string
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

export type Basecategory={
    _id: string
    name:string
    description:string
    isVisible:boolean
    productCount:number
    slug:string
}

export type BaseProduct = {
  _id: string;
  name: string;
  description: string;
  color?: string;
  brand: string;
  stock: number;
  category: {
    _id: string;
    name: string;
  };
  subCategory: {
    _id: string;
    name: string;
  };
  visible: boolean;
  price: number;
  size: string[];
  rating: number;
  numReviews: number;
  images: string[];
  variants: BaseVarient[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type BaseVarient = {
  _id?: string;
  color?: string;
  size?: string[];
  price: number;
  stock: number;
  images: string[];
  rating: number;
};



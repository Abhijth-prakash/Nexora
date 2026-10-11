import { useState } from "react"
import ProductForm from "./ProductForm"


const Product = () => {
  const [form,setForm] = useState(false)

  const formHandle = ()=>{
    setForm(true)
  }

  const onClose = ()=>{
    setForm(false)
  }

  return (
    <div>
      {form&&<ProductForm onClose={onClose}></ProductForm>}
      <h1>this is products page</h1>
      <button onClick={formHandle}>add product</button>
      
    </div>
  )
}

export default Product

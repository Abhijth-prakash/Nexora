import { useEffect, useState } from "react"
import ProductForm from "./ProductForm"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { getProducts } from "../../redux/features/ProductSlice"
import {addpage,minupage} from '../../redux/features/ProductSlice'



const Product = () => {
  const [form,setForm] = useState(false)
  const dispatch = useAppDispatch()
  const {products,page,totalPages} = useAppSelector(state=> state.productData)
  const [search,setSearch] = useState("")
  const [filter,setFilter] = useState("")
  const [sort,setSort] = useState("")


  const formHandle = ()=>{
    setForm(true)
  }

  const onClose = ()=>{
    setForm(false)
  }


  useEffect(()=>{
    dispatch(getProducts({page,search,sort}))
  },[page,search,sort])

const listItems = products && products.map(item=> <li key={item._id}>
  <span>{item.name}</span>
  <span>{item.brand}</span>
  <span>{item.category.name}</span>
  <span>{item.subCategory.name}</span>
  <span>{item.description}</span>
  <span>{item.stock}</span>
  <span>{item.visible}</span>
  <button>view</button>
  <button>edit</button>
  <button>delete</button>

</li>)
  return (

    <div>
      {/* sort */}
       <select
                                value={sort}
                                onChange={(e) =>
                                    setSort(e.target.value)
                                }
                                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-[#e3dcd8] bg-white px-4 pr-10 text-sm font-medium text-gray-700 outline-none transition hover:border-[#ffb0a4] focus:border-[#ff624d] focus:ring-4 focus:ring-[#ff624d]/10"
                            >

                                <option value="">
                                    Relevance
                                </option>

                                <option value="low">
                                    low price
                                </option>

                                <option value="high">
                                      high price
                                </option>

                            </select>

                                <br /> <br />



       <select
                                value={filter}
                                onChange={(e) =>
                                    setFilter(e.target.value)
                                }
                                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-[#e3dcd8] bg-white px-4 pr-10 text-sm font-medium text-gray-700 outline-none transition hover:border-[#ffb0a4] focus:border-[#ff624d] focus:ring-4 focus:ring-[#ff624d]/10"
                            >

                                <option value="">
                                    Relevance
                                </option>

                                <option value="low">
                                    low price
                                </option>

                                <option value="high">
                                      high price
                                </option>

                            </select>

                                <br /> <br />




      <input type="text" placeholder="search" value={search} onChange={(e)=> setSearch(e.target.value)} />
      {form&&<ProductForm onClose={onClose}></ProductForm>}
      <h1>this is products page</h1>
      <button onClick={formHandle}>add product</button>
      <ol>{listItems}</ol>

      <button onClick={()=> dispatch(addpage())}
      disabled={page===totalPages}>next</button>
      {page}
    
      <button
        onClick={()=> dispatch(minupage())}
      disabled={page===1}>prev</button>
    </div>
  )
}

export default Product

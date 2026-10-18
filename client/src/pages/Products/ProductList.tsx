import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { addpage, getProducts, minupage } from '../../redux/features/productSlice'
import Navbar from '../../components/Navbar'
import CategorySidebar from '../../components/CategorySidebar'

const ProductList = () => {
    const {slug} = useParams()
    const dispatch = useAppDispatch()
    const {products,page,totalpages} = useAppSelector(state=> state.productData)
  
    useEffect(()=>{
      const limit = 12
      if(slug){
          dispatch(getProducts({limit,slug,page}))
      }
      
    },[])

    const productList = products && products.map(item => <li key={item._id}>
      <span>{item.name}</span>
      <Link to={`/product/${item._id}`}>
      <img src={item.images[0]} alt="" />
      </Link>
    </li>)

  return (
    <div>
      <Navbar></Navbar>
      <h1>this is product listing page of {slug}</h1>

       <CategorySidebar></CategorySidebar>
      <ul>
        {productList}
      </ul>
      {page}
      <button onClick={()=>dispatch(minupage())} disabled={page===1}>prev</button>
      <button onClick={()=>dispatch(addpage())} disabled={page===totalpages}>next</button>
      
    </div>
  )
}

export default ProductList
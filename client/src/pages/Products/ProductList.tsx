import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getProducts } from '../../redux/features/productSlice'

const ProductList = () => {
    const {slug} = useParams()
    const dispatch = useAppDispatch()
    const {products} = useAppSelector(state=> state.productData)

    useEffect(()=>{
      const limit = 12
      if(slug){
          dispatch(getProducts({limit,slug}))
      }
    
    },[])

    const productList = products && products.map(item => <li key={item._id}>
      <span>{item.name}</span>
      <img src={item.images[0]} alt="" />
    </li>)

  return (
    <div>
      <h1>this is product listing page of {slug}</h1>
      <ul>
        {productList}
      </ul>
    </div>
  )
}

export default ProductList
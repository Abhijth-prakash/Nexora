import React from 'react'
import { useParams } from 'react-router-dom'

const Product = () => {
    const {id} = useParams() 
  return (
    <div>

        this is product by id {id}
      
      
    </div>
  )
}

export default Product

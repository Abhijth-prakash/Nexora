import React from 'react'
import { useParams } from 'react-router-dom'

const Product = () => {
    const {slug} = useParams()
  return (
    <div>
      <h1>this is product listing page of {slug}</h1>
    </div>
  )
}

export default Product

import { useParams } from "react-router-dom"


const CategoryDetails = () => {
    const {id} = useParams()
  return (
    <div>
        <p>{id}</p>
        this is category details page
      
    </div>
  )
}

export default CategoryDetails

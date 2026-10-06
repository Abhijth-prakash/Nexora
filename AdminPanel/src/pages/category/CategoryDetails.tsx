import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { useEffect } from "react"
import { getCategory } from "../../redux/features/categorySlice"


const CategoryDetails = () => {
const { id } = useParams();
const dispatch = useAppDispatch();
const {category,subCategories} = useAppSelector(state=> state.categoryData)

const listItems = subCategories && subCategories.map(item=> <li key={item._id}>
    <span>{item.name}</span>
    <span>{item.isVisible?'true':'false'}</span>
    <button>delete</button>
</li>)

useEffect(() => {
    if (id) {
        dispatch(getCategory(id));
    }
}, [id, dispatch]);
  return (
    <div>
        <p>{category?.name}</p>
        <p>{category?.description}</p>
        <p>{category?.productCount}</p>
        <p>{category?.isVisible? "true":"false"}</p>
        <h1>subCategories</h1>
        {listItems}
      
    </div>
  )
}

export default CategoryDetails

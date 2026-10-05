import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { getAllCategories } from "../../redux/features/categorySlice"
import CategoryForm from "./CategoryForm"


const Category = () => {
    const {categories} = useAppSelector(state=> state.categoryData)
    const dispatch = useAppDispatch()
    useEffect(()=>{
        dispatch(getAllCategories())
    },[])

    const listItems = categories && categories.map(item=> <li key={item._id}>
        <span>{item.name}</span>
        <span>{item.description}</span>
        <span>{item.isVisible}</span>
        <span>{item.productCount}</span>
    </li>)

    const [form,setForm] = useState(false)

    const onCLose = ()=>{
        setForm(false)
    }
    
  return (
    <div>
        {form && <CategoryForm onClose={onCLose}></CategoryForm>}
        <button onClick={()=>setForm(true)}>Add+</button>

        {listItems}
      
    </div>
  )
}

export default Category

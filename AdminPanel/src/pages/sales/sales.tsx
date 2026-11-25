import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {getallCategories} from "../../redux/features/categorySlice";
import { useEffect } from "react";


const sales = () => {
    const {categories} = useAppSelector(state=> state.categoryData)
    const dispatch = useAppDispatch()

    useEffect(()=>{
        dispatch(getallCategories())
    },[])
  return (
    <div>
      
    


    </div>
  )
}

export default sales

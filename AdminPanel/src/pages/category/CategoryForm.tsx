import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CategorySchema, type categoryData } from "../../utils/validation"
import { useAppDispatch } from "../../redux/hooks"
import { addCategory, getAllCategories } from "../../redux/features/categorySlice"
import { toast } from "react-toastify";


export type props ={
    onClose: ()=> void
}

const CategoryForm = ({onClose}:props) => {
    const dispatch = useAppDispatch()

    const {register,handleSubmit,formState:{errors}} = useForm({
        resolver:zodResolver(CategorySchema)
    })

    const handleData = async (data:categoryData)=>{
        try{
            const modData = {
                name:data.name.toLowerCase(),
                description:data.description.toLowerCase(),
                subCategory:data.subCategory.toLowerCase()
            }
           await  dispatch(addCategory(modData)).unwrap()
            toast.success("Category added successfully");
            dispatch(getAllCategories())
            onClose()
        }catch(error){
            toast.error("Failed to add category");
        }
    }
  return (
    <div>
        <button onClick={onClose}>close</button>

        <form onSubmit={handleSubmit(handleData)}>
            <input type="text" {...register('name')} placeholder="name" />
            {errors.name && <p>{errors.name.message}</p> }
            <input type="text" {...register('description')}  placeholder="description" />
            {errors.description && <p>{errors.description.message}</p> }
            <input type="text" {...register('subCategory')} placeholder="subCategory" />
            {errors.subCategory && <p>{errors.subCategory.message}</p> }

            <input type="submit" />
        </form>
      
    </div>
  )
}

export default CategoryForm

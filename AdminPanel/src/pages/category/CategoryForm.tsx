import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CategorySchema, type categoryData } from "../../utils/validation"


export type props ={
    onClose: ()=> void
}

const CategoryForm = ({onClose}:props) => {

    const {register,handleSubmit,formState:{errors}} = useForm({
        resolver:zodResolver(CategorySchema)
    })

    const handleData = (data:categoryData)=>[
        console.log(data)
    ]
  return (
    <div>
        <button onClick={onClose}>close</button>

        <form onSubmit={handleSubmit(handleData)}>
            <input type="text" {...register('name')} placeholder="name" />
            {errors.name && <p>{errors.name.message}</p> }
            <input type="text" {...register('description')}  placeholder="description" />
            {errors.description && <p>{errors.description.message}</p> }
            <input type="text" {...register('subcategory')} placeholder="subCategory" />
            {errors.subcategory && <p>{errors.subcategory.message}</p> }

            <input type="submit" />
        </form>
      
    </div>
  )
}

export default CategoryForm

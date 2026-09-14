import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import  { forgetpassSchema } from "../utils/Validation"
import type { forgetpassDAta } from "../utils/Validation"
import { useAppDispatch } from "../redux/hooks"
import  { forgetpassword } from "../redux/features/userSlice"


const Forgetpass = () => {

  const {register,handleSubmit} = useForm({
    resolver:zodResolver(forgetpassSchema)
  })

  const dispatch = useAppDispatch()

  const datahandle = async(data:forgetpassDAta)=>{
      try{
          await dispatch(forgetpassword(data))
      }catch(error){
        console.log('reset email failed to sent',error)
      }
  }
  return (
    <div>
        <form onSubmit={handleSubmit(datahandle)} >
            <input {...register('email')} type="email" placeholder='email'  />
            <input type="submit" />

        </form>
      
    </div>
  )
}

export default Forgetpass

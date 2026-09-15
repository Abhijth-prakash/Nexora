import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { EmailSchema, type Email } from "../utils/validation"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { Forgetpass } from "../redux/features/adminSlice"
import { useNavigate } from "react-router-dom"

const ForgetPassword = () => {
    const {register,handleSubmit,formState:{errors}} = useForm({
        resolver:zodResolver(EmailSchema)
    })

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const  {error}= useAppSelector(state=> state.AdminData)

    const dataHandle = async (data:Email)=>{
        try{

            await dispatch(Forgetpass(data)).unwrap()
            navigate('/resetpassword')

        }catch(error){
            console.log('email failed to send',error)
        }
    }
  return (
    <div>

        <form onSubmit={handleSubmit(dataHandle)}>
            <input {...register("email")}type="email" placeholder="email" />
            {errors.email && <p>{errors.email.message}</p>}
            <input type="submit" />
            
        </form>
      <p>{error}</p>
    </div>
  )
}

export default ForgetPassword

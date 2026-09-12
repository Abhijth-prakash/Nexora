import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { LoginSchema } from "../utils/Validation"
import type { LoginData } from "../utils/Validation"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../redux/hooks"
import { Loginuser } from "../redux/features/userSlice"



const Login = () => {
  const {register,handleSubmit,formState: { errors }} = useForm<LoginData>({
    resolver:zodResolver(LoginSchema)
  })
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const datahandle = async(data:LoginData)=>{
    try{

      await dispatch(Loginuser(data))
      navigate('/')

    }catch(error){
      console.log(error)
    }
    
  }
  return (
    <div>
      <h1>login page</h1>

      <form onSubmit={handleSubmit(datahandle)} >
        <input type="email" placeholder="email" {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
        <input type="password" placeholder="password" {...register('password')} />
        {errors.password && <p>{errors.password.message}</p>}
        <input type="submit" />
      </form>
    </div>
  )
}

export default Login

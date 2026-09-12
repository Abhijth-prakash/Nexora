import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { LoginSchema } from "../utils/Validation"
import type { LoginData } from "../utils/Validation"



const Login = () => {
  const {register,handleSubmit,formState: { errors }} = useForm<LoginData>({
    resolver:zodResolver(LoginSchema)
  })

  const datahandle = (data:LoginData)=>{
      console.log(data)
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

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../utils/Validation'
import type { RegisterData } from '../utils/Validation'


const Register = () => {
    const {register,handleSubmit,formState:{errors}} = useForm<RegisterData>({
        resolver:zodResolver(registerSchema)
    })


    const dataHandle=(data:RegisterData)=>{

        console.log(data)
    }
  return (
   <>

       <h1>this is my frontend</h1>

    <form onSubmit={handleSubmit(dataHandle)} > 
      <input type="text" {...register('name')} placeholder='name' />
      {errors.name&&<p>{errors.name.message}</p>}
      <input type="email" {...register('email')} placeholder='email' />
       {errors.email&&<p>{errors.email.message}</p>}
      <input type="password" {...register('password')} placeholder='password' />
       {errors.password&&<p>{errors.password.message}</p>}
      <input type="password" {...register('confirmpassword')} placeholder='confirmpassword' />
       {errors.confirmpassword&&<p>{errors.confirmpassword.message}</p>}
      <input type="submit" />
    </form>

   </>
    
  )
}

export default Register
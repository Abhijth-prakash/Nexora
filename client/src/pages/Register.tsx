import { useForm } from 'react-hook-form'


type FormData = {
  name: string
  email: string
  password: string
  confirmpassword: string
}

const Register = () => {
    const {register,handleSubmit} = useForm<FormData>()


    const dataHandle=(data:FormData)=>{

        console.log(data)
    }
  return (
   <>

       <h1>this is my frontend</h1>

    <form onSubmit={handleSubmit(dataHandle)} > 
      <input type="text" {...register('name')} placeholder='name' />
      <input type="email" {...register('email')} placeholder='email' />
      <input type="password" {...register('password')} placeholder='password' />
      <input type="password" {...register('confirmpassword')} placeholder='confirmpassword' />
      <input type="submit" />
    </form>

   </>
    
  )
}

export default Register
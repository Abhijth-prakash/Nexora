import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../utils/Validation'
import type { RegisterData } from '../utils/Validation'
import { registerUser } from '../redux/features/userSlice'
import { useAppDispatch, useAppSelector } from "../redux/hooks";



const Register = () => {
    const {register,handleSubmit,formState:{errors}} = useForm<RegisterData>({
        resolver:zodResolver(registerSchema)
    })

    const dispatch = useAppDispatch()
    const {error} = useAppSelector(state=> state.userData)

const dataHandle = async (data: RegisterData) => {
  try {
    const { confirmpassword, ...registerData } = data;
     await dispatch(registerUser(registerData)).unwrap();
  } catch (error) {
    console.log("Registration failed", error);
  }
};

const handleGoogleLogin = () => {
  window.location.href = "http://localhost:5000/api/auth/google";
};



  return (
   <>

       <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            this is my frontend
          </h1>

          <form onSubmit={handleSubmit(dataHandle)} className="space-y-4"> 

            <div>
              <input
                type="text"
                {...register('name')}
                placeholder='name'
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {errors.name&&
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              }
            </div>

            <div>
              <input
                type="email"
                {...register('email')}
                placeholder='email'
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {errors.email&&
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              }
            </div>

            <div>
              <input
                type="password"
                {...register('password')}
                placeholder='password'
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {errors.password&&
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              }
            </div>

            <div>
              <input
                type="password"
                {...register('confirmpassword')}
                placeholder='confirmpassword'
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {errors.confirmpassword&&
                <p className="text-sm text-red-500 mt-1">{errors.confirmpassword.message}</p>
              }
            </div>

            <input
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md cursor-pointer hover:bg-blue-700 transition"
            />

          </form>
              {error&&<p>{error}</p>}
             <button onClick={handleGoogleLogin}>
  Continue with Google
</button>
        </div>
       </div>

   </>
    
  )
}

export default Register
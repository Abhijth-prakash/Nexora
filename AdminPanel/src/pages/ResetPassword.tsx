import { useState } from "react"
import { useForm } from "react-hook-form"
import { passwordSchema, type passwordData } from "../utils/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { useNavigate, useSearchParams } from "react-router-dom"
import { resetPass } from "../redux/features/adminSlice"


const ResetPassword = () => {

    const [eye,setEye] = useState(false)

    const {register,handleSubmit ,formState:{errors}} = useForm({
        resolver:zodResolver(passwordSchema)
    })

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const {error} = useAppSelector(state=>state.AdminData)
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const dataHandle = async (data:passwordData) =>{
        try{
            const {confirmpassword,password} = data
            const adminData = {
                token,password
            }

            await dispatch(resetPass(adminData)).unwrap()
            navigate('/')
        }catch(error){
            console.log("password reset failed",error )
        }


    }
  return (
    <div>
      <form  onSubmit={handleSubmit(dataHandle)}>
        <input {...register("password")} type={eye?"text":"password"}  placeholder="password"/>
        {errors.password && <p>{errors.password.message}</p>}
        <input {...register("confirmpassword")} type={eye?"text":"password"} placeholder="confirmpassword" />
        {errors.confirmpassword && <p>{errors.confirmpassword.message}</p>}
        <button onClick={()=>setEye(prev=>!prev)}>eye</button><br />
        <input type="submit" />
      </form>
      {<p>{error}</p>}
    </div>
  )
}

export default ResetPassword

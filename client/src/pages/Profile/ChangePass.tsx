import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChangepassValidation, type ChangePassData } from "../../utils/Validation"




const ChangePass = () => {
   
    const {register,handleSubmit,formState:{errors}} = useForm({
        resolver:zodResolver(ChangepassValidation)
    })


    const dataHandle = (data:ChangePassData)=>{
        console.log(data)
    }


  return (
    <div>

    <p>this is change password page</p>

    <form onSubmit={handleSubmit(dataHandle)} >
        <input {...register('currentpassword')} type="password" placeholder="currentPassword" />
            {errors.currentpassword&& <p>{errors.currentpassword.message}</p>}
        <input {...register('newpassword')} type="password" placeholder="New Password" />
        {errors.newpassword&& <p>{errors.newpassword.message}</p>}
        <input {...register('confirmpassword')} type="password" placeholder="confirm Password" />
        {errors.confirmpassword&& <p>{errors.confirmpassword.message}</p>}

        <input type="submit" />
    </form>
      
    </div>
  )
}

export default ChangePass

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChangepassValidation, type ChangePassData } from "../../utils/Validation"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { changePassword } from "../../redux/features/userSlice"
import { useNavigate } from "react-router-dom"




const ChangePass = () => {

    const dispatch = useAppDispatch()
   
    const {register,handleSubmit,formState:{errors}} = useForm({
        resolver:zodResolver(ChangepassValidation)
    })

    const {error} = useAppSelector(state=> state.userData)
    const navigate = useNavigate()
const dataHandle = async (data: ChangePassData) => {
  try {
    const { currentpassword, newpassword } = data

    const passwords = {
      currentpassword,
      newpassword,
    }

    await dispatch(changePassword(passwords)).unwrap()
    navigate('/auth/login')
  } catch (error) {
    console.log("failed to changepassword", error)
  }
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

    {error && <p>{error}</p>}
      
    </div>
  )
}

export default ChangePass

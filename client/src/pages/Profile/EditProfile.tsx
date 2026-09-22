import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { editProfile, UserProfile } from "../../redux/features/userSlice"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProfileSchema, type ProfileData } from "../../utils/Validation"
import { useNavigate } from "react-router-dom"


const EditProfile = () => {
    const dispatch = useAppDispatch()
    const {user} = useAppSelector(state=> state.userData)
    const navigate = useNavigate()
    useEffect(()=>{
        dispatch(UserProfile())
    },[dispatch])


    const {register,handleSubmit,formState:{errors}} = useForm({
        resolver:zodResolver(ProfileSchema)
    })

    const dataHandle = async (data:ProfileData)=>{
            try{
                await dispatch(editProfile(data)).unwrap()
                navigate('/myprofile')

            }catch(error){
                console.log('failed to update profile',error)
            }
    }
  return (
    <div>
        <form onSubmit={handleSubmit(dataHandle)} >
            <input {...register('name')} type="text" placeholder="fullname" />
            {errors.name&& <p>{errors.name.message}</p>}
            <input {...register('email')} type="email" placeholder="email" />
            {errors.email&& <p>{errors.email.message}</p>}

            <input type="submit" />
        </form>
      
    </div>
  )
}

export default EditProfile

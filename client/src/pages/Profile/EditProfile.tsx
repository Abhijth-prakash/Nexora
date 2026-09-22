import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { UserProfile } from "../../redux/features/userSlice"
import { useForm } from "react-hook-form"


const EditProfile = () => {
    const dispatch = useAppDispatch()
    const {user} = useAppSelector(state=> state.userData)

    useEffect(()=>{
        dispatch(UserProfile())
    },[dispatch])


    const {register,handleSubmit} = useForm()

    const dataHandle = ()=>{
        
    }
  return (
    <div>
        <form onSubmit={handleSubmit(dataHandle)} >
            <input {...register('name')} type="text" placeholder="fullname" />
            <input {...register('email')} type="email" placeholder="email" />
        </form>
      
    </div>
  )
}

export default EditProfile

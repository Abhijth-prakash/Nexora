import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { UserProfile } from "../../redux/features/userSlice"


const ChangePass = () => {
    const {user} = useAppSelector(state=> state.userData)
    const dispatch = useAppDispatch()

    useEffect(()=>{
        dispatch(UserProfile())
    })


  return (
    <div>

    <p>this is change password page</p>
      
    </div>
  )
}

export default ChangePass

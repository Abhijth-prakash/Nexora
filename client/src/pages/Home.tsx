import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { useEffect } from "react"
import { UserProfile } from "../redux/features/userSlice"

const Home = () => {
  const { logged } = useAppSelector(state => state.userData)

  const dispatch = useAppDispatch()


  useEffect(()=>{
    dispatch(UserProfile())
  },[dispatch])

  return (
    <div>
      this is home page

      {!logged && (
        <Link to="/auth/register">
          Register
        </Link>
      )}

      {!logged && (
        <Link to="/auth/login">
          Login
        </Link>
      )}
    </div>
  )
}

export default Home
import { Link } from "react-router-dom"
import { useAppSelector } from "../redux/hooks"

const Home = () => {
  const { logged } = useAppSelector(state => state.userData)

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
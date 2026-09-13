import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { useEffect } from "react"
import { logout, UserProfile } from "../redux/features/userSlice"

const Home = () => {
  const { logged } = useAppSelector(state => state.userData)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(UserProfile())
  }, [dispatch])

  const handle = async () => {
    try {
      await dispatch(logout())
      navigate('/auth/login')
    } catch (error) {
      console.log('logout failed', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm text-center space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          This is Home Page
        </h1>

        {!logged && (
          <div className="flex flex-col gap-3">
            <Link
              to="/auth/register"
              className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Register
            </Link>

            <Link
              to="/auth/login"
              className="w-full py-2 px-4 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
            >
              Login
            </Link>
          </div>
        )}

        <button
          onClick={handle}
          className="w-full py-2 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Home
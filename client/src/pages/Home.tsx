import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { useEffect } from "react"
import { logout, UserProfile } from "../redux/features/userSlice"
import Navbar from "../components/Navbar"

const Home = () => {
  const { logged } = useAppSelector(
    (state) => state.userData
  )

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(UserProfile())
  }, [dispatch])

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
       navigate("/auth/login", { replace: true });
    } catch (error) {
      console.log("Logout failed:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= NAVBAR ================= */}

      <Navbar />


      {/* ================= HOME CONTENT ================= */}

      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">

        <div className="w-full max-w-sm space-y-6 rounded-xl bg-white p-8 text-center shadow-md">

          {/* Heading */}

          <h1 className="text-2xl font-semibold text-gray-800">
            This is Home Page
          </h1>


          {/* ================= LOGGED OUT ================= */}

          {!logged && (
            <div className="flex flex-col gap-3">

              {/* Register */}

              <Link
                to="/auth/register"
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Register
              </Link>


              {/* Login */}

              <Link
                to="/auth/login"
                className="w-full rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                Login
              </Link>

            </div>
          )}


          {/* ================= LOGGED IN ================= */}

          {logged && (
            <div className="flex flex-col gap-3">

              {/* Profile */}

              <Link
                to="/myprofile"
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                My Profile
              </Link>


              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </main>

    </div>
  )
}

export default Home
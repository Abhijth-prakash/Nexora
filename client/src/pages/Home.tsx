import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { useEffect } from "react"
import { logout, UserProfile } from "../redux/features/userSlice"
import Navbar from "../components/Navbar"
import { getCategories, getProducts } from "../redux/features/productSlice"



const Home = () => {
  const { logged,isStale } = useAppSelector(
    (state) => state.userData
  )

  const {categories,products} = useAppSelector(state=> state.productData)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if(isStale){
       dispatch(UserProfile())
    } 
   
  }, [dispatch])



  useEffect(()=>{
    const limit = 6
    dispatch(getCategories(limit))
    const slug = ""
    dispatch(getProducts({limit,slug}))
  },[])



  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()

      navigate("/auth/login", { replace: true })
    } catch (error) {
      console.log("Logout failed:", error)
    }
  }

  //category listing
  const categoryList = categories && categories.map(item=> <li key={item._id}> 
  <span>{item.name}</span>
  <Link to={`/products/${item._id}`}>click</Link>
  </li>)

  //product listing

const productList = products && products.map(item => <li key={item._id}>
  <span>{item.name}</span>
  <Link to={`/product/${item._id}`}>
   <img src={item.images[0]} alt="" /></Link>
 
</li>)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= HOME CONTENT ================= */}

      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">

        <div className="w-full max-w-sm space-y-6 rounded-xl bg-white p-8 text-center shadow-md">
          {categoryList}

          {/* ================= MESSAGE ================= */}

          {logged ? (
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-800">
                Welcome Back!
              </h1>

              <p className="text-sm text-gray-500">
                You are currently signed in.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-800">
                You are logged out
              </h1>

              <p className="text-sm text-gray-500">
                Please register or sign in to continue.
              </p>
            </div>
          )}

          {productList}
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
                Sign In
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
import { Search, User, ShoppingBag, LogOut, LogIn, ChevronRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { useEffect } from "react"
import { getCart } from "../redux/features/cartSlice"
import { toast } from "react-toastify"
import { logout } from "../redux/features/userSlice"

const Navbar = () => {
  const dispatch = useAppDispatch()
  const { totalItems } = useAppSelector(state => state.cartData)
  const {logged} = useAppSelector(state=> state.userData)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getCart())
  }, [])

  const handleLogout = async () => {
      try{
        await dispatch(logout()).unwrap()
        navigate('/auth/login')

      }catch(error){
        toast.error('something went wrong')
      }
  }

  return (
    <div>
      {/* Promo strip */}
      <div className="bg-[#0a0a0a] text-white text-xs text-center py-2.5 px-4 flex items-center justify-center gap-2">
        <span className="bg-[#ff5a1f] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded">
          Offer
        </span>
        <span>
          Free Worldwide Shipping Over $50
          <span className="mx-2 text-white/30">|</span>
          Summer Sale Up To 70% Off
          <span className="mx-2 text-white/30">|</span>
          Limited Time Flash Deals
        </span>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-[#ececec]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <span className="text-2xl font-bold text-[#0a0a0a]">
            Nexora
          </span>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm">
            <Link
              to="/"
              className="cursor-pointer font-semibold text-[#0a0a0a] border-b-2 border-[#0a0a0a] pb-1"
            >
              Home
            </Link>

            <a
              href="#"
              className="cursor-pointer text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors pb-1 border-b-2 border-transparent"
            >
              Shop
            </a>

            <a
              href="#"
              className="cursor-pointer text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors pb-1 border-b-2 border-transparent"
            >
              Best Sellers
            </a>

            <a
              href="#"
              className="cursor-pointer text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors pb-1 border-b-2 border-transparent flex items-center gap-1"
            >
              Categories
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="mt-0.5"
              >
                <path
                  d="M2 3.5L5 6.5L8 3.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a
              href="#"
              className="cursor-pointer text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors pb-1 border-b-2 border-transparent"
            >
              About
            </a>

            <a
              href="#"
              className="cursor-pointer text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors pb-1 border-b-2 border-transparent"
            >
              Contact
            </a>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <button
              aria-label="Search"
              className="cursor-pointer text-[#0a0a0a] hover:text-[#ff5a1f] transition-colors"
            >
              <Search size={20} strokeWidth={1.75} />
            </button>

            {/* Profile dropdown */}
            <div className="group relative">
              <button
                aria-label="Account"
                aria-haspopup="menu"
                className="flex cursor-pointer items-center text-[#0a0a0a] transition-colors group-hover:text-[#ff5a1f] group-focus-within:text-[#ff5a1f]"
              >
                <User size={20} strokeWidth={1.75} />
              </button>

              {/* pt-3 keeps the hover area connected between icon and menu */}
              <div className="invisible absolute right-[-12px] top-full z-50 translate-y-2 pt-3 opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div
                  role="menu"
                  className="relative w-60 rounded-2xl border border-[#ececec] bg-white p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)]"
                >
                  {/* Arrow */}
                  <span className="absolute -top-[7px] right-[18px] h-3 w-3 rotate-45 border-l border-t border-[#ececec] bg-white" />

                  {logged ? (
                    <>
                      {/* Header */}
                      <div className="flex items-center gap-3 rounded-xl bg-[#fff4ef] px-3 py-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff5a1f] text-white">
                          <User size={18} strokeWidth={2} />
                        </span>
                        <div className="leading-tight">
                          <p className="text-sm font-semibold text-[#0a0a0a]">
                            Welcome back
                          </p>
                          <p className="mt-0.5 text-xs text-[#6b6b6b]">
                            Manage your account
                          </p>
                        </div>
                      </div>

                      <div className="mt-1.5 space-y-0.5">
                        <Link
                          to="/myprofile"
                          role="menuitem"
                          className="group/item flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#2a2a2a] transition-colors hover:bg-[#fff4ef] hover:text-[#ff5a1f]"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4f4f4] text-[#4a4a4a] transition-colors group-hover/item:bg-white group-hover/item:text-[#ff5a1f]">
                            <User size={16} strokeWidth={1.75} />
                          </span>
                          <span className="flex-1">My Profile</span>
                          <ChevronRight
                            size={16}
                            strokeWidth={1.75}
                            className="-translate-x-1 text-[#ff5a1f] opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100"
                          />
                        </Link>

                        <div className="mx-3 my-1 h-px bg-[#f0f0f0]" />

                        <button
                          role="menuitem"
                          onClick={handleLogout}
                          className="group/item flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#2a2a2a] transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4f4f4] text-[#4a4a4a] transition-colors group-hover/item:bg-white group-hover/item:text-red-600">
                            <LogOut size={16} strokeWidth={1.75} />
                          </span>
                          <span className="flex-1">Logout</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Header */}
                      <div className="px-3 pb-2 pt-3">
                        <p className="text-sm font-semibold text-[#0a0a0a]">
                          Hello, Guest
                        </p>
                        <p className="mt-0.5 text-xs text-[#6b6b6b]">
                          Sign in to access your account
                        </p>
                      </div>

                      <Link
                        to="/auth/login"
                        role="menuitem"
                        className="m-1 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#ff5a1f]"
                      >
                        <LogIn size={16} strokeWidth={2} />
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Cart button */}
            <Link
              to="/users/cart"
              aria-label="Shopping Cart"
              className="group relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-[#0a0a0a] transition-all duration-200 hover:border-[#ff5a1f] hover:bg-[#fff4ef] hover:text-[#ff5a1f]"
            >
              <ShoppingBag size={20} strokeWidth={1.75} />

              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff5a1f] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
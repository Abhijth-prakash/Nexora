
import { Search, User, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { useEffect } from "react"
import { getCart } from "../redux/features/cartSlice"

const Navbar = () => {
  const dispatch = useAppDispatch()
  const { totalItems } = useAppSelector(state => state.cartData)

  useEffect(() => {
    dispatch(getCart())
  }, [])

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
              className="font-semibold text-[#0a0a0a] border-b-2 border-[#0a0a0a] pb-1"
            >
              Home
            </Link>

            <a
              href="#"
              className="text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors pb-1 border-b-2 border-transparent"
            >
              Shop
            </a>

            <a
              href="#"
              className="text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors pb-1 border-b-2 border-transparent"
            >
              Best Sellers
            </a>

            <a
              href="#"
              className="text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors pb-1 border-b-2 border-transparent flex items-center gap-1"
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
              className="text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors pb-1 border-b-2 border-transparent"
            >
              About
            </a>

            <a
              href="#"
              className="text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors pb-1 border-b-2 border-transparent"
            >
              Contact
            </a>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <button
              aria-label="Search"
              className="text-[#0a0a0a] hover:text-[#ff5a1f] transition-colors"
            >
              <Search size={20} strokeWidth={1.75} />
            </button>

            <Link
              to="/myprofile"
              aria-label="Account"
              className="text-[#0a0a0a] hover:text-[#ff5a1f] transition-colors"
            >
              <User size={20} strokeWidth={1.75} />
            </Link>

            {/* Cart button */}
            <Link
              to="/users/cart"
              aria-label="Shopping Cart"
              className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-[#0a0a0a] transition-all duration-200 hover:border-[#ff5a1f] hover:bg-[#fff4ef] hover:text-[#ff5a1f]"
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

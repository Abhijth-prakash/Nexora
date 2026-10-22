import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch } from "../redux/hooks"
import { Logout } from "../redux/features/adminSlice"

const AdminSidebar = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      console.log("button clicked")
      await dispatch(Logout()).unwrap()
      navigate("/", { replace: true })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white shadow-sm">
      {/* ADMIN PROFILE */}
      <div className="shrink-0 border-b border-gray-100 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ff5a1f] text-lg font-bold text-white shadow-sm">
            AD
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-gray-900">
              Admin
            </p>

            <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Administrator
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {/* OVERVIEW */}
        <div className="mb-7">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Overview
          </p>

          {/* DASHBOARD */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-xl bg-[#fff1eb] px-3 py-3 text-sm font-semibold text-[#ff5a1f]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff5a1f] text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>

            <span>Dashboard</span>
          </Link>
        </div>

        {/* MANAGEMENT */}
        <div className="mb-7">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Management
          </p>

          {/* USERS */}
          <Link
            to="/admin/users/view"
            className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                />
                <circle cx="9" cy="7" r="4" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                />
              </svg>
            </div>

            <span>Users</span>
          </Link>

          {/* PRODUCTS */}
          <Link
            to="/admin/products"
            className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8l-9-5-9 5 9 5 9-5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8v9l9 5 9-5V8"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 13v9"
                />
              </svg>
            </div>

            <span>Products</span>
          </Link>

          {/* ORDERS */}
          <Link
            to="/admin/orders"
            className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 3h12l1 4H5l1-4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 7h14v13H5V7z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 11h6M9 15h4"
                />
              </svg>
            </div>

            <span>Orders</span>
          </Link>

          {/* CATEGORIES */}
          <Link
            to="/admin/category"
            className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 5a2 2 0 012-2h4l2 3h6a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h8M8 14h5"
                />
              </svg>
            </div>

            <span>Categories</span>
          </Link>
        </div>

        {/* SETTINGS */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Settings
          </p>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-1.8 1.8-.06-.06a1.7 1.7 0 00-1.88-.34 1.7 1.7 0 00-1.03 1.56V20h-2.54v-.1a1.7 1.7 0 00-1.03-1.56 1.7 1.7 0 00-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 009.4 15a1.7 1.7 0 00-1.56-1.03H7v-2.54h.84A1.7 1.7 0 009.4 10a1.7 1.7 0 00-.34-1.88L9 8.06l1.8-1.8.06.06a1.7 1.7 0 001.88.34A1.7 1.7 0 0013.77 5V4h2.54v1a1.7 1.7 0 001.03 1.56 1.7 1.7 0 001.88-.34l.06-.06 1.8 1.8-.06.06A1.7 1.7 0 0020.6 10c.17.62.73 1.03 1.37 1.03H23v2.54h-1.03A1.7 1.7 0 0020.4 15z"
                />
              </svg>
            </div>

            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* SIDEBAR FOOTER */}
      <div className="mt-auto shrink-0 border-t border-gray-100 bg-white p-5">
        <div className="rounded-xl bg-[#fff8f5] p-4">
          <p className="text-xs font-semibold text-gray-900">
            Admin Panel
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-400">
            Manage your store from one place.
          </p>
        </div>

        {/* LOGOUT */}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 17l5-5-5-5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12H9"
              />
            </svg>
          </div>

          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
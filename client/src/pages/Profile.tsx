import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { logout, UserProfile } from "../redux/features/userSlice"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"

const getInitials = (name?: string) => {
  if (!name) return "?"

  const parts = name.trim().split(/\s+/)

  const initials =
    parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : parts[0].slice(0, 2)

  return initials.toUpperCase()
}

const Profile = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(UserProfile())
  }, [dispatch])

  const { user, error } = useAppSelector(
    (state) => state.userData
  )

  const isLoading = !user && !error

  const logoutHandle = async () =>{
    try{
       await dispatch(logout()).unwrap()
       navigate('/auth/login')

    }catch(error){
        console.log("logout failed",error)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-[#111111]">

      {/* ================= NAVBAR ================= */}

      <Navbar />


      {/* ================= PAGE ================= */}

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ================= BREADCRUMB ================= */}

        <div className="mb-7 flex items-center gap-2 text-sm">

          <span className="text-gray-400">
            Home
          </span>

          <span className="text-gray-300">
            /
          </span>

          <span className="text-gray-700">
            My Account
          </span>

        </div>


        {/* ================= MAIN LAYOUT ================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">


          {/* ================================================= */}
          {/* SIDEBAR */}
          {/* ================================================= */}

          <aside className="h-fit overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* ================= USER CARD ================= */}

            <div className="border-b border-gray-100 p-5">

              <div className="flex items-center gap-3">

                {/* Avatar */}

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff5a1f] text-sm font-bold text-white shadow-sm">
                  {getInitials(user?.name)}
                </div>


                {/* User information */}

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-gray-900">
                    {user?.name || "My Account"}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-400">
                    {user?.email || "Manage your account"}
                  </p>

                </div>

              </div>

            </div>


            {/* ================= NAVIGATION ================= */}

            <div className="p-3">


              {/* ================================================= */}
              {/* MANAGE ACCOUNT */}
              {/* ================================================= */}

              <div className="mb-6">

                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  Manage Account
                </p>


                {/* Profile - Active */}

                <div className="flex cursor-pointer items-center gap-3 rounded-xl bg-[#fff1eb] px-3 py-3 text-sm font-semibold text-[#ff5a1f]">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff5a1f] text-white">

                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
                      />
                    </svg>

                  </div>

                  <span>
                    My Profile
                  </span>

                </div>


                {/* Address Book */}

                <div className="mt-1 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">

                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21s7-5.25 7-11a7 7 0 10-14 0c0 5.75 7 11 7 11z"
                      />

                      <circle
                        cx="12"
                        cy="10"
                        r="2.2"
                      />

                    </svg>

                  </div>

                  <span>
                    Address Book
                  </span>

                </div>


                {/* Wallet */}

                <div className="mt-1 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">

                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5v-9z"
                      />

                      <path
                        strokeLinecap="round"
                        d="M16 13h2"
                      />

                    </svg>

                  </div>

                  <span>
                    My Wallet
                  </span>

                </div>

              </div>


              {/* ================================================= */}
              {/* ORDERS */}
              {/* ================================================= */}

              <div className="mb-6">

                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  Orders
                </p>


                {/* All Orders */}

                <div className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">

                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 3h12l1 4H5l1-4zM5 7h14v13H5V7z"
                      />

                      <path
                        strokeLinecap="round"
                        d="M9 11h6M9 15h4"
                      />

                    </svg>

                  </div>

                  <span>
                    All Orders
                  </span>

                </div>


                {/* Returns */}

                <div className="mt-1 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">

                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 7H5m0 0l3-3M5 7a7 7 0 111.5 7.5"
                      />
                    </svg>

                  </div>

                  <span>
                    My Returns
                  </span>

                </div>


                {/* Cancellations */}

                <div className="mt-1 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">

                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 6l12 12M18 6L6 18"
                      />
                    </svg>

                  </div>

                  <span>
                    Cancellations
                  </span>

                </div>

              </div>


              {/* ================================================= */}
              {/* SETTINGS */}
              {/* ================================================= */}

              <div>

                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  Settings
                </p>


                {/* Payment Methods */}

                <div className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">

                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                      />

                      <path d="M3 10h18" />

                    </svg>

                  </div>

                  <span>
                    Payment Methods
                  </span>

                </div>


                {/* Logout */}

                <button
                  type="button"
                  onClick={() => {
                        logoutHandle()
                  }}
                  className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-gray-500 transition hover:bg-red-50 hover:text-red-500"
                >

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">

                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 17l5-5-5-5M15 12H3"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 19V5a2 2 0 00-2-2h-6"
                      />

                    </svg>

                  </div>

                  <span>
                    Logout
                  </span>

                </button>

              </div>

            </div>

          </aside>


          {/* ================================================= */}
          {/* MAIN CONTENT */}
          {/* ================================================= */}

          <main className="min-w-0 rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="p-6 sm:p-8 md:p-10 lg:p-12">

              {/* Header */}

              <div className="mb-10 border-b border-gray-100 pb-8">

                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#ff5a1f]">
                  My Account
                </p>

                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Profile
                </h1>

                <p className="mt-2 text-sm text-gray-400">
                  Manage the personal details associated with your account.
                </p>

              </div>


              {/* Error */}

              {error && (

                <div className="mb-8 rounded-xl border border-red-100 bg-red-50 px-4 py-4">

                  <p className="text-sm font-semibold text-red-700">
                    Couldn't load your profile
                  </p>

                  <p className="mt-1 text-xs text-red-500">
                    {error}
                  </p>

                </div>

              )}


              {/* Profile */}

              <div className="max-w-2xl">

                {/* Profile intro */}

                <div className="mb-8 flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ff5a1f] text-lg font-bold text-white">
                    {getInitials(user?.name)}
                  </div>

                  <div className="min-w-0">

                    {isLoading ? (

                      <div className="h-6 w-36 animate-pulse rounded bg-gray-200" />

                    ) : (

                      <h2 className="truncate text-lg font-semibold text-gray-900">
                        {user?.name || "Welcome back"}
                      </h2>

                    )}

                    <p className="mt-1 text-sm text-gray-400">
                      Your account information
                    </p>

                  </div>

                </div>


                {/* Details */}

                <div className="overflow-hidden rounded-xl border border-gray-200">

                  {/* Name */}

                  <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-xs font-medium text-gray-400">
                      Full Name
                    </p>

                    <p
                      className={`break-words text-sm font-semibold sm:text-right ${
                        !user?.name
                          ? "font-normal italic text-gray-400"
                          : "text-gray-900"
                      }`}
                    >
                      {isLoading
                        ? "Loading…"
                        : user?.name || "Not set"}
                    </p>

                  </div>


                  {/* Email */}

                  <div className="flex flex-col gap-2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-xs font-medium text-gray-400">
                      Email Address
                    </p>

                    <p
                      className={`break-words text-sm font-semibold sm:text-right ${
                        !user?.email
                          ? "font-normal italic text-gray-400"
                          : "text-gray-900"
                      }`}
                    >
                      {isLoading
                        ? "Loading…"
                        : user?.email || "Not set"}
                    </p>

                  </div>

                </div>


                {/* Edit */}

                <div className="mt-7 flex justify-end">

                  <button
                    type="button"
                    className="rounded-xl bg-[#ff5a1f] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e64f19] hover:shadow-md"
                  >
                    Edit details
                  </button>

                </div>

              </div>

            </div>

          </main>

        </div>

      </div>

    </div>
  )
}

export default Profile
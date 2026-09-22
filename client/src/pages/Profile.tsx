import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { logout, UserProfile } from "../redux/features/userSlice"
import Navbar from "../components/Navbar"
import { Link, useNavigate } from "react-router-dom"

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

  const { user, error, google } = useAppSelector(
    (state) => state.userData
  )

  const isLoading = !user && !error

  const logoutHandle = async () => {
    try {
      await dispatch(logout()).unwrap()
      navigate("/auth/login")
    } catch (error) {
      console.log("logout failed", error)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-[#111111]">

      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= PAGE ================= */}

      <div className="w-full px-3 py-4 sm:px-4 lg:px-5">

        {/* ================= MAIN LAYOUT ================= */}

        <div className="grid min-h-[calc(100vh-105px)] w-full grid-cols-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">

          {/* ================================================= */}
          {/* SIDEBAR */}
          {/* ================================================= */}

          <aside className="flex h-full min-h-[calc(100vh-105px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-5">

            {/* ================= USER CARD ================= */}

            <div className="border-b border-gray-100 px-6 py-6">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ff5a1f] text-lg font-bold text-white shadow-sm">
                  {getInitials(user?.name)}
                </div>

                <div className="min-w-0">

                  <p className="truncate text-base font-semibold text-gray-900">
                    {user?.name || "My Account"}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-400">
                    {user?.email || "Manage your account"}
                  </p>

                </div>

              </div>

            </div>

            {/* ================= NAVIGATION ================= */}

            <div className="flex-1 p-5">

              {/* ================================================= */}
              {/* MANAGE ACCOUNT */}
              {/* ================================================= */}

              <div className="mb-7">

                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  Manage Account
                </p>

                {/* Profile */}

                <div className="flex items-center gap-3 rounded-xl bg-[#fff1eb] px-3 py-3 text-sm font-semibold text-[#ff5a1f]">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff5a1f] text-white">

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
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
                      />
                    </svg>

                  </div>

                  <span>
                    My Profile
                  </span>

                </div>

                {/* Address Book */}

                <Link
                  to="/profile/address"
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

                </Link>

                {/* Wallet */}

                <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900">

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

              <div className="mb-7">

                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  Orders
                </p>

                {/* All Orders */}

                <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900">

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

                <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900">

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
                        d="M9 7H5m0 0l3-3M5 7a7 7 0 111.5 7.5"
                      />
                    </svg>

                  </div>

                  <span>
                    My Returns
                  </span>

                </div>

                {/* Cancellations */}

                <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900">

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

                <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">

                    <svg
                      className="h-5 w-5"
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
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-gray-500 transition hover:bg-red-50 hover:text-red-500"
                >

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">

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

          <main className="min-w-0 w-full rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="flex h-full min-h-[calc(100vh-105px)] flex-col p-6 sm:p-7 lg:p-9">

              {/* ================= HEADER ================= */}

              <div className="flex items-center justify-between border-b border-gray-100 pb-6">

                <div>

                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Profile
                  </h1>

                  <p className="mt-1 text-sm text-gray-400">
                    Manage your personal account information.
                  </p>

                </div>

                <div className="hidden h-14 w-14 items-center justify-center rounded-xl bg-[#fff1eb] text-[#ff5a1f] sm:flex">

                  <svg
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
                    />
                  </svg>

                </div>

              </div>

              {/* ================= ERROR ================= */}

              {error && (
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-5 py-4">

                  <p className="text-sm font-semibold text-red-700">
                    Couldn't load your profile
                  </p>

                  <p className="mt-1 text-xs text-red-500">
                    {error}
                  </p>

                </div>
              )}

              {/* ================= PROFILE CARD ================= */}

              <div className="mt-5 rounded-2xl border border-gray-200 bg-gradient-to-r from-white via-white to-[#fff8f5] p-6">

                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                  {/* USER */}

                  <div className="flex items-center gap-4">

                    <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-[#ff5a1f] text-2xl font-bold text-white shadow-md">
                      {getInitials(user?.name)}
                    </div>

                    <div className="min-w-0">

                      {isLoading ? (
                        <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
                      ) : (
                        <h2 className="truncate text-2xl font-bold text-gray-900">
                          {user?.name || "Welcome back"}
                        </h2>
                      )}

                      <p className="mt-1 text-sm text-gray-400">
                        Account holder
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-gray-600">
                        {user?.email || "No email available"}
                      </p>

                    </div>

                  </div>

                  {/* ACCOUNT STATUS */}

                  <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-sm ring-1 ring-gray-100">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">

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
                          d="M9 12l2 2 4-4"
                        />

                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                        />

                      </svg>

                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Account status
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-gray-900">
                        Active
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* ================= DETAILS ================= */}

              <div className="mt-6">

                <div className="mb-4">

                  <h3 className="text-xl font-bold text-gray-900">
                    Personal Details
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Your basic account information.
                  </p>

                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

                  {/* FULL NAME */}

                  <div className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-gray-300 hover:shadow-sm">

                    <div className="flex items-start justify-between">

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Full Name
                        </p>

                        <p
                          className={`mt-2 break-words text-lg font-semibold ${
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

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">

                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
                          />
                        </svg>

                      </div>

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-gray-300 hover:shadow-sm">

                    <div className="flex items-start justify-between">

                      <div className="min-w-0">

                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Email Address
                        </p>

                        <p
                          className={`mt-2 break-words text-lg font-semibold ${
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

                      <div className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">

                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 6.75A2.75 2.75 0 015.75 4h12.5A2.75 2.75 0 0121 6.75v10.5A2.75 2.75 0 0118.25 20H5.75A2.75 2.75 0 013 17.25V6.75z"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6l8 6 8-6"
                          />

                        </svg>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* ================= ACTIONS ================= */}

              {!google && (
                <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">

                  {/* EDIT DETAILS */}

                  <Link
                    to="/profile/editProfile"
                    className="group flex min-h-[96px] items-center justify-between rounded-2xl bg-[#ff5a1f] px-6 py-5 text-white shadow-sm transition hover:bg-[#e64f19] hover:shadow-lg"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">

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
                            d="M16.862 4.487l1.65-1.65a2.121 2.121 0 013 3l-9.193 9.193-4.5 1.5 1.5-4.5 7.543-7.543z"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6"
                          />

                        </svg>

                      </div>

                      <div>

                        <p className="text-base font-semibold">
                          Edit details
                        </p>

                        <p className="mt-0.5 text-sm text-white/70">
                          Update your personal information
                        </p>

                      </div>

                    </div>

                    <svg
                      className="h-5 w-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>

                  </Link>

                  {/* SECURITY */}

                  <Link
                    to="/profile/changePassword"
                    className="group flex min-h-[96px] items-center justify-between rounded-2xl border border-gray-200 bg-white px-6 py-5 text-gray-900 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:shadow-lg"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">

                        <svg
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <rect
                            x="5"
                            y="10"
                            width="14"
                            height="10"
                            rx="2"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 10V7a4 4 0 018 0v3"
                          />

                        </svg>

                      </div>

                      <div>

                        <p className="text-base font-semibold">
                          Security
                        </p>

                        <p className="mt-0.5 text-sm text-gray-400">
                          Manage your password and security
                        </p>

                      </div>

                    </div>

                    <svg
                      className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>

                  </Link>

                </div>
              )}

            </div>

          </main>

        </div>

      </div>

    </div>
  )
}

export default Profile


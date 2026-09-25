
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { logout, resendOtp, UserProfile } from "../redux/features/userSlice"
import Navbar from "../components/Navbar"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"


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
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [time, setTime] = useState(0)

  useEffect(() => {
    dispatch(UserProfile())
  }, [dispatch])


  // Timer
  useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => {
        setTime(0)
      }, time)

      return () => clearTimeout(timer)
    }
  }, [time])


  const { user, error, google } = useAppSelector(
    (state) => state.userData
  )

  const isLoading = !user && !error


  const logoutHandle = async () => {
    try {
      await dispatch(logout()).unwrap()
      setTime(10000)
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.log("logout failed", error)
    }
  }


const handleVerification = async () => {
  if (!user?.email || isSendingOtp) return

  try {
    setIsSendingOtp(true)

    await dispatch(resendOtp(user.email)).unwrap()

    toast.success("OTP has been sent to your mail")

    setTime(100000)

    navigate("/auth/verify")
  } catch (error) {
    console.log("failed to send ", error)
  } finally {
    setIsSendingOtp(false)
  }
}


  return (
    <div className="min-h-screen bg-[#f6f6f6] text-[#111111]">

      <Navbar />

      <div className="w-full px-3 py-4 sm:px-4 lg:px-5">

        <div className="grid min-h-[calc(100vh-105px)] w-full grid-cols-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">

          {/* SIDEBAR */}

          <aside className="flex h-full min-h-[calc(100vh-105px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-5">

            {/* USER */}

            <div className="border-b border-gray-100 px-6 py-6">

              <div className="flex items-center gap-4">

                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ff5a1f] text-lg font-bold text-white shadow-sm">

                  {getInitials(user?.name)}

                  {user?.verified && (
                    <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-green-500">

                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12l4 4L19 6"
                        />
                      </svg>

                    </div>
                  )}

                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-center gap-2">

                    <p className="truncate text-base font-semibold text-gray-900">
                      {user?.name || "My Account"}
                    </p>

                  </div>

                  {!user?.verified && (
                    <Link
                      to="/veirification"
                      className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-[#ff5a1f] transition hover:bg-orange-100"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a1f]" />
                      Verification required
                    </Link>
                  )}

                  {user?.verified && (
                    <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600">

                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500 text-white">

                        <svg
                          className="h-2.5 w-2.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 12l4 4L19 6"
                          />
                        </svg>

                      </span>

                      Verified account
                    </div>
                  )}

                  <p className="mt-1 truncate text-xs text-gray-400">
                    {user?.email || "Manage your account"}
                  </p>

                </div>

              </div>

            </div>


            {/* NAVIGATION */}

            <div className="flex-1 p-5">

              {/* MANAGE ACCOUNT */}

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


                {/* Address (disabled until the account is verified) */}

                <Link
                  to="/profile/address"
                  aria-disabled={!user?.verified}
                  tabIndex={user?.verified ? undefined : -1}
                  title={user?.verified ? undefined : "Verify your account to manage addresses"}
                  onClick={(e) => {
                    if (!user?.verified) e.preventDefault()
                  }}
                  className={`mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    user?.verified
                      ? "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      : "cursor-not-allowed text-gray-400 opacity-50"
                  }`}
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


              {/* ORDERS */}

              <div className="mb-7">

                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  Orders
                </p>

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


              {/* SETTINGS */}

              <div>

                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  Settings
                </p>

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


          {/* MAIN CONTENT */}

          <main className="min-w-0 w-full rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="flex h-full min-h-[calc(100vh-105px)] flex-col p-6 sm:p-7 lg:p-9">

              {/* HEADER */}

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
                      d="M15.75 6a3.75 3.75 0 11-7.5 0z"
                    />
                  </svg>

                </div>

              </div>


              {/* ERROR */}

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


              {/* PROFILE CARD */}

              <div className="mt-5 rounded-2xl border border-gray-200 bg-gradient-to-r from-white via-white to-[#fff8f5] p-6">

                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                  <div className="flex items-center gap-4">

                    <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#ff5a1f] text-2xl font-bold text-white shadow-md">

                      {getInitials(user?.name)}

                      {user?.verified && (
                        <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500">

                          <svg
                            className="h-3.5 w-3.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 12l4 4L19 6"
                            />
                          </svg>

                        </div>
                      )}

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

                  <div
                    className={`flex items-center gap-3 rounded-xl px-5 py-4 shadow-sm ring-1 ${
                      user?.verified
                        ? "bg-green-50 ring-green-100"
                        : "bg-orange-50 ring-orange-100"
                    }`}
                  >

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        user?.verified
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-[#ff5a1f]"
                      }`}
                    >

                      {user?.verified ? (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 12l2.5 2.5L16 9"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                          />

                          <path
                            strokeLinecap="round"
                            d="M12 8v4M12 16h.01"
                          />
                        </svg>
                      )}

                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Account status
                      </p>

                      <p
                        className={`mt-0.5 text-sm font-semibold ${
                          user?.verified
                            ? "text-green-700"
                            : "text-[#ff5a1f]"
                        }`}
                      >
                        {user?.verified
                          ? "Verified"
                          : "Verification required"}
                      </p>

                    </div>

                  </div>

                </div>

              </div>


              {/* VERIFICATION BANNER */}

              {!user?.verified && (
                <button
  type="button"
  disabled={time > 0 || isSendingOtp}
  onClick={handleVerification}
                  className="group mt-5 flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-r from-[#fff7f2] to-white px-5 py-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#ff5a1f]/40 hover:shadow-md active:translate-y-0"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ff5a1f] text-white shadow-sm">

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
                          d="M12 3l8 4v5c0 4.5-3.1 7.8-8 9-4.9-1.2-8-4.5-8-9V7l8-4z"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4"
                        />

                      </svg>

                    </div>

                    <div>

                      <p className="text-sm font-bold text-gray-900">
                        Verify your account
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        Complete verification to secure your account
                      </p>

                    </div>

                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-400 shadow-sm transition group-hover:translate-x-1 group-hover:text-[#ff5a1f]">

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
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>

                  </div>

                </button>
              )}


              {/* DETAILS */}

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


              {/* ACTIONS */}

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

                  {!google && user?.verified && (
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
                  )}

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




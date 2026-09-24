import { useEffect, useState } from "react"
import { addPage,  getUser, minusPage } from "../../redux/features/userSlice"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import BlockUsers from "./BlockUsers"

const ViewUsers = () => {
  const dispatch = useAppDispatch()

  const { user, page, pages, loading } = useAppSelector(
    (state) => state.UsersData
  )
  const [showBlockuser,setShowBlockuser] = useState(false)
  const [id,setId] = useState("")
  useEffect(() => {
    dispatch(getUser(page))
  }, [dispatch, page])

  const columns = "md:grid-cols-[3fr_2.5fr_1.3fr_2.4fr]"



  const onclose = ()=>{
    setShowBlockuser(false)
  }



  return (
    <div className="flex min-h-full w-full flex-col bg-[#f4f4f5] p-4 sm:p-6 lg:p-8">
      {/* Hero header */}
      {showBlockuser && <BlockUsers onClose={onclose} page={page} userId={id}></BlockUsers>}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#ff5a1f] via-[#ff6f2f] to-[#ff9a4d] px-6 py-7 shadow-lg shadow-orange-200/60 sm:px-10 sm:py-9">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-24 right-40 h-52 w-52 rounded-full bg-white/10" />

        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Users
              </h1>
              <p className="mt-1 text-sm text-orange-50">
                View registered users, check verification and manage access.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/20 px-5 py-3 text-white backdrop-blur">
            <p className="text-xs text-orange-50">Current page</p>
            <p className="text-xl font-bold">
              {page}
              {pages && (
                <span className="text-base font-medium text-orange-100">
                  {" "}
                  / {pages}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Column labels */}
      <div
        className={`mb-3 hidden gap-6 px-8 text-sm font-medium text-gray-500 md:grid ${columns}`}
      >
        <div>Name</div>
        <div>Email</div>
        <div>Verification</div>
        <div>Status</div>
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col">
        {/* Loading */}
        {loading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white py-24">
            <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-orange-100 border-t-[#ff5a1f]" />
            <p className="text-sm text-gray-500">Loading users...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && user.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white py-24">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No users found.</p>
          </div>
        )}

        {/* Users */}
        {!loading && user.length > 0 && (
          <div className="flex flex-col gap-3">
            {user.map((item) => (
              <div
                key={item._id}
                className={`group relative grid grid-cols-1 gap-4 overflow-hidden rounded-2xl border bg-white px-5 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:px-8 md:items-center md:gap-6 ${columns} ${
                  item.banned
                    ? "border-red-100 hover:border-red-200"
                    : "border-gray-200 hover:border-orange-200"
                }`}
              >
                {/* Status accent bar */}
                <span
                  className={`absolute inset-y-0 left-0 w-1.5 ${
                    item.banned ? "bg-red-400" : "bg-[#ff5a1f]"
                  }`}
                />

                {/* Name + View details */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-base font-bold text-white shadow-sm ${
                      item.banned
                        ? "bg-gradient-to-br from-gray-400 to-gray-500"
                        : "bg-gradient-to-br from-[#ff5a1f] to-[#ff9a4d]"
                    }`}
                  >
                    {item.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-gray-900">
                      {item.name}
                    </p>

                    {/* UI only: add your onClick handler here */}
                    <button
                      type="button"
                      className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-[#e94e16] transition hover:bg-[#ff5a1f] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a1f] focus-visible:ring-offset-1"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      View details
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <p className="text-xs font-medium text-gray-400 md:hidden">
                    Email
                  </p>
                  <p className="mt-0.5 break-all text-sm text-gray-600 md:mt-0">
                    {item.email}
                  </p>
                </div>

                {/* Verification */}
                <div>
                  <p className="text-xs font-medium text-gray-400 md:hidden">
                    Verification
                  </p>
                  <span
                    className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold md:mt-0 ${
                      item.verified
                        ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200"
                        : "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        item.verified ? "bg-green-500" : "bg-orange-500"
                      }`}
                    />
                    {item.verified ? "Verified" : "Not Verified"}
                  </span>
                </div>

                {/* Status + Block button */}
                <div>
                  <p className="text-xs font-medium text-gray-400 md:hidden">
                    Status
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 md:mt-0">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                        item.banned
                          ? "bg-red-50 text-red-700 ring-red-200"
                          : "bg-green-50 text-green-700 ring-green-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          item.banned ? "bg-red-500" : "bg-green-500"
                        }`}
                      />
                      {item.banned ? "Banned" : "Active"}
                    </span>

                    {/* UI only: add your onClick handler here */}
                    <button
                      type="button" onClick={()=> {
                          setId(item._id)
                        setShowBlockuser(true)
                      }
                      }
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                        item.banned
                          ? "border-gray-200 text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400"
                          : "border-red-200 text-red-600 hover:bg-red-500 hover:text-white focus-visible:ring-red-400"
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="m5.6 5.6 12.8 12.8" />
                      </svg>
                      {item.banned ? "Unblock" : "Block"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1 w-full bg-gray-100">
          <div
            className="h-full bg-[#ff5a1f] transition-all duration-300"
            style={{ width: pages ? `${(page / pages) * 100}%` : "0%" }}
          />
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <button
            disabled={page === 1 || loading}
            onClick={() => dispatch(minusPage())}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Previous
          </button>

          <div className="text-sm text-gray-500">
            Page{" "}
            <span className="font-semibold text-gray-900">{page}</span> of{" "}
            <span className="font-semibold text-gray-900">{pages ?? 1}</span>
          </div>

          <button
            disabled={pages === null || page === pages || loading}
            onClick={() => dispatch(addPage())}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ff5a1f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-[#e94e16] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewUsers
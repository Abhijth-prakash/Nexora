import { useEffect, useState } from "react"
import { addPage, getUser, minusPage } from "../../redux/features/userSlice"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import BlockUsers from "./BlockUsers"
import AdminSidebar from "../../components/Adminsidebar"

const ViewUsers = () => {
  const dispatch = useAppDispatch()

  const { user, page, pages, loading, lastQuery } = useAppSelector(
    (state) => state.UsersData
  )

  const [showBlockuser, setShowBlockuser] = useState(false)
  const [banned, setBanned] = useState(false)
  const [search, setSearch] = useState("")
  const [id, setId] = useState("")
  const [filter, setFilter] = useState("")

  useEffect(() => {
    const sameQuery =
      lastQuery?.page === page &&
      lastQuery?.search === search &&
      lastQuery?.filter === filter

    if (sameQuery) {
      return
    }

    const timer = setTimeout(() => {
      dispatch(getUser({ page, search, filter }))
    }, 300)

    return () => clearTimeout(timer)
  }, [dispatch, page, search, filter])

  const columns = "md:grid-cols-[2fr_2.5fr_1.4fr_2fr]"

  const onclose = () => {
    setShowBlockuser(false)
    setId("")
    setBanned(false)
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fc] text-slate-800">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        {/* Block / Unblock modal */}
        {showBlockuser && (
          <BlockUsers
            onClose={onclose}
            page={page}
            userId={id}
            banned={banned}
            search={search}
            filter={filter}
          />
        )}

        {/* Page header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Administration
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              User Management
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage registered accounts, monitor verification, and control
              user access from one place.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
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
              <p className="text-xs font-medium text-slate-500">
                Current page
              </p>
              <p className="mt-0.5 text-xl font-bold text-slate-900">
                {page}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  / {pages ?? 1}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Search and filter */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Find users
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Search accounts or narrow the list by account status.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>

              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div className="relative sm:w-64">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              >
                <option value="">All users</option>
                <option value="verified">Verified</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>

              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </section>

        {/* Users table / list */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Registered Users
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Account information and access controls
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Account overview
            </div>
          </div>

          {/* Column labels */}
          <div
            className={`hidden gap-6 border-b border-slate-100 bg-slate-50/80 px-8 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 md:grid ${columns}`}
          >
            <div>User</div>
            <div>Email address</div>
            <div>Verification</div>
            <div>Account status / Actions</div>
          </div>

          <div className="flex min-h-[280px] flex-col">
            {/* Loading */}
            {loading && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-24">
                <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-orange-100 border-t-orange-500" />

                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    Loading users
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Please wait while accounts are fetched.
                  </p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && user.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>

                <h3 className="text-base font-semibold text-slate-800">
                  No users found
                </h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  There are no users to display for the current results.
                </p>
              </div>
            )}

            {/* Users */}
            {!loading && user.length > 0 && (
              <div className="flex flex-col divide-y divide-slate-100">
                {user
                  .filter((item) =>
                    item.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .filter((item) =>
                    item.email.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item._id}
                      className={`group relative grid grid-cols-1 gap-4 px-5 py-5 transition-colors hover:bg-slate-50/80 sm:px-6 md:items-center md:gap-6 md:px-8 ${columns}`}
                    >
                      {/* User information */}
                      <div className="flex min-w-0 items-center gap-3.5">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white ${
                            item.banned
                              ? "bg-slate-400"
                              : "bg-gradient-to-br from-orange-500 to-orange-400"
                          }`}
                        >
                          {item.name?.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {item.name}
                          </p>

                          <button
                            type="button"
                            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-orange-600 transition hover:text-orange-700 focus:outline-none focus-visible:underline"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
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
                      <div className="min-w-0">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 md:hidden">
                          Email address
                        </p>
                        <p className="break-all text-sm text-slate-600">
                          {item.email}
                        </p>
                      </div>

                      {/* Verification */}
                      <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 md:hidden">
                          Verification
                        </p>

                        <span
                          className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                            item.verified
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.verified
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {item.verified ? "Verified" : "Not verified"}
                        </span>
                      </div>

                      {/* Status and block/unblock */}
                      <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 md:hidden">
                          Account status
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                              item.banned
                                ? "bg-red-50 text-red-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                item.banned
                                  ? "bg-red-500"
                                  : "bg-emerald-500"
                              }`}
                            />
                            {item.banned ? "Banned" : "Active"}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              setId(item._id)
                              if (item.banned) {
                                setBanned(true)
                              }
                              setShowBlockuser(true)
                            }}
                            className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                              item.banned
                                ? "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100 focus-visible:ring-slate-400"
                                : "border-red-100 bg-white text-red-600 hover:border-red-200 hover:bg-red-50 focus-visible:ring-red-400"
                            }`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
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
          <div className="border-t border-slate-100 bg-slate-50/60">
            <div className="h-1 w-full bg-slate-100">
              <div
                className="h-full bg-orange-500 transition-all duration-300"
                style={{
                  width: pages ? `${(page / pages) * 100}%` : "0%",
                }}
              />
            </div>

            <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs text-slate-500">
                Page{" "}
                <span className="font-bold text-slate-800">{page}</span> of{" "}
                <span className="font-bold text-slate-800">{pages ?? 1}</span>
              </p>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <button
                  disabled={page === 1 || loading}
                  onClick={() => dispatch(minusPage())}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Previous
                </button>

                <button
                  disabled={pages === null || page === pages || loading}
                  onClick={() => dispatch(addPage())}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ViewUsers
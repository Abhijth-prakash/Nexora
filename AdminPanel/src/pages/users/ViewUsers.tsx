import { useEffect, useState } from "react"
import { addPage, getUser, minusPage } from "../../redux/features/userSlice"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import BlockUsers from "./BlockUsers"
import AdminSidebar from "../../components/Adminsidebar"

/* ---------- small presentational helpers (no logic) ---------- */

const Icon = ({
  children,
  className = "h-4 w-4",
  strokeWidth = 1.8,
}: {
  children: React.ReactNode
  className?: string
  strokeWidth?: number
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

const Badge = ({
  tone,
  children,
}: {
  tone: "green" | "amber" | "red"
  children: React.ReactNode
}) => {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
    red: "bg-red-50 text-red-700 ring-red-600/15",
  }
  const dots = {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[tone]}`} />
      {children}
    </span>
  )
}

const filters = [
  { value: "", label: "All users" },
  { value: "verified", label: "Verified" },
  { value: "active", label: "Active" },
  { value: "banned", label: "Banned" },
]

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
      <main className="relative min-w-0 flex-1 overflow-hidden px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        {/* soft orange glow behind the header */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-72 bg-[radial-gradient(60%_100%_at_15%_0%,rgba(251,146,60,0.16),transparent)]"
        />

        <div className="relative w-full">
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
          <header className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/25">
                <Icon className="h-7 w-7">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </Icon>
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-[2.1rem]">
                  User Management
                </h1>
                <p className="mt-1.5 max-w-lg text-sm leading-6 text-slate-500">
                  Manage registered accounts, monitor verification, and
                  control user access from one place.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur sm:self-auto">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Current page
                </p>
                <p className="text-xl font-bold leading-tight text-slate-900">
                  {page}
                  <span className="ml-1 text-sm font-medium text-slate-400">
                    / {pages ?? 1}
                  </span>
                </p>
              </div>

              <div className="relative h-11 w-11">
                <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    className="stroke-orange-100"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    className="stroke-orange-500 transition-all duration-500"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${pages ? (page / pages) * 94.2 : 0} 94.2`}
                  />
                </svg>
              </div>
            </div>
          </header>

          {/* Main panel */}
          <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.08)]">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </Icon>

                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* Filter (same `filter` state as before, shown as a segmented control) */}
              <div
                role="tablist"
                aria-label="Filter users by status"
                className="flex w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 lg:w-auto"
              >
                {filters.map((f) => {
                  const active = filter === f.value
                  return (
                    <button
                      key={f.value || "all"}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setFilter(f.value)}
                      className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 lg:flex-none ${
                        active
                          ? "bg-white text-orange-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {f.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Column labels */}
            <div
              className={`hidden gap-6 border-b border-slate-100 bg-slate-50/70 px-8 py-3 text-xs font-semibold tracking-wide text-slate-500 md:grid ${columns}`}
            >
              <div>User</div>
              <div>Email address</div>
              <div>Verification</div>
              <div>Account status</div>
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
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-400 ring-8 ring-orange-50/60">
                    <Icon className="h-7 w-7" strokeWidth={1.7}>
                      <circle cx="11" cy="11" r="7" />
                      <path d="m21 21-4.3-4.3" />
                    </Icon>
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
                        className={`group relative grid grid-cols-1 gap-4 px-5 py-4 transition-colors hover:bg-orange-50/40 sm:px-6 md:items-center md:gap-6 md:px-8 ${columns}`}
                      >
                        {/* accent bar on hover */}
                        <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-orange-500 opacity-0 transition-opacity group-hover:opacity-100" />

                        {/* User information */}
                        <div className="flex min-w-0 items-center gap-3.5">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold text-white ring-4 ring-white ${
                              item.banned
                                ? "bg-slate-400"
                                : "bg-gradient-to-br from-orange-500 to-orange-400 shadow-md shadow-orange-500/20"
                            }`}
                          >
                            {item.name?.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {item.name}
                            </p>

                            <button
                              type="button"
                              className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-orange-600 transition hover:text-orange-700 focus:outline-none focus-visible:underline"
                            >
                              <Icon className="h-3.5 w-3.5">
                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                              </Icon>
                              View details
                            </button>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="min-w-0">
                          <p className="mb-1 text-xs font-medium text-slate-400 md:hidden">
                            Email address
                          </p>
                          <p className="break-all text-sm text-slate-600">
                            {item.email}
                          </p>
                        </div>

                        {/* Verification */}
                        <div>
                          <p className="mb-1 text-xs font-medium text-slate-400 md:hidden">
                            Verification
                          </p>
                          <Badge tone={item.verified ? "green" : "amber"}>
                            {item.verified ? "Verified" : "Not verified"}
                          </Badge>
                        </div>

                        {/* Status and block/unblock */}
                        <div>
                          <p className="mb-1 text-xs font-medium text-slate-400 md:hidden">
                            Account status
                          </p>

                          <div className="flex flex-wrap items-center gap-3">
                            <Badge tone={item.banned ? "red" : "green"}>
                              {item.banned ? "Banned" : "Active"}
                            </Badge>

                            <button
                              type="button"
                              onClick={() => {
                                setId(item._id)
                                if (item.banned) {
                                  setBanned(true)
                                }
                                setShowBlockuser(true)
                              }}
                              className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                                item.banned
                                  ? "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100 focus-visible:ring-slate-400"
                                  : "border-red-100 bg-white text-red-600 hover:border-red-200 hover:bg-red-50 focus-visible:ring-red-400"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5">
                                <circle cx="12" cy="12" r="9" />
                                <path d="m5.6 5.6 12.8 12.8" />
                              </Icon>
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
                  className="h-full rounded-r-full bg-orange-500 transition-all duration-300"
                  style={{
                    width: pages ? `${(page / pages) * 100}%` : "0%",
                  }}
                />
              </div>

              <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-slate-500">
                  Page{" "}
                  <span className="font-bold text-slate-800">{page}</span> of{" "}
                  <span className="font-bold text-slate-800">{pages ?? 1}</span>
                </p>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <button
                    disabled={page === 1 || loading}
                    onClick={() => dispatch(minusPage())}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Icon strokeWidth={2}>
                      <path d="m15 18-6-6 6-6" />
                    </Icon>
                    Previous
                  </button>

                  <button
                    disabled={pages === null || page === pages || loading}
                    onClick={() => dispatch(addPage())}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  >
                    Next
                    <Icon strokeWidth={2}>
                      <path d="m9 18 6-6-6-6" />
                    </Icon>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default ViewUsers
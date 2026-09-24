import { Link } from "react-router-dom"

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#f6f6f6] text-[#111111]">

      <div className="w-full px-3 py-4 sm:px-4 lg:px-5">

        <div className="grid min-h-[calc(100vh-32px)] w-full grid-cols-1 gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">

          {/* ================= SIDEBAR ================= */}

          <aside className="flex min-h-[calc(100vh-32px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-5">

            {/* ADMIN PROFILE */}

            <div className="border-b border-gray-100 px-6 py-6">

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


            {/* ================= NAVIGATION ================= */}

            <div className="flex-1 p-5">

              {/* MAIN */}

              <div className="mb-7">

                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  Overview
                </p>


                {/* DASHBOARD */}

                <Link
                  to="/admin/dashboard"
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
                      <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                      />

                      <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                      />

                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                      />

                      <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                      />
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

                      <circle
                        cx="9"
                        cy="7"
                        r="4"
                      />

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
                  to="/admin/categories"
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

            <div className="border-t border-gray-100 p-5">

              <div className="rounded-xl bg-[#fff8f5] p-4">

                <p className="text-xs font-semibold text-gray-900">
                  Admin Panel
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Manage your store from one place.
                </p>

              </div>

            </div>

          </aside>


          {/* ================= MAIN CONTENT ================= */}

          <main className="min-w-0 w-full rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="flex min-h-[calc(100vh-32px)] flex-col p-6 sm:p-7 lg:p-9">


              {/* HEADER */}

              <div className="flex flex-col gap-5 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm font-medium text-[#ff5a1f]">
                    Admin Panel
                  </p>

                  <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Dashboard
                  </h1>

                  <p className="mt-1 text-sm text-gray-400">
                    Overview of your store and recent activity.
                  </p>

                </div>


                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#fff1eb] text-[#ff5a1f]">

                  <svg
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                    />

                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                    />

                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                    />

                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                    />

                  </svg>

                </div>

              </div>


              {/* ================= STATS ================= */}

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


                {/* USERS */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-md">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Total Users
                      </p>

                      <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        1,248
                      </h2>

                      <p className="mt-2 text-xs font-medium text-green-600">
                        +12.5% this month
                      </p>

                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1eb] text-[#ff5a1f]">

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

                        <circle
                          cx="9"
                          cy="7"
                          r="4"
                        />

                      </svg>

                    </div>

                  </div>

                </div>


                {/* PRODUCTS */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-md">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Products
                      </p>

                      <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        342
                      </h2>

                      <p className="mt-2 text-xs font-medium text-green-600">
                        +8 new this week
                      </p>

                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

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

                      </svg>

                    </div>

                  </div>

                </div>


                {/* ORDERS */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-md">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Orders
                      </p>

                      <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        2,856
                      </h2>

                      <p className="mt-2 text-xs font-medium text-green-600">
                        +18.2% this month
                      </p>

                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">

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

                      </svg>

                    </div>

                  </div>

                </div>


                {/* REVENUE */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-md">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Revenue
                      </p>

                      <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        ₹4.82L
                      </h2>

                      <p className="mt-2 text-xs font-medium text-green-600">
                        +14.8% this month
                      </p>

                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">

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
                          d="M12 3v18M17 7.5c0-1.66-2.24-3-5-3s-5 1.34-5 3 2.24 3 5 3 5 1.34 5 3-2.24 3-5 3-5-1.34-5-3"
                        />

                      </svg>

                    </div>

                  </div>

                </div>

              </div>


              {/* ================= CONTENT GRID ================= */}

              <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">


                {/* RECENT ORDERS */}

                <div className="rounded-2xl border border-gray-200 bg-white">

                  <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

                    <div>

                      <h2 className="text-lg font-bold text-gray-900">
                        Recent Orders
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        Latest customer orders
                      </p>

                    </div>

                    <Link
                      to="/admin/orders"
                      className="text-xs font-semibold text-[#ff5a1f] hover:underline"
                    >
                      View all
                    </Link>

                  </div>


                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[600px]">

                      <thead>

                        <tr className="border-b border-gray-100 text-left">

                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Order
                          </th>

                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Customer
                          </th>

                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Amount
                          </th>

                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Status
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        <tr className="border-b border-gray-100">

                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            #ORD-1024
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-500">
                            Rahul Kumar
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            ₹2,499
                          </td>

                          <td className="px-6 py-4">

                            <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-600">
                              Delivered
                            </span>

                          </td>

                        </tr>


                        <tr className="border-b border-gray-100">

                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            #ORD-1023
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-500">
                            Anjali S
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            ₹1,899
                          </td>

                          <td className="px-6 py-4">

                            <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold text-[#ff5a1f]">
                              Processing
                            </span>

                          </td>

                        </tr>


                        <tr className="border-b border-gray-100">

                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            #ORD-1022
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-500">
                            Arjun P
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            ₹4,250
                          </td>

                          <td className="px-6 py-4">

                            <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-600">
                              Shipped
                            </span>

                          </td>

                        </tr>


                        <tr>

                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            #ORD-1021
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-500">
                            Meera K
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            ₹999
                          </td>

                          <td className="px-6 py-4">

                            <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-500">
                              Cancelled
                            </span>

                          </td>

                        </tr>

                      </tbody>

                    </table>

                  </div>

                </div>


                {/* TOP PRODUCTS */}

                <div className="rounded-2xl border border-gray-200 bg-white">

                  <div className="border-b border-gray-100 px-6 py-5">

                    <h2 className="text-lg font-bold text-gray-900">
                      Top Products
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Best performing products
                    </p>

                  </div>


                  <div className="p-5">


                    {/* PRODUCT 1 */}

                    <div className="flex items-center gap-4 border-b border-gray-100 py-4 first:pt-0">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff1eb] text-lg">
                        👟
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-gray-900">
                          Running Shoes
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          128 sold
                        </p>

                      </div>

                      <p className="text-sm font-bold text-gray-900">
                        ₹89K
                      </p>

                    </div>


                    {/* PRODUCT 2 */}

                    <div className="flex items-center gap-4 border-b border-gray-100 py-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg">
                        🎧
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-gray-900">
                          Wireless Headphones
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          96 sold
                        </p>

                      </div>

                      <p className="text-sm font-bold text-gray-900">
                        ₹72K
                      </p>

                    </div>


                    {/* PRODUCT 3 */}

                    <div className="flex items-center gap-4 border-b border-gray-100 py-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-lg">
                        ⌚
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-gray-900">
                          Smart Watch
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          84 sold
                        </p>

                      </div>

                      <p className="text-sm font-bold text-gray-900">
                        ₹61K
                      </p>

                    </div>


                    {/* PRODUCT 4 */}

                    <div className="flex items-center gap-4 py-4 last:pb-0">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-lg">
                        🎒
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-gray-900">
                          Travel Backpack
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          71 sold
                        </p>

                      </div>

                      <p className="text-sm font-bold text-gray-900">
                        ₹45K
                      </p>

                    </div>


                  </div>

                </div>

              </div>


              {/* ================= QUICK ACTIONS ================= */}

              <div className="mt-5">

                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  Quick Actions
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


                  <Link
                    to="/admin/products"
                    className="group flex items-center justify-between rounded-2xl bg-[#ff5a1f] px-5 py-4 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#e64f19] hover:shadow-lg"
                  >

                    <div>

                      <p className="text-sm font-semibold">
                        Add Product
                      </p>

                      <p className="mt-1 text-xs text-white/70">
                        Create a new product
                      </p>

                    </div>

                    <span className="text-xl transition group-hover:translate-x-1">
                      +
                    </span>

                  </Link>


                  <Link
                    to="/admin/categories"
                    className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                  >

                    <div>

                      <p className="text-sm font-semibold text-gray-900">
                        Add Category
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Create a category
                      </p>

                    </div>

                    <span className="text-xl text-gray-400 transition group-hover:translate-x-1">
                      +
                    </span>

                  </Link>


                  <Link
                    to="/admin/orders"
                    className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                  >

                    <div>

                      <p className="text-sm font-semibold text-gray-900">
                        View Orders
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Manage customer orders
                      </p>

                    </div>

                    <span className="text-gray-400 transition group-hover:translate-x-1">
                      →
                    </span>

                  </Link>


                  <Link
                    to="/admin/users/view"
                    className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                  >

                    <div>

                      <p className="text-sm font-semibold text-gray-900">
                        Manage Users
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        View registered users
                      </p>

                    </div>

                    <span className="text-gray-400 transition group-hover:translate-x-1">
                      →
                    </span>

                  </Link>

                </div>

              </div>

            </div>

          </main>

        </div>

      </div>

    </div>
  )
}

export default Dashboard
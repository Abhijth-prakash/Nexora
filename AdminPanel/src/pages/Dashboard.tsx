import { Link } from "react-router-dom"
import AdminSidebar from "../components/Adminsidebar"

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#f6f6f6] text-[#111111]">

      <div className="w-full px-3 py-4 sm:px-4 lg:px-5">

        <div className="grid min-h-[calc(100vh-32px)] w-full grid-cols-1 gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">

          {/* ================= SIDEBAR ================= */}

          <AdminSidebar />


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
                    to="/admin/category"
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
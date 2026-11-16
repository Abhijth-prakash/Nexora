import { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useAppSelector } from "../redux/hooks"
import AdminSidebar from "../components/Adminsidebar"

import type { Baseorder, BaseProduct, BaseUser } from "../utils/BaseType"
import { getOrders } from "../redux/features/orderSlice"
import { getUser } from "../redux/features/userSlice"
import { getProducts } from "../redux/features/ProductSlice"

type OrderStatus = Baseorder["orderStatus"]

const toArray = <T,>(v: any, ...keys: string[]): T[] => {
  if (Array.isArray(v)) return v
  for (const k of keys) if (Array.isArray(v?.[k])) return v[k]
  return []
}

const toTotal = (v: any, fallback: number, ...keys: string[]): number => {
  for (const k of keys) if (typeof v?.[k] === "number") return v[k]
  return fallback
}

const formatINR = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`
  if (n >= 10000) return `₹${(n / 1000).toFixed(1)}K`
  return `₹${Math.round(n).toLocaleString("en-IN")}`
}

const STATUS_META: Record<OrderStatus, { label: string; badge: string; bar: string }> = {
  payment_pending: { label: "Payment Pending", badge: "bg-yellow-50 text-yellow-700", bar: "bg-yellow-400" },
  confirmed: { label: "Confirmed", badge: "bg-orange-50 text-[#ff5a1f]", bar: "bg-[#ff5a1f]" },
  shipped: { label: "Shipped", badge: "bg-blue-50 text-blue-600", bar: "bg-blue-500" },
  out_for_delivery: { label: "Out for Delivery", badge: "bg-indigo-50 text-indigo-600", bar: "bg-indigo-500" },
  delivered: { label: "Delivered", badge: "bg-green-50 text-green-600", bar: "bg-green-500" },
  cancelled: { label: "Cancelled", badge: "bg-red-50 text-red-500", bar: "bg-red-400" },
  return_requested: { label: "Return Requested", badge: "bg-purple-50 text-purple-600", bar: "bg-purple-500" },
  returned: { label: "Returned", badge: "bg-gray-100 text-gray-600", bar: "bg-gray-400" },
}

// Orders that should not count towards revenue
const NON_REVENUE: OrderStatus[] = ["payment_pending", "cancelled", "returned"]

const customerName = (o: Baseorder) =>
  typeof o.user === "object" && o.user ? (o.user as BaseUser).name : "Customer"

const shortId = (o: Baseorder) => `#${o._id.slice(-6).toUpperCase()}`

const timeAgo = (iso?: string) => {
  if (!iso) return ""
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

const LOW_STOCK = 10

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-100 ${className}`} />
)

const iconProps = {
  className: "h-5 w-5",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 1.8,
}

const StatCard = ({
  label,
  value,
  sub,
  loading,
  tint,
  icon,
}: {
  label: string
  value: string
  sub: string
  loading: boolean
  tint: string
  icon: React.ReactNode
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-md">
    <div className="flex items-start justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
        {loading ? (
          <>
            <Skeleton className="mt-3 h-8 w-24" />
            <Skeleton className="mt-3 h-3 w-28" />
          </>
        ) : (
          <>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">{value}</h2>
            <p className="mt-2 text-xs font-medium text-gray-500">{sub}</p>
          </>
        )}
      </div>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tint}`}>{icon}</div>
    </div>
  </div>
)

const CardHeader = ({ title, sub, to }: { title: string; sub: string; to?: string }) => (
  <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
    <div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="mt-1 text-xs text-gray-400">{sub}</p>
    </div>
    {to && (
      <Link to={to} className="text-xs font-semibold text-[#ff5a1f] hover:underline">
        View all
      </Link>
    )}
  </div>
)

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

const Dashboard = () => {
  const dispatch = useDispatch<any>()

  const {
    orders: ordersList,
    loading: ordersLoading,
    totalOrders: ordersTotal,
    stats,
  } = useAppSelector((state) => state.orderData)

  const { products: productsList, lastQuery: productsLastQuery } = useAppSelector(
    (state) => state.productData
  )

  const { user: usersList, loading: usersLoading } = useAppSelector(
    (state) => state.UsersData
  )

  useEffect(() => {
    dispatch(getOrders({ page: 1, search: "", status: "", payment: "" }))
    dispatch(getUser({ page: 1, search: "", filter: "" }))
    dispatch(getProducts({ page: 1, search: "", sort: "", filter: "" }))
  }, [dispatch])

  const orders = useMemo(() => toArray<Baseorder>(ordersList), [ordersList])
  const users = useMemo(() => toArray<BaseUser>(usersList), [usersList])
  const products = useMemo(() => toArray<BaseProduct>(productsList), [productsList])

  // The products slice has no `loading`, so treat "nothing fetched yet" as loading
  const productsLoading = !productsLastQuery && products.length === 0

  /* ---------- derived numbers ---------- */

  const totalOrders = typeof ordersTotal === "number" ? ordersTotal : orders.length
  // No total in the users / products slices, so these reflect what was fetched
  const totalUsers = users.length
  const totalProducts = products.length

  // Prefer server-side stats if it provides revenue, otherwise sum the loaded orders
  const statsRevenue = toTotal(stats, NaN, "totalRevenue", "revenue", "totalSales")
  const revenue = useMemo(
    () =>
      !Number.isNaN(statsRevenue)
        ? statsRevenue
        : orders
            .filter((o) => !NON_REVENUE.includes(o.orderStatus))
            .reduce((sum, o) => sum + (o.totalAmount - (o.refundedAmount ?? 0)), 0),
    [orders, statsRevenue]
  )

  const toShip = orders.filter((o) => o.orderStatus === "confirmed").length
  const returnsPending = orders.filter((o) => o.orderStatus === "return_requested").length

  const verifiedUsers = users.filter((u) => u.verified).length
  const bannedUsers = users.filter((u) => u.banned).length

  const outOfStock = products.filter((p) => p.stock <= 0).length
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK).length

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [orders]
  )

  const statusBreakdown = useMemo(() => {
    const counts = {} as Record<OrderStatus, number>
    orders.forEach((o) => {
      counts[o.orderStatus] = (counts[o.orderStatus] ?? 0) + 1
    })
    return (Object.keys(STATUS_META) as OrderStatus[])
      .map((s) => ({ status: s, count: counts[s] ?? 0 }))
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count)
  }, [orders])

  const stockAlerts = useMemo(
    () =>
      products
        .filter((p) => p.stock <= LOW_STOCK)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5),
    [products]
  )

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
        {/* HEADER */}
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#ff5a1f]">Admin Panel</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-black">Dashboard</h1>
            <p className="mt-1.5 text-sm text-[#8a7568]">Overview of your store and recent activity.</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#fff1eb] text-[#ff5a1f]">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Users"
            value={totalUsers.toLocaleString("en-IN")}
            sub={`${verifiedUsers} verified · ${bannedUsers} banned`}
            loading={usersLoading}
            tint="bg-[#fff1eb] text-[#ff5a1f]"
            icon={
              <svg {...iconProps}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            }
          />
          <StatCard
            label="Products"
            value={totalProducts.toLocaleString("en-IN")}
            sub={`${lowStock} low stock · ${outOfStock} out of stock`}
            loading={productsLoading}
            tint="bg-blue-50 text-blue-600"
            icon={
              <svg {...iconProps}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8l-9-5-9 5 9 5 9-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8v9l9 5 9-5V8" />
              </svg>
            }
          />
          <StatCard
            label="Orders"
            value={totalOrders.toLocaleString("en-IN")}
            sub={`${toShip} to ship · ${returnsPending} return requests`}
            loading={ordersLoading}
            tint="bg-purple-50 text-purple-600"
            icon={
              <svg {...iconProps}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l1 4H5l1-4zM5 7h14v13H5V7z" />
              </svg>
            }
          />
          <StatCard
            label="Revenue"
            value={formatINR(revenue)}
            sub="After refunds, excl. cancelled"
            loading={ordersLoading}
            tint="bg-green-50 text-green-600"
            icon={
              <svg {...iconProps}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v18M17 7.5c0-1.66-2.24-3-5-3s-5 1.34-5 3 2.24 3 5 3 5 1.34 5 3-2.24 3-5 3-5-1.34-5-3"
                />
              </svg>
            }
          />
        </div>

        {/* CONTENT GRID */}
        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
          {/* RECENT ORDERS */}
          <div className="rounded-2xl border border-gray-200 bg-white">
            <CardHeader title="Recent Orders" sub="Latest customer orders" to="/admin/orders" />

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    {["Order", "Customer", "Items", "Amount", "Status"].map((h) => (
                      <th key={h} className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading &&
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        {Array.from({ length: 5 }).map((__, j) => (
                          <td key={j} className="px-6 py-4">
                            <Skeleton className="h-4 w-16" />
                          </td>
                        ))}
                      </tr>
                    ))}

                  {!ordersLoading && recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                        No orders yet.
                      </td>
                    </tr>
                  )}

                  {!ordersLoading &&
                    recentOrders.map((o, i) => (
                      <tr
                        key={o._id}
                        className={i < recentOrders.length - 1 ? "border-b border-gray-100" : ""}
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">{shortId(o)}</p>
                          <p className="mt-0.5 text-[11px] text-gray-400">{timeAgo(o.createdAt)}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{customerName(o)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{o.items?.length ?? 0}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          ₹{o.totalAmount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${
                              STATUS_META[o.orderStatus]?.badge ?? "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {STATUS_META[o.orderStatus]?.label ?? o.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-5">
            {/* ORDER STATUS */}
            <div className="rounded-2xl border border-gray-200 bg-white">
              <CardHeader title="Order Status" sub="Breakdown of loaded orders" />
              <div className="space-y-4 p-6">
                {ordersLoading &&
                  Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}

                {!ordersLoading && statusBreakdown.length === 0 && (
                  <p className="py-4 text-center text-sm text-gray-400">No data yet.</p>
                )}

                {!ordersLoading &&
                  statusBreakdown.map(({ status, count }) => (
                    <div key={status}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-700">{STATUS_META[status].label}</span>
                        <span className="font-semibold text-gray-900">{count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${STATUS_META[status].bar}`}
                          style={{ width: `${(count / Math.max(orders.length, 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* STOCK ALERTS */}
            <div className="rounded-2xl border border-gray-200 bg-white">
              <CardHeader title="Stock Alerts" sub={`Products with ${LOW_STOCK} or fewer left`} to="/admin/products" />
              <div className="p-5">
                {productsLoading &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 py-3">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))}

                {!productsLoading && stockAlerts.length === 0 && (
                  <p className="py-6 text-center text-sm text-gray-400">All products are well stocked 🎉</p>
                )}

                {!productsLoading &&
                  stockAlerts.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center gap-4 border-b border-gray-100 py-3 first:pt-0 last:border-0 last:pb-0"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fff1eb] text-sm font-bold text-[#ff5a1f]">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                        ) : (
                          p.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">{p.name}</p>
                        <p className="mt-0.5 truncate text-xs text-gray-400">
                          {p.category?.name} · ₹{p.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${
                          p.stock <= 0 ? "bg-red-50 text-red-500" : "bg-orange-50 text-[#ff5a1f]"
                        }`}
                      >
                        {p.stock <= 0 ? "Out of stock" : `${p.stock} left`}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-5">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Link
              to="/admin/products"
              className="group flex items-center justify-between rounded-2xl bg-[#ff5a1f] px-5 py-4 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#e64f19] hover:shadow-lg"
            >
              <div>
                <p className="text-sm font-semibold">Add Product</p>
                <p className="mt-1 text-xs text-white/70">Create a new product</p>
              </div>
              <span className="text-xl transition group-hover:translate-x-1">+</span>
            </Link>

            {[
              { to: "/admin/category", title: "Add Category", sub: "Create a category", icon: "+" },
              { to: "/admin/orders", title: "View Orders", sub: "Manage customer orders", icon: "→" },
              { to: "/admin/users/view", title: "Manage Users", sub: "View registered users", icon: "→" },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                  <p className="mt-1 text-xs text-gray-400">{a.sub}</p>
                </div>
                <span className="text-xl text-gray-400 transition group-hover:translate-x-1">{a.icon}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
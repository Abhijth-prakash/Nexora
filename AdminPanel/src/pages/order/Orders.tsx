import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getOrders, setPage } from "../../redux/features/orderSlice";
import AdminSidebar from "../../components/Adminsidebar";
import type { Baseorder } from "../../utils/BaseType";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

const PAGE_LIMIT = 5; // keep in sync with the limit used in the slice / backend

type OrderWithStatus = Baseorder & { orderStatus?: string; status?: string };

const ORDER_STATUSES = ["pending", "processing", "completed", "cancelled"];
const PAYMENT_STATUSES = ["paid", "pending", "failed", "refunded", "cod"];

const getOrderStatus = (order: Baseorder) => {
  const o = order as OrderWithStatus;
  return (o.orderStatus || o.status || "pending").toLowerCase();
};

const statusText: Record<string, string> = {
  pending: "text-amber-600",
  processing: "text-[#ff5a1f]",
  completed: "text-emerald-600",
  cancelled: "text-red-500",
};

const paymentBadge = (paymentStatus: string) => {
  switch (paymentStatus) {
    case "paid":
      return { label: "Paid", cls: "bg-emerald-50 text-emerald-600" };
    case "cod":
      return { label: "COD", cls: "bg-amber-50 text-amber-600" };
    case "failed":
      return { label: "Failed", cls: "bg-red-50 text-red-600" };
    case "refunded":
      return { label: "Refunded", cls: "bg-blue-50 text-blue-600" };
    default:
      return { label: "Pending", cls: "bg-gray-100 text-gray-600" };
  }
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Orders = () => {
  const dispatch = useAppDispatch();

  const { orders, loading, error, page, pages, totalOrders, stats, lastQuery } =
    useAppSelector((state) => state.orderData);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");

  // Fetch from the backend whenever page / search / filters change (debounced)
  useEffect(() => {
    const sameQuery =
      lastQuery?.page === page &&
      lastQuery?.search === search &&
      lastQuery?.status === status &&
      lastQuery?.payment === payment;

    if (sameQuery) return;

    const timer = setTimeout(() => {
      dispatch(getOrders({ page, search, status, payment }));
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, page, search, status, payment, lastQuery]);

  // Any change to search / filters goes back to page 1
  const onSearchChange = (value: string) => {
    setSearch(value);
    dispatch(setPage(1));
  };

  const onStatusChange = (value: string) => {
    setStatus(value);
    dispatch(setPage(1));
  };

  const onPaymentChange = (value: string) => {
    setPayment(value);
    dispatch(setPage(1));
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getCustomerName = (user: Baseorder["user"]) =>
    typeof user === "string" ? "Customer" : user.name;

  // TODO: wire this to your own thunk (update order status)
  const handleStatusChange = (orderId: string, newStatus: string) => {
    console.log("update status", orderId, newStatus);
  };

  const totalPages = pages ?? 1;
  const list = orders || [];
  const from = totalOrders === 0 ? 0 : (page - 1) * PAGE_LIMIT + 1;
  const to = Math.min(page * PAGE_LIMIT, totalOrders);

  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    const first = Math.max(1, Math.min(page - 1, totalPages - 2));
    const last = Math.min(totalPages, first + 2);
    for (let i = first; i <= last; i++) nums.push(i);
    return nums;
  }, [page, totalPages]);

  const statCards = [
    { label: "Total Orders", value: stats?.total ?? 0 },
    { label: "Pending", value: stats?.pending ?? 0 },
    { label: "Processing", value: stats?.processing ?? 0 },
    { label: "Completed", value: stats?.completed ?? 0 },
  ];

  const selectBase =
    "h-12 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 text-sm font-semibold text-gray-900 outline-none transition focus:border-[#ff5a1f]";

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
        {/* HEADER */}
        <div className="mb-7">
          <h1 className="text-3xl font-extrabold tracking-tight text-black">
            Order Management
          </h1>
          <p className="mt-1.5 text-sm text-[#8a7568]">
            View, track and manage all customer orders.
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-gray-200 bg-white px-5 py-4"
            >
              <p className="text-xs text-[#8a7568]">{card.label}</p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-black">
                {card.value.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>

        {/* FILTER BAR */}
        <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[2fr_1fr_1fr]">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search order ID or customer..."
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#ff5a1f]"
            />
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className={selectBase}
            >
              <option value="">All Status</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {capitalize(s)}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <div className="relative">
            <select
              value={payment}
              onChange={(e) => onPaymentChange(e.target.value)}
              className={selectBase}
            >
              <option value="">All Payment</option>
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "cod" ? "COD" : capitalize(s)}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-black">All Orders</h2>
            <p className="text-xs text-[#8a7568]">
              {totalOrders.toLocaleString("en-IN")} orders
            </p>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-orange-100 border-t-[#ff5a1f]" />
              <p className="text-sm text-gray-400">Loading orders...</p>
            </div>
          )}

          {!loading && error && (
            <div className="py-16 text-center">
              <p className="text-sm font-semibold text-gray-800">
                Couldn't load orders
              </p>
              <p className="mt-1 text-xs text-gray-400">{error}</p>
              <button
                onClick={() =>
                  dispatch(getOrders({ page, search, status, payment }))
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff5a1f]"
              >
                <RefreshCw size={14} />
                Try again
              </button>
            </div>
          )}

          {!loading && !error && list.length === 0 && (
            <div className="py-20 text-center text-sm text-gray-400">
              No orders found.
            </div>
          )}

          {!loading && !error && list.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left">
                  <thead>
                    <tr className="bg-[#f6f4f2] text-[11px] font-bold uppercase tracking-wider text-[#8a7568]">
                      <th className="rounded-l-lg px-5 py-3.5">Order ID</th>
                      <th className="px-3 py-3.5">Customer</th>
                      <th className="px-3 py-3.5">Date</th>
                      <th className="px-3 py-3.5">Items</th>
                      <th className="px-3 py-3.5">Total</th>
                      <th className="px-3 py-3.5">Payment</th>
                      <th className="px-3 py-3.5">Status</th>
                      <th className="rounded-r-lg px-3 py-3.5">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {list.map((order) => {
                      const badge = paymentBadge(order.paymentStatus);
                      const orderStatus = getOrderStatus(order);

                      return (
                        <tr
                          key={order._id}
                          className="border-b border-gray-100 text-sm text-gray-800 last:border-0"
                        >
                          <td className="px-5 py-5 text-xs font-extrabold text-black">
                            #{order._id.slice(-8).toUpperCase()}
                          </td>

                          <td className="px-3 py-5 text-xs">
                            {getCustomerName(order.user)}
                          </td>

                          <td className="px-3 py-5 text-xs text-[#8a7568]">
                            {formatDate(order.orderDate || order.createdAt)}
                          </td>

                          <td className="px-3 py-5 text-xs">
                            {order.items.length}
                          </td>

                          <td className="px-3 py-5 text-xs font-extrabold text-black">
                            ₹{order.totalAmount.toLocaleString("en-IN")}
                          </td>

                          <td className="px-3 py-5">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${badge.cls}`}
                            >
                              {badge.label}
                            </span>
                          </td>

                          <td className="px-3 py-5">
                            <div className="relative w-32">
                              <select
                                value={orderStatus}
                                onChange={(e) =>
                                  handleStatusChange(order._id, e.target.value)
                                }
                                className={`h-10 w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-xs font-medium outline-none transition focus:border-[#ff5a1f] ${
                                  statusText[orderStatus] || "text-gray-600"
                                }`}
                              >
                                {ORDER_STATUSES.map((s) => (
                                  <option key={s} value={s}>
                                    {capitalize(s)}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown
                                size={13}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                              />
                            </div>
                          </td>

                          <td className="px-3 py-5">
                            <Link
                              to={`/admin/orders/${order._id}`}
                              className="text-xs font-bold text-[#ff5a1f] transition hover:underline"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <p className="text-[11px] text-[#8a7568]">
                  Showing {from}–{to} of {totalOrders.toLocaleString("en-IN")}{" "}
                  orders
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(setPage(page - 1))}
                    disabled={page === 1 || loading}
                    className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 transition hover:border-[#ff5a1f] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={14} />
                    Prev
                  </button>

                  {pageNumbers.map((n) => (
                    <button
                      key={n}
                      onClick={() => dispatch(setPage(n))}
                      disabled={loading}
                      className={`h-9 w-9 rounded-lg text-xs font-bold transition ${
                        n === page
                          ? "bg-[#ff6b47] text-white"
                          : "border border-gray-200 text-gray-700 hover:border-[#ff5a1f]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    onClick={() => dispatch(setPage(page + 1))}
                    disabled={pages === null || page === pages || loading}
                    className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 transition hover:border-[#ff5a1f] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Orders;
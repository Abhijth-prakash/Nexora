import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getOrders,
  setPage,
  updateOrderStatus,
} from "../../redux/features/orderSlice";
import AdminSidebar from "../../components/Adminsidebar";
import type { Baseorder } from "../../utils/BaseType";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Lock,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";

const PAGE_LIMIT = 5; // keep in sync with the limit used in the slice / backend

type OrderStatus = Baseorder["orderStatus"];
type PaymentStatus = Baseorder["paymentStatus"];

// statuses an admin can move an order to by hand
const ORDER_STATUSES: OrderStatus[] = [
  "confirmed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

// statuses offered in the filter (includes states the admin can't set by hand)
const FILTER_STATUSES: OrderStatus[] = [
  "payment_pending",
  ...ORDER_STATUSES,
  "return_requested",
  "returned",
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "partially_refunded",
  "refunded",
  "cod",
];

// statuses that are driven by other flows, so the dropdown stays read-only
const READ_ONLY_STATUS_HINT: Partial<Record<OrderStatus, string>> = {
  payment_pending: "Status can be changed once the payment is completed",
  return_requested: "Handled through the return request",
  returned: "This order has been returned",
};

const statusLabel: Record<string, string> = {
  payment_pending: "Payment pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  return_requested: "Return requested",
  returned: "Returned",
};

const statusText: Record<string, string> = {
  payment_pending: "text-gray-500",
  confirmed: "text-amber-600",
  shipped: "text-blue-600",
  out_for_delivery: "text-[#ff5a1f]",
  delivered: "text-emerald-600",
  cancelled: "text-red-500",
  return_requested: "text-amber-700",
  returned: "text-gray-600",
};

const statusDot: Record<string, string> = {
  payment_pending: "bg-gray-400",
  confirmed: "bg-amber-500",
  shipped: "bg-blue-500",
  out_for_delivery: "bg-[#ff5a1f]",
  delivered: "bg-emerald-500",
  cancelled: "bg-red-500",
  return_requested: "bg-amber-600",
  returned: "bg-gray-500",
};

const paymentBadge = (paymentStatus: PaymentStatus) => {
  switch (paymentStatus) {
    case "paid":
      return { label: "Paid", cls: "bg-emerald-50 text-emerald-600" };
    case "cod":
      return { label: "COD", cls: "bg-amber-50 text-amber-600" };
    case "failed":
      return { label: "Failed", cls: "bg-red-50 text-red-600" };
    case "refunded":
      return { label: "Refunded", cls: "bg-blue-50 text-blue-600" };
    case "partially_refunded":
      return { label: "Part refunded", cls: "bg-sky-50 text-sky-600" };
    default:
      return { label: "Pending", cls: "bg-gray-100 text-gray-600" };
  }
};

const paymentFilterLabel = (s: string) =>
  s === "cod"
    ? "COD"
    : s === "partially_refunded"
    ? "Partially refunded"
    : s.charAt(0).toUpperCase() + s.slice(1);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatPrice = (n: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;

const Orders = () => {
  const dispatch = useAppDispatch();

  const { orders, loading, error, page, pages, totalOrders, stats, lastQuery } =
    useAppSelector((state) => state.orderData);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const refresh = () =>
    dispatch(getOrders({ page, search, status, payment }));

  // send the new status to the backend, wait for it, toast, then refresh
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!ORDER_STATUSES.includes(newStatus as OrderStatus)) return;
    setUpdatingId(orderId);

    try {
      await dispatch(
        updateOrderStatus({ id: orderId, status: newStatus })
      ).unwrap();

      toast.success(`Order marked as ${statusLabel[newStatus]}`);
      refresh();
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = pages ?? 1;
  const list = (orders || []) as Baseorder[];
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
    { label: "Confirmed", value: stats?.confirmed ?? 0 },
    { label: "Shipped", value: stats?.shipped ?? 0 },
    { label: "Delivered", value: stats?.delivered ?? 0 },
  ];

  const selectBase =
    "h-12 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 text-sm font-semibold text-gray-900 outline-none transition focus:border-[#ff5a1f]";

  const hasFilters = Boolean(search || status || payment);

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
        {/* HEADER */}
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-black">
              Order Management
            </h1>
            <p className="mt-1.5 text-sm text-[#8a7568]">
              View, track and manage all customer orders.
            </p>
          </div>

          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 transition hover:border-[#ff5a1f] hover:text-[#ff5a1f] disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
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
              {FILTER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabel[s]}
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
                  {paymentFilterLabel(s)}
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
                onClick={refresh}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff5a1f]"
              >
                <RefreshCw size={14} />
                Try again
              </button>
            </div>
          )}

          {!loading && !error && list.length === 0 && (
            <div className="py-20 text-center text-sm text-gray-400">
              {hasFilters
                ? "No orders match your search or filters."
                : "No orders found."}
            </div>
          )}

          {!loading && !error && list.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] text-left">
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
                      const orderStatus = order.orderStatus || "confirmed";

                      const user =
                        typeof order.user === "string" ? null : order.user;

                      const cancelledCount = order.items.filter(
                        (i) => i.status === "cancelled"
                      ).length;
                      const returnCount = order.items.filter(
                        (i) =>
                          i.status === "return_requested" ||
                          i.status === "returned"
                      ).length;

                      // read-only when payment/return flows own the status
                      const readOnlyHint = READ_ONLY_STATUS_HINT[orderStatus];
                      const locked =
                        orderStatus === "delivered" ||
                        orderStatus === "cancelled";

                      const methodLabel =
                        order.paymentMethod === "cod"
                          ? "Cash on delivery"
                          : order.paymentMethod
                          ? order.paymentMethod.charAt(0).toUpperCase() +
                            order.paymentMethod.slice(1)
                          : "";

                      return (
                        <tr
                          key={order._id}
                          className="border-b border-gray-100 text-sm text-gray-800 transition-colors last:border-0 hover:bg-[#fffaf7]"
                        >
                          <td className="px-5 py-5">
                            <p className="text-xs font-extrabold text-black">
                              #{order._id.slice(-8).toUpperCase()}
                            </p>
                            {order.isBuyNow && (
                              <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-semibold text-violet-600">
                                <Zap size={10} />
                                Buy now
                              </span>
                            )}
                          </td>

                          <td className="px-3 py-5">
                            <p className="text-xs font-medium">
                              {user?.name || "Customer"}
                            </p>
                            {user?.email && (
                              <p className="mt-0.5 max-w-[170px] truncate text-[11px] text-[#8a7568]">
                                {user.email}
                              </p>
                            )}
                          </td>

                          <td className="px-3 py-5 text-xs text-[#8a7568]">
                            {formatDate(order.orderDate || order.createdAt)}
                          </td>

                          <td className="px-3 py-5 text-xs">
                            <p>{order.items.length}</p>
                            {cancelledCount > 0 && (
                              <p className="mt-0.5 text-[11px] font-medium text-red-500">
                                {cancelledCount} cancelled
                              </p>
                            )}
                            {returnCount > 0 && (
                              <p className="mt-0.5 text-[11px] font-medium text-amber-600">
                                {returnCount} in return
                              </p>
                            )}
                          </td>

                          <td className="px-3 py-5">
                            <p className="text-xs font-extrabold text-black">
                              {formatPrice(order.totalAmount)}
                            </p>
                            {order.refundedAmount > 0 && (
                              <p className="mt-0.5 text-[11px] font-medium text-blue-600">
                                {formatPrice(order.refundedAmount)} refunded
                              </p>
                            )}
                          </td>

                          <td className="px-3 py-5">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${badge.cls}`}
                            >
                              {badge.label}
                            </span>
                            {methodLabel && (
                              <p className="mt-1 text-[11px] text-[#8a7568]">
                                {methodLabel}
                              </p>
                            )}
                          </td>

                          <td className="px-3 py-5">
                            {readOnlyHint ? (
                              <span
                                title={readOnlyHint}
                                className={`inline-flex h-10 w-40 cursor-not-allowed items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 text-xs font-medium ${
                                  statusText[orderStatus] || "text-gray-500"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    statusDot[orderStatus] || "bg-gray-400"
                                  }`}
                                />
                                {statusLabel[orderStatus]}
                                <Lock
                                  size={11}
                                  className="ml-auto text-gray-400"
                                />
                              </span>
                            ) : (
                              <div className="relative w-40">
                                <select
                                  value={orderStatus}
                                  disabled={
                                    locked || updatingId === order._id
                                  }
                                  onChange={(e) =>
                                    handleStatusChange(
                                      order._id,
                                      e.target.value
                                    )
                                  }
                                  className={`h-10 w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-xs font-medium outline-none transition focus:border-[#ff5a1f] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70 ${
                                    statusText[orderStatus] || "text-gray-600"
                                  }`}
                                >
                                  {ORDER_STATUSES.map((s) => (
                                    <option key={s} value={s}>
                                      {statusLabel[s]}
                                    </option>
                                  ))}
                                </select>
                                {updatingId === order._id ? (
                                  <span className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-300 border-t-[#ff5a1f]" />
                                ) : (
                                  <ChevronDown
                                    size={13}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                  />
                                )}
                              </div>
                            )}
                          </td>

                          <td className="px-3 py-5">
                            <Link
                              to={`/admin/orders/${order._id}`}
                              className="inline-flex h-9 items-center rounded-lg border border-orange-100 bg-[#fff5f0] px-3.5 text-xs font-bold text-[#ff5a1f] transition hover:bg-[#ff5a1f] hover:text-white"
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

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getOrders, setPage } from "../../redux/features/orderSlice";
import {
  Package,
  XCircle,
  ArrowUpRight,
  RefreshCw,
  Search,
  Ban,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from "lucide-react";
import ProfileSidebar from "../../components/layouts/Profilesidebar";
import { UserProfile } from "../../redux/features/userSlice";
import type { Baseorder } from "../../utils/baseTypes";

const Cancelled = () => {
  const dispatch = useAppDispatch();

  const { orders, loading, ordererrors, page, pages } =
    useAppSelector((state) => state.orderData);

  const { isStale } = useAppSelector((state) => state.userData);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getOrders({ page, search }));
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, page, search]);

  useEffect(() => {
    if (isStale) {
      dispatch(UserProfile());
    }
  }, [dispatch, isStale]);

  const onSearchChange = (value: string) => {
    setSearch(value);
    dispatch(setPage(1));
  };

  const formatDate = (date?: string | null) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const formatCurrency = (amount?: number | null) =>
    `₹${(amount ?? 0).toLocaleString("en-IN")}`;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const getItemImage = (item: any): string | null => {
    const product =
      item?.product && typeof item.product === "object"
        ? item.product
        : null;

    const images = product?.images;
    const firstImage = Array.isArray(images) ? images[0] : images;

    const image =
      firstImage ??
      product?.image ??
      product?.thumbnail ??
      item?.image;

    if (!image) return null;

    if (typeof image === "string") return image;

    return (
      image?.url ??
      image?.secure_url ??
      image?.imageUrl ??
      image?.src ??
      null
    );
  };

  const getItemName = (item: any): string => {
    const product =
      item?.product && typeof item.product === "object"
        ? item.product
        : null;

    return product?.name || item?.name || "Product";
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const cancelledOrders = useMemo(
    () =>
      (orders || []).filter(
        (order) =>
          order.orderStatus === "cancelled" ||
          order.items.some((item) => item.status === "cancelled")
      ),
    [orders]
  );

  const totalPages = pages ?? 1;

  const pageNumbers = useMemo(() => {
    const nums: number[] = [];

    const first = Math.max(1, Math.min(page - 1, totalPages - 2));
    const last = Math.min(totalPages, first + 2);

    for (let i = first; i <= last; i++) {
      nums.push(i);
    }

    return nums;
  }, [page, totalPages]);

  const getRefundStyle = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700";

      case "pending":
        return "bg-amber-50 text-amber-700";

      case "failed":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-[#111111]">
      <div className="w-full px-3 py-4 sm:px-4 lg:px-5">
        <div className="grid min-h-[calc(100vh-105px)] w-full grid-cols-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <ProfileSidebar />

          <main className="min-w-0 w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex min-h-[calc(100vh-105px)] flex-col p-5 sm:p-7 lg:p-8">

              {/* HEADER */}
              <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Cancelled Orders
                    <span className="text-red-500">.</span>
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Your cancelled orders and items.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5">
                  <Ban size={17} className="text-red-500" />
                  <span className="text-sm font-semibold text-red-600">
                    {cancelledOrders.length} cancellations
                  </span>
                </div>
              </div>

              {/* SEARCH */}
              <div className="relative mt-5">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search by order ID"
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-red-400"
                />
              </div>

              {/* LOADING */}
              {loading && (
                <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-3 py-20">
                  <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-red-100 border-t-red-500" />
                  <p className="text-sm text-gray-400">
                    Loading cancelled orders...
                  </p>
                </div>
              )}

              {/* ERROR */}
              {!loading && ordererrors && (
                <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-xl border border-red-100 px-6 py-16 text-center">
                  <XCircle size={30} className="text-red-500" />

                  <h2 className="mt-4 font-semibold text-gray-900">
                    Couldn't load your orders
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {ordererrors}
                  </p>

                  <button
                    onClick={() =>
                      dispatch(getOrders({ page, search }))
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600"
                  >
                    <RefreshCw size={14} />
                    Try again
                  </button>
                </div>
              )}

              {/* EMPTY STATE */}
              {!loading && !ordererrors && cancelledOrders.length === 0 && (
                <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-6 py-20 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                    <Ban size={28} className="text-red-500" />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-gray-900">
                    {search ? "No cancelled orders found" : "No cancellations"}
                  </h2>

                  <p className="mt-2 text-sm text-gray-400">
                    {search
                      ? "Try searching with another order ID."
                      : "You haven't cancelled any orders."}
                  </p>

                  <Link
                    to="/users/orders"
                    className="mt-5 text-sm font-semibold text-gray-900 hover:text-red-600"
                  >
                    View all orders →
                  </Link>
                </div>
              )}

              {/* CANCELLED ORDERS */}
              {!loading && !ordererrors && cancelledOrders.length > 0 && (
                <>
                  <div className="mt-6 space-y-4">
                    {cancelledOrders.map((order) => {
                      const cancelledItems = order.items.filter(
                        (item) => item.status === "cancelled"
                      );

                      const isFullyCancelled =
                        order.orderStatus === "cancelled";

                      const itemsToDisplay =
                        cancelledItems.length > 0
                          ? cancelledItems
                          : isFullyCancelled
                            ? order.items
                            : [];

                      // Calculate refund based on cancellation type.
                      // Full order cancellation uses order.cancelRefund.
                      // Individual item cancellation uses item.refund.
                      const itemRefundAmount = cancelledItems.reduce(
                        (total, item) =>
                          total + (item.refund?.amount ?? 0),
                        0
                      );

                      const refundAmount = isFullyCancelled
                        ? order.cancelRefund?.amount ?? 0
                        : itemRefundAmount;

                      // Derive the refund status for individually cancelled items.
                      const itemRefundStatuses = cancelledItems
                        .map((item) => item.refund?.status)
                        .filter(Boolean);

                      const refundStatus = isFullyCancelled
                        ? order.cancelRefund?.status
                        : itemRefundStatuses.length === 0
                          ? undefined
                          : itemRefundStatuses.every(
                              (status) => status === "completed"
                            )
                            ? "completed"
                            : itemRefundStatuses.some(
                                (status) => status === "pending"
                              )
                              ? "pending"
                              : itemRefundStatuses.some(
                                  (status) => status === "failed"
                                )
                                ? "failed"
                                : undefined;

                      return (
                        <Link
                          key={order._id}
                          to={`/users/orders/${order._id}`}
                          className="group block rounded-xl border border-gray-200 bg-white p-4 transition hover:border-red-200 hover:shadow-sm sm:p-5"
                        >
                          {/* ORDER HEADER */}
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-xs text-gray-400">
                                Order ID
                              </p>
                              <h3 className="mt-1 text-sm font-bold text-gray-900">
                                #{order._id.slice(-8).toUpperCase()}
                              </h3>
                              <p className="mt-1 text-xs text-gray-400">
                                Ordered on {formatDate(order.orderDate)}
                              </p>
                            </div>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
                              <XCircle size={13} />
                              {isFullyCancelled
                                ? "Order cancelled"
                                : "Item cancelled"}
                            </span>
                          </div>

                          {/* CANCELLED PRODUCTS */}
                          <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Cancelled items ({itemsToDisplay.length})
                            </p>

                            {itemsToDisplay.map((item) => {
                              const image = getItemImage(item);
                              const name = getItemName(item);

                              const itemRefundAmount =
                                item.refund?.amount ?? 0;

                              return (
                                <div
                                  key={item._id}
                                  className="flex items-center gap-3"
                                >
                                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                                    {image ? (
                                      <img
                                        src={image}
                                        alt={name}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                          e.currentTarget.style.display = "none";
                                        }}
                                      />
                                    ) : (
                                      <Package
                                        size={22}
                                        className="text-gray-300"
                                      />
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-gray-900">
                                      {name}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                      Quantity: {item.quantity}
                                    </p>

                                    {item.cancelReason && (
                                      <p className="mt-1 text-xs text-gray-400">
                                        Reason: {item.cancelReason}
                                      </p>
                                    )}
                                  </div>

                                  {itemRefundAmount > 0 && (
                                    <div className="shrink-0 text-right">
                                      <p className="text-[10px] text-gray-400">
                                        Item refund
                                      </p>
                                      <p className="mt-1 text-sm font-semibold text-emerald-600">
                                        {formatCurrency(itemRefundAmount)}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* REFUND SUMMARY */}
                          {(refundAmount > 0 || refundStatus) && (
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-emerald-50/70 px-3 py-3">
                              <div className="flex items-center gap-2">
                                <Wallet
                                  size={16}
                                  className="text-emerald-600"
                                />

                                <div>
                                  <p className="text-xs font-medium text-gray-600">
                                    Refund
                                  </p>
                                  <p className="text-sm font-bold text-emerald-700">
                                    {formatCurrency(refundAmount)}
                                  </p>
                                </div>
                              </div>

                              {refundStatus && (
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${getRefundStyle(
                                    refundStatus
                                  )}`}
                                >
                                  {refundStatus}
                                </span>
                              )}
                            </div>
                          )}

                          {/* FOOTER */}
                          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                            <p className="text-xs text-gray-400">
                              {formatDate(order.trackingDates.cancelled) !== "—"
                                ? `Cancelled on ${formatDate(
                                    order.trackingDates.cancelled
                                  )}`
                                : "Cancellation details"}
                            </p>

                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 transition group-hover:text-red-600">
                              View order
                              <ArrowUpRight size={14} />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* PAGINATION */}
                  <div className="mt-auto flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row">
                    <p className="text-xs text-gray-500">
                      Page {page} of {totalPages}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(setPage(page - 1))}
                        disabled={page === 1 || loading}
                        className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:border-red-500 disabled:cursor-not-allowed disabled:opacity-40"
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
                              ? "bg-red-500 text-white"
                              : "border border-gray-200 text-gray-700 hover:border-red-500"
                          }`}
                        >
                          {n}
                        </button>
                      ))}

                      <button
                        onClick={() => dispatch(setPage(page + 1))}
                        disabled={
                          pages === null || page === pages || loading
                        }
                        className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:border-red-500 disabled:cursor-not-allowed disabled:opacity-40"
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
      </div>
    </div>
  );
};

export default Cancelled;

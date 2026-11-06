import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getOrders, setPage } from "../../redux/features/orderSlice";
import {
  Package,
  CalendarDays,
  ShoppingBag,
  CreditCard,
  XCircle,
  ArrowUpRight,
  RefreshCw,
  Search,
  Ban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ProfileSidebar from "../../components/layouts/Profilesidebar";
import { UserProfile } from "../../redux/features/userSlice";

const MAX_NAMES = 2;

const Cancelled = () => {
  const dispatch = useAppDispatch();

  const { orders, loading, ordererrors, page, pages } = useAppSelector(
    (state) => state.orderData
  );

    const {  isStale } = useAppSelector(
    (state) => state.userData
  );

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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const getItemImage = (item: any): string | null => {
    const product = item?.product;
    const img = product?.images?.[0] ?? product?.image ?? item?.image;
    if (!img) return null;
    return typeof img === "string" ? img : img.url ?? null;
  };

  const getItemName = (item: any): string =>
    item?.product?.name || item?.name || "Product";
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const cancelledOrders = useMemo(
    () => (orders || []).filter((o) => o.orderStatus === "cancelled"),
    [orders]
  );

  const totalPages = pages ?? 1;

  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    const first = Math.max(1, Math.min(page - 1, totalPages - 2));
    const last = Math.min(totalPages, first + 2);
    for (let i = first; i <= last; i++) nums.push(i);
    return nums;
  }, [page, totalPages]);

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-[#111111]">
      <div className="w-full px-3 py-4 sm:px-4 lg:px-5">
        <div className="grid min-h-[calc(100vh-105px)] w-full grid-cols-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* SIDEBAR */}
          <ProfileSidebar />

          {/* MAIN CONTENT */}
          <main className="min-w-0 w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex h-full min-h-[calc(100vh-105px)] flex-col p-6 sm:p-7 lg:p-9">
              {/* PAGE HEADER */}
              <div className="flex flex-col justify-between gap-5 border-b border-gray-100 pb-6 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      Your account / Cancellations
                    </p>
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Cancelled Orders<span className="text-red-500">.</span>
                  </h1>

                  <p className="mt-1 text-sm text-gray-400">
                    Orders you've cancelled, and their refund status.
                  </p>
                </div>

                <div className="flex w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-red-50 px-5 py-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <Ban size={19} />
                  </div>

                  <div>
                    <p className="text-xl font-bold leading-none text-gray-900">
                      {cancelledOrders.length.toLocaleString("en-IN")}
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-gray-400">
                      Cancelled on this page
                    </p>
                  </div>
                </div>
              </div>

              {/* SEARCH */}
              <div className="relative mt-6">
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
                <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white py-24">
                  <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-red-100 border-t-red-500" />
                  <p className="text-sm text-gray-400">
                    Loading cancelled orders...
                  </p>
                </div>
              )}

              {/* ERROR */}
              {!loading && ordererrors && (
                <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <XCircle size={25} />
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-gray-900">
                    Couldn't load your orders
                  </h2>

                  <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                    {ordererrors}
                  </p>

                  <button
                    onClick={() => dispatch(getOrders({ page, search }))}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                  >
                    <RefreshCw size={15} />
                    Try again
                  </button>
                </div>
              )}

              {/* EMPTY STATE */}
              {!loading && !ordererrors && cancelledOrders.length === 0 && (
                <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-24 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50">
                    <Ban size={34} className="text-red-500" />
                  </div>

                  <h2 className="mt-6 text-xl font-bold text-gray-900">
                    {search ? "No cancelled orders found" : "No cancellations"}
                  </h2>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
                    {search
                      ? "Try a different order ID."
                      : "You haven't cancelled any orders. Great!"}
                  </p>

                  <Link
                    to="/users/orders"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                  >
                    View all orders
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              )}

              {/* CANCELLED LIST */}
              {!loading && !ordererrors && cancelledOrders.length > 0 && (
                <>
                  <div className="mt-6 space-y-4">
                    {cancelledOrders.map((order) => (
                      <Link
                        key={order._id}
                        to={`/users/orders/${order._id}`}
                        className="group block w-full overflow-hidden rounded-2xl border border-red-300 bg-red-50/40 text-left transition-all duration-300 hover:border-red-400 hover:shadow-[0_12px_35px_rgba(220,38,38,0.10)]"
                      >
                        <div className="p-5 sm:p-6">
                          {/* ORDER HEADER */}
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                                <Package size={22} />
                              </div>

                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                                  Order reference
                                </p>
                                <h3 className="mt-1 text-sm font-bold tracking-wide text-red-800">
                                  #{order._id.slice(-8).toUpperCase()}
                                </h3>
                              </div>
                            </div>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm">
                              <XCircle size={14} />
                              Order Cancelled
                            </span>
                          </div>

                          {/* PRODUCT PREVIEW */}
                          <div className="mt-5 flex items-center gap-4">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-red-100 bg-red-50">
                              {getItemImage(order.items[0]) ? (
                                <img
                                  src={getItemImage(order.items[0]) as string}
                                  alt={getItemName(order.items[0])}
                                  className="h-full w-full object-cover grayscale-[40%]"
                                  loading="lazy"
                                />
                              ) : (
                                <Package size={24} className="text-gray-300" />
                              )}
                            </div>

                            <div className="min-w-0">
                              {order.items.slice(0, MAX_NAMES).map((item, i) => (
                                <p
                                  key={i}
                                  className="truncate text-sm font-semibold text-gray-900"
                                >
                                  {getItemName(item)}
                                </p>
                              ))}

                              {order.items.length > MAX_NAMES && (
                                <p className="mt-0.5 text-xs font-medium text-gray-400">
                                  +{order.items.length - MAX_NAMES} more
                                </p>
                              )}
                            </div>
                          </div>

                          {/* ORDER INFORMATION */}
                          <div className="my-5 grid grid-cols-2 gap-5 border-y border-red-100 py-5 sm:grid-cols-4">
                            <div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <CalendarDays size={14} />
                                <span className="text-[10px] font-semibold uppercase tracking-wider">
                                  Ordered on
                                </span>
                              </div>
                              <p className="mt-2 text-sm font-semibold text-gray-800">
                                {formatDate(order.orderDate || order.createdAt)}
                              </p>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <Ban size={14} />
                                <span className="text-[10px] font-semibold uppercase tracking-wider">
                                  Cancelled on
                                </span>
                              </div>
                              <p className="mt-2 text-sm font-semibold text-red-700">
                                {formatDate(order.trackingDates?.cancelled)}
                              </p>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <ShoppingBag size={14} />
                                <span className="text-[10px] font-semibold uppercase tracking-wider">
                                  Items
                                </span>
                              </div>
                              <p className="mt-2 text-sm font-semibold text-gray-800">
                                {order.items.length}{" "}
                                {order.items.length === 1 ? "Item" : "Items"}
                              </p>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <CreditCard size={14} />
                                <span className="text-[10px] font-semibold uppercase tracking-wider">
                                  Refund
                                </span>
                              </div>
                              <p className="mt-2 text-sm font-semibold capitalize text-gray-800">
                                {order.paymentStatus === "refunded"
                                  ? "Refunded"
                                  : order.paymentStatus === "paid"
                                  ? "Processing"
                                  : "Not applicable"}
                              </p>
                            </div>
                          </div>

                          {/* FOOTER */}
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                                Order total
                              </p>
                              <p className="mt-1 text-xl font-bold tracking-tight text-red-700 line-through decoration-red-300">
                                ₹{order.totalAmount.toLocaleString("en-IN")}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-red-100 px-4 py-3 text-xs font-semibold text-red-700 transition-all group-hover:bg-red-600 group-hover:text-white">
                              View details
                              <ArrowUpRight
                                size={15}
                                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="h-1 w-full bg-red-500" />
                      </Link>
                    ))}
                  </div>

                  {/* PAGINATION */}
                  <div className="mt-auto flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row">
                    <p className="text-[11px] text-[#8a7568]">
                      Page {page} of {totalPages}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(setPage(page - 1))}
                        disabled={page === 1 || loading}
                        className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition hover:border-red-500 disabled:cursor-not-allowed disabled:opacity-40"
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
                              : "border border-gray-200 bg-white text-gray-700 hover:border-red-500"
                          }`}
                        >
                          {n}
                        </button>
                      ))}

                      <button
                        onClick={() => dispatch(setPage(page + 1))}
                        disabled={pages === null || page === pages || loading}
                        className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition hover:border-red-500 disabled:cursor-not-allowed disabled:opacity-40"
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
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getOrders, setPage } from "../../redux/features/orderSlice";
import {
  Package,
  CalendarDays,
  ShoppingBag,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PAGE_LIMIT = 5; // keep in sync with the limit used in the slice / backend

const Orders = () => {
  const dispatch = useAppDispatch();

  const { orders, loading, ordererrors, page, pages, totalOrders } =
    useAppSelector((state) => state.orderData);

  const [search, setSearch] = useState("");

  // Fetch from the backend whenever page / search changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getOrders({ page, search }));
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, page, search]);

  // Any change to search goes back to page 1
  const onSearchChange = (value: string) => {
    setSearch(value);
    dispatch(setPage(1));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Adjust these two helpers to match your product schema.
  // Handles: product.images[0] (string or { url }), product.image, item.image
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

  const MAX_NAMES = 2; // product names shown before "+N more"

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "paid":
        return {
          label: "Paid",
          className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
          icon: <CheckCircle2 size={14} />,
        };

      case "pending":
        return {
          label: "Pending",
          className: "bg-amber-50 text-amber-700 ring-amber-100",
          icon: <Clock size={14} />,
        };

      case "failed":
        return {
          label: "Failed",
          className: "bg-red-50 text-red-700 ring-red-100",
          icon: <XCircle size={14} />,
        };

      case "refunded":
        return {
          label: "Refunded",
          className: "bg-blue-50 text-blue-700 ring-blue-100",
          icon: <RefreshCw size={14} />,
        };

      default:
        return {
          label: status,
          className: "bg-gray-50 text-gray-600 ring-gray-200",
          icon: <Package size={14} />,
        };
    }
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

  return (
    <div className="min-h-screen w-full bg-[#f8f8f8] px-4 py-8 sm:px-8 lg:px-12 xl:px-16">
      <div className="w-full max-w-none">
        {/* PAGE HEADER */}
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a1f]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Your account / Orders
              </p>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              My Orders<span className="text-[#ff5a1f]">.</span>
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Everything you've ordered, all in one place.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1eb] text-[#ff5a1f]">
              <ShoppingBag size={19} />
            </div>

            <div>
              <p className="text-xl font-bold leading-none text-gray-900">
                {totalOrders.toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-[11px] font-medium text-gray-400">
                Total orders
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search order ID..."
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#ff5a1f]"
            />
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-gray-100 bg-white py-24 shadow-sm">
            <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-orange-100 border-t-[#ff5a1f]" />
            <p className="text-sm text-gray-400">Loading orders...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && ordererrors && (
          <div className="rounded-3xl border border-red-100 bg-white px-6 py-16 text-center shadow-sm">
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
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff5a1f]"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !ordererrors && list.length === 0 && (
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-24 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#fff1eb]">
              <ShoppingBag size={34} className="text-[#ff5a1f]" />
            </div>

            <h2 className="mt-6 text-xl font-bold text-gray-900">
              {search ? "No orders found" : "No orders just yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
              {search
                ? "Try a different order ID."
                : "Looks like you haven't made your first purchase. Your order history will appear here once you do."}
            </p>
          </div>
        )}

        {/* ORDERS LIST */}
        {!loading && !ordererrors && list.length > 0 && (
          <>
            <div className="space-y-5">
              {list.map((order) => {
                const status = getStatusStyle(order.paymentStatus);

                return (
                  <Link
                    key={order._id}
                    to={`/users/orders/${order._id}`}
                    className="group block w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ffb18f] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]"
                  >
                    <div className="p-5 sm:p-7 lg:p-8">
                      {/* ORDER HEADER */}
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff5f0] text-[#ff5a1f] transition-colors group-hover:bg-[#ff5a1f] group-hover:text-white">
                            <Package size={22} />
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                              Order reference
                            </p>

                            <h3 className="mt-1 text-sm font-bold tracking-wide text-gray-900">
                              #{order._id.slice(-8).toUpperCase()}
                            </h3>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ring-inset ${status.className}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                      </div>

                      {/* PRODUCT PREVIEW: one image + product names */}
                      <div className="mt-6 flex items-center gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                          {getItemImage(order.items[0]) ? (
                            <img
                              src={getItemImage(order.items[0]) as string}
                              alt={getItemName(order.items[0])}
                              className="h-full w-full object-cover"
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
                      <div className="my-6 grid grid-cols-2 gap-5 border-y border-gray-100 py-5 sm:grid-cols-3">
                        {/* DATE */}
                        <div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <CalendarDays size={14} />
                            <span className="text-[10px] font-semibold uppercase tracking-wider">
                              Order date
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-semibold text-gray-800">
                            {formatDate(order.orderDate || order.createdAt)}
                          </p>
                        </div>

                        {/* ITEMS */}
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

                        {/* PAYMENT */}
                        <div className="col-span-2 sm:col-span-1">
                          <div className="flex items-center gap-2 text-gray-400">
                            <CreditCard size={14} />
                            <span className="text-[10px] font-semibold uppercase tracking-wider">
                              Payment
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-semibold capitalize text-gray-800">
                            {order.paymentMethod || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* FOOTER */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                            Total amount
                          </p>

                          <p className="mt-1 text-xl font-bold tracking-tight text-gray-900">
                            ₹{order.totalAmount.toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600 transition-all group-hover:bg-[#fff1eb] group-hover:text-[#ff5a1f]">
                          View details
                          <ArrowUpRight
                            size={15}
                            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM ACCENT */}
                    <div className="h-[3px] w-0 bg-[#ff5a1f] transition-all duration-300 group-hover:w-full" />
                  </Link>
                );
              })}
            </div>

            {/* PAGINATION */}
            <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-[11px] text-[#8a7568]">
                Showing {from}–{to} of {totalOrders.toLocaleString("en-IN")}{" "}
                orders
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(setPage(page - 1))}
                  disabled={page === 1 || loading}
                  className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition hover:border-[#ff5a1f] disabled:cursor-not-allowed disabled:opacity-40"
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
                        : "border border-gray-200 bg-white text-gray-700 hover:border-[#ff5a1f]"
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() => dispatch(setPage(page + 1))}
                  disabled={pages === null || page === pages || loading}
                  className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition hover:border-[#ff5a1f] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
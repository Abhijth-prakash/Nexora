import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getOrders } from "../../redux/features/orderSlice";
import {
  Package,
  CalendarDays,
  ShoppingBag,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  PackageCheck,
  RefreshCw,
} from "lucide-react";

const Orders = () => {
  const dispatch = useAppDispatch();

  const { orders, loading, ordererrors } = useAppSelector(
    (state) => state.orderData
  );

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
                {orders?.length || 0}
              </p>

              <p className="mt-1 text-[11px] font-medium text-gray-400">
                Total orders
              </p>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-24 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1eb]">
              <Package
                size={25}
                className="animate-pulse text-[#ff5a1f]"
              />
            </div>

            <p className="mt-5 text-sm font-semibold text-gray-800">
              Getting your orders ready
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Please wait a moment...
            </p>
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
              onClick={() => dispatch(getOrders())}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff5a1f]"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !ordererrors && (!orders || orders.length === 0) && (
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-24 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#fff1eb]">
              <ShoppingBag size={34} className="text-[#ff5a1f]" />
            </div>

            <h2 className="mt-6 text-xl font-bold text-gray-900">
              No orders just yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
              Looks like you haven't made your first purchase. Your order
              history will appear here once you do.
            </p>

            <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#ff5a1f]">
              <PackageCheck size={16} />
              Your next great find is waiting.
            </p>
          </div>
        )}

        {/* ORDERS LIST */}
        {!loading && !ordererrors && orders && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => {
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
        )}

        {/* FOOTER NOTE */}
        {!loading && !ordererrors && orders && orders.length > 0 && (
          <p className="mt-7 text-center text-[11px] text-gray-400">
            Showing your complete order history.
          </p>
        )}
      </div>
    </div>
  );
};

export default Orders;
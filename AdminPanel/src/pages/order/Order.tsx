import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getOrders } from "../../redux/features/orderSlice";
import AdminSidebar from "../../components/Adminsidebar";
import type { Baseorder } from "../../utils/BaseType";
import {
  Package,
  CalendarDays,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  User,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Hash,
} from "lucide-react";

type AdminOrder = Baseorder & {
  cancelReason?: string | null;
  cancelledBy?: "user" | "admin" | "system" | null;
};

type OrderItem = Baseorder["items"][number];

const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTrackDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "2-digit",
  });

// the 4 main tracking stages, in order
const TRACK_STEPS = [
  {
    key: "confirmed",
    status: "confirmed",
    label: "Order Confirmed",
    note: "Your order has been placed.",
  },
  {
    key: "shipped",
    status: "shipped",
    label: "Shipped",
    note: "Your item has been shipped.",
  },
  {
    key: "outForDelivery",
    status: "out_for_delivery",
    label: "Out For Delivery",
    note: "Your item is out for delivery.",
  },
  {
    key: "delivered",
    status: "delivered",
    label: "Delivered",
    note: "Your item has been delivered.",
  },
] as const;

const RETURN_TRACK_STEPS = [
  { key: "requested", label: "Return requested", note: "The customer submitted a return request." },
  { key: "approved", label: "Return approved", note: "The return request was approved." },
  { key: "pickup_scheduled", label: "Pickup scheduled", note: "Pickup is being arranged for the returned item." },
  { key: "picked_up", label: "Picked up", note: "The returned item has been collected." },
  { key: "received", label: "Return received", note: "The returned item has been received and checked." },
  { key: "refunded", label: "Refund completed", note: "The refund has been credited to the customer's wallet." },
] as const;

const getStatusStyle = (status: string) => {
  switch (status) {
    case "cod":
      return {
        label: "COD",
        className: "bg-amber-50 text-amber-700 ring-amber-100",
        icon: <CreditCard size={14} />,
      };
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

// product / variant can be an id string or a populated object
const getItemDetails = (item: OrderItem) => {
  const product = typeof item.product === "string" ? null : item.product;
  const variant =
    item.variantId && typeof item.variantId !== "string" ? item.variantId : null;

  const image = variant?.images?.[0] || product?.images?.[0] || "";

  return {
    name: product?.name || "Product",
    brand: product?.brand || "",
    image,
    color: variant?.color || product?.color || "",
    size: variant?.size?.length ? variant.size.join(", ") : "",
  };
};

const Order = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const { orders, loading, error } = useAppSelector(
    (state) => state.orderData
  );

  // fetch only if the list isn't in the store yet (e.g. page refreshed)
  useEffect(() => {
    if (!orders || orders.length === 0) {
      
      dispatch(getOrders({page:1,search:"",status:"",payment:""}));
    }
  }, [dispatch]);

  const order = orders?.find((o) => o._id === id) as AdminOrder | undefined;

  const renderBody = () => {
    if (loading && !order) {
      return (
        <div className="rounded-3xl border border-gray-100 bg-white px-6 py-24 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1eb]">
            <Package size={25} className="animate-pulse text-[#ff5a1f]" />
          </div>
          <p className="mt-5 text-sm font-semibold text-gray-800">
            Loading order
          </p>
          <p className="mt-1 text-xs text-gray-400">Please wait a moment...</p>
        </div>
      );
    }

    if (error && !order) {
      return (
        <div className="rounded-3xl border border-red-100 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <XCircle size={25} />
          </div>
          <h2 className="mt-5 text-lg font-bold text-gray-900">
            Couldn't load this order
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">{error}</p>
          <button
            onClick={() => dispatch(getOrders({page:1,search:"",status:"",payment:""}))}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff5a1f]"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      );
    }

    if (!order) {
      return (
        <div className="rounded-3xl border border-gray-100 bg-white px-6 py-24 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#fff1eb]">
            <Package size={34} className="text-[#ff5a1f]" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-gray-900">
            Order not found
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
            This order doesn't exist or may have been removed.
          </p>
          <Link
            to="/admin/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff5a1f]"
          >
            <ArrowLeft size={15} />
            Back to orders
          </Link>
        </div>
      );
    }

    const status = getStatusStyle(order.paymentStatus);
    const user = typeof order.user === "string" ? null : order.user;
    const address = typeof order.address === "string" ? null : order.address;
    const coupon =
      order.coupon && typeof order.coupon !== "string" ? order.coupon : null;
    const couponCode =
      coupon?.code ||
      (typeof order.coupon === "string" ? order.coupon : "");
    const totalQuantity = order.items.reduce((sum, i) => sum + i.quantity, 0);
    const returnRequest =
      order.return && typeof order.return !== "string" ? order.return : null;

    // ---- tracking ----
    const isCancelled = order.orderStatus === "cancelled";

    // date for each stage (confirmed falls back to the order date)
    const trackDates: Record<(typeof TRACK_STEPS)[number]["key"], string | null> = {
      confirmed:
        order.trackingDates?.confirmed || order.orderDate || order.createdAt,
      shipped: order.trackingDates?.shipped ?? null,
      outForDelivery: order.trackingDates?.outForDelivery ?? null,
      delivered: order.trackingDates?.delivered ?? null,
    };

    // index of the last stage the order has reached
    let reachedIndex = TRACK_STEPS.findIndex((s) => s.status === order.orderStatus);
    if (isCancelled) {
      // cancelled: stop at the last stage that has a date
      reachedIndex = TRACK_STEPS.reduce(
        (last, s, i) => (trackDates[s.key] ? i : last),
        0
      );
    }
    if (reachedIndex < 0) reachedIndex = 0;

    return (
      <>
        {/* ORDER HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Link
              to="/admin/orders"
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 transition hover:text-[#ff5a1f]"
            >
              <ArrowLeft size={14} />
              All orders
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                #{order._id.slice(-8).toUpperCase()}
                <span className="text-[#ff5a1f]">.</span>
              </h1>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ring-inset ${status.className}`}
              >
                {status.icon}
                {status.label}
              </span>
            </div>

            <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays size={15} className="text-gray-400" />
              Placed on {formatDate(order.orderDate || order.createdAt)}
            </p>
          </div>

          <div className="w-fit rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
              Order total
            </p>
            <p className="mt-1 text-2xl font-bold leading-none tracking-tight text-gray-900">
              {formatPrice(order.totalAmount)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
          {/* LEFT: ITEMS + TRACKING */}
          <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
              <h2 className="text-sm font-bold text-gray-900">Items</h2>
              <p className="text-xs text-gray-400">
                {totalQuantity} {totalQuantity === 1 ? "unit" : "units"} ·{" "}
                {order.items.length}{" "}
                {order.items.length === 1 ? "product" : "products"}
              </p>
            </div>

            <ul className="divide-y divide-gray-100">
              {order.items.map((item, index) => {
                const details = getItemDetails(item);

                return (
                  <li
                    key={index}
                    className="flex gap-4 px-5 py-5 sm:gap-5 sm:px-7"
                  >
                    {/* IMAGE */}
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:h-28 sm:w-28">
                      {details.image ? (
                        <img
                          src={details.image}
                          alt={details.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                          <Package size={28} />
                        </div>
                      )}
                    </div>

                    {/* INFO */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div className="min-w-0">
                        {details.brand && (
                          <p className="text-[11px] font-semibold text-[#ff5a1f]">
                            {details.brand}
                          </p>
                        )}

                        <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-gray-900 sm:text-base">
                          {details.name}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {details.color && (
                            <span className="rounded-md bg-gray-50 px-2 py-1 text-[11px] font-medium capitalize text-gray-600 ring-1 ring-inset ring-gray-200">
                              {details.color}
                            </span>
                          )}
                          {details.size && (
                            <span className="rounded-md bg-gray-50 px-2 py-1 text-[11px] font-medium uppercase text-gray-600 ring-1 ring-inset ring-gray-200">
                              Size {details.size}
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-xs text-gray-400">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>

                      <p className="text-base font-bold text-gray-900 sm:text-right">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

            {/* ORDER TRACKING */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900">
                  Order tracking
                </h2>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    isCancelled
                      ? "bg-red-50 text-red-600"
                      : order.orderStatus === "delivered"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-[#fff1eb] text-[#ff5a1f]"
                  }`}
                >
                  {isCancelled
                    ? "Cancelled"
                    : TRACK_STEPS[reachedIndex].label}
                </span>
              </div>

              <ol className="mt-6">
                {TRACK_STEPS.map((step, i) => {
                  const done = i <= reachedIndex;
                  const date = trackDates[step.key];
                  const isLast = i === TRACK_STEPS.length - 1 && !isCancelled;
                  const lineDone = i < reachedIndex;

                  return (
                    <li key={step.key} className="relative flex gap-4 pb-7 last:pb-0">
                      {/* connector line */}
                      {!isLast && (
                        <span
                          className={`absolute left-[7px] top-4 h-full w-0.5 ${
                            lineDone ? "bg-emerald-500" : "bg-gray-200"
                          }`}
                        />
                      )}

                      {/* dot */}
                      <span
                        className={`relative z-10 mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                          done
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-gray-300 bg-white"
                        }`}
                      />

                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold ${
                            done ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                          {done && date && (
                            <span className="ml-2 text-xs font-normal text-gray-400">
                              {formatTrackDate(date)}
                            </span>
                          )}
                        </p>

                        <p
                          className={`mt-1 text-xs ${
                            done ? "text-gray-500" : "text-gray-300"
                          }`}
                        >
                          {done ? step.note : "Waiting"}
                        </p>
                      </div>
                    </li>
                  );
                })}

                {/* cancelled */}
                {isCancelled && (
                  <li className="relative flex gap-4">
                    <span className="relative z-10 mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-red-500 bg-red-500" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-red-600">
                          Order cancelled
                        </p>
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 ring-1 ring-inset ring-red-100">
                          Cancelled
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        {order.updatedAt
                          ? `Cancelled on ${formatTrackDate(order.updatedAt)}`
                          : "This order was cancelled."}
                      </p>

                      {order.cancelledBy && (
                        <p className="mt-1.5 text-xs text-gray-500">
                          Cancelled by{" "}
                          <span className="font-semibold capitalize text-gray-700">
                            {order.cancelledBy}
                          </span>
                        </p>
                      )}

                      <div className="mt-4 overflow-hidden rounded-xl border border-red-200 bg-red-50/70">
                        <div className="flex items-center gap-2 border-b border-red-100 px-4 py-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-red-500 shadow-sm ring-1 ring-red-100">
                            <XCircle size={15} />
                          </span>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-red-500">
                              Cancellation details
                            </p>
                            <p className="text-xs font-semibold text-red-800">
                              Reason for cancellation
                            </p>
                          </div>
                        </div>
                        <div className="px-4 py-3.5">
                          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                            {order.cancelReason?.trim() ||
                              "No cancellation reason was provided."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                )}
              </ol>
            </section>

            {/* RETURN TRACKING */}
            {order.return && (
              <section className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#ff5a1f]">
                      <RefreshCw size={18} />
                    </span>
                    <div>
                      <h2 className="text-sm font-bold text-gray-900">Return tracking</h2>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Track the return request and refund progress
                      </p>
                    </div>
                  </div>

                  {returnRequest && (
                    <span className={`rounded-full px-3 py-1.5 text-[11px] font-bold capitalize ${
                      returnRequest.status === "refunded"
                        ? "bg-emerald-50 text-emerald-700"
                        : returnRequest.status === "rejected" || returnRequest.status === "cancelled"
                        ? "bg-red-50 text-red-600"
                        : "bg-orange-50 text-orange-700"
                    }`}>
                      {returnRequest.status.replaceAll("_", " ")}
                    </span>
                  )}
                </div>

                {returnRequest ? (
                  <div className="p-5 sm:p-6">
                    <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Return reason
                        </p>
                        <p className="mt-1.5 text-sm font-semibold capitalize text-gray-800">
                          {returnRequest.reason.replaceAll("_", " ")}
                        </p>
                      </div>
                      <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Refund amount
                        </p>
                        <p className="mt-1.5 text-sm font-bold text-gray-900">
                          {formatPrice(returnRequest.refund.amount)}
                          <span className="ml-2 text-xs font-medium text-gray-500">· Wallet</span>
                        </p>
                      </div>
                    </div>

                    {returnRequest.description && (
                      <p className="mb-5 rounded-xl bg-gray-50 px-4 py-3 text-xs leading-5 text-gray-600">
                        {returnRequest.description}
                      </p>
                    )}

                    <ol className="ml-1">
                      {RETURN_TRACK_STEPS.map((step, index) => {
                        const dateKey =
                          step.key === "pickup_scheduled"
                            ? null
                            : step.key === "picked_up"
                            ? "pickedUp"
                            : step.key;
                        const date = dateKey
                          ? returnRequest.trackingDates?.[dateKey as keyof typeof returnRequest.trackingDates]
                          : null;
                        const currentIndex = RETURN_TRACK_STEPS.findIndex(
                          (item) => item.key === returnRequest.status
                        );
                        const done = index <= currentIndex || Boolean(date);

                        return (
                          <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
                            {index !== RETURN_TRACK_STEPS.length - 1 && (
                              <span className={`absolute left-[7px] top-4 h-full w-0.5 ${
                                done && index < currentIndex ? "bg-emerald-400" : "bg-gray-200"
                              }`} />
                            )}
                            <span className={`relative z-10 mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                              done ? "border-emerald-500 bg-emerald-500" : "border-gray-300 bg-white"
                            }`} />
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className={`text-sm font-semibold ${done ? "text-gray-900" : "text-gray-400"}`}>
                                  {step.label}
                                </p>
                                {date && (
                                  <span className="text-[11px] text-gray-400">
                                    {formatTrackDate(date)}
                                  </span>
                                )}
                              </div>
                              <p className={`mt-1 text-xs ${done ? "text-gray-500" : "text-gray-300"}`}>
                                {done ? step.note : "Waiting"}
                              </p>
                            </div>
                          </li>
                        );
                      })}

                      {(returnRequest.status === "rejected" || returnRequest.status === "cancelled") && (
                        <li className="flex gap-4">
                          <span className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                            returnRequest.status === "rejected"
                              ? "border-red-500 bg-red-500"
                              : "border-gray-400 bg-gray-400"
                          }`} />
                          <div>
                            <p className={`text-sm font-semibold ${
                              returnRequest.status === "rejected" ? "text-red-600" : "text-gray-700"
                            }`}>
                              Return {returnRequest.status}
                              {(() => {
                                const terminalDate =
                                  returnRequest.trackingDates?.[returnRequest.status];

                                return terminalDate ? (
                                  <span className="ml-2 text-xs font-normal text-gray-400">
                                    {formatTrackDate(terminalDate)}
                                  </span>
                                ) : null;
                              })()}
                            </p>
                            {returnRequest.rejectionReason && (
                              <p className="mt-1 text-xs leading-5 text-gray-500">
                                {returnRequest.rejectionReason}
                              </p>
                            )}
                          </div>
                        </li>
                      )}
                    </ol>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                      <span className="text-xs font-medium text-gray-500">Refund status</span>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
                        returnRequest.refund.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : returnRequest.refund.status === "failed"
                          ? "bg-red-100 text-red-600"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {returnRequest.refund.status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-5 sm:px-6">
                    <p className="text-sm font-medium text-gray-700">
                      Return request exists, but its tracking details aren't available.
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Populate the order's return reference with the Return document to display its timeline.
                    </p>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* RIGHT: SUMMARY + DETAILS */}
          <div className="space-y-6">
            {/* PAYMENT SUMMARY */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-sm font-bold text-gray-900">Payment summary</h2>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Subtotal</dt>
                  <dd className="font-semibold text-gray-800">
                    {formatPrice(order.subtotal)}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="flex items-center gap-1.5 text-gray-500">
                    Discount
                    {couponCode && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700 ring-1 ring-inset ring-emerald-100">
                        <Tag size={10} />
                        {couponCode}
                      </span>
                    )}
                  </dt>
                  <dd className="font-semibold text-emerald-600">
                    {order.discountAmount > 0
                      ? `− ${formatPrice(order.discountAmount)}`
                      : formatPrice(0)}
                  </dd>
                </div>

                <div className="flex justify-between border-t border-gray-100 pt-4">
                  <dt className="font-bold text-gray-900">Total</dt>
                  <dd className="text-lg font-bold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 space-y-3 rounded-xl bg-gray-50 p-4 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-gray-500">
                    <CreditCard size={14} />
                    Method
                  </span>
                  <span className="font-semibold capitalize text-gray-800">
                    {order.paymentMethod === "cod"
                      ? "Cash on delivery"
                      : order.paymentMethod || "N/A"}
                  </span>
                </div>

                {order.razorpayOrderId && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Hash size={14} />
                      Razorpay ID
                    </span>
                    <span className="truncate font-mono font-semibold text-gray-800">
                      {order.razorpayOrderId}
                    </span>
                  </div>
                )}

                {order.paymentMethod === "cod" && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-gray-500">
                      <ShieldCheck size={14} />
                      OTP verified
                    </span>
                    <span
                      className={`font-semibold ${
                        order.otpVerified ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {order.otpVerified ? "Yes" : "No"}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* CUSTOMER */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-sm font-bold text-gray-900">Customer</h2>

              <div className="mt-4 flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff5f0] text-[#ff5a1f]">
                  <User size={20} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {user?.name || "Customer"}
                  </p>
                  {user?.email && (
                    <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-gray-400">
                      <Mail size={12} />
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* SHIPPING ADDRESS */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900">
                  Shipping address
                </h2>
                {address?.type && (
                  <span className="rounded-md bg-gray-50 px-2 py-1 text-[11px] font-medium capitalize text-gray-600 ring-1 ring-inset ring-gray-200">
                    {address.type}
                  </span>
                )}
              </div>

              {address ? (
                <div className="mt-4 flex gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff5f0] text-[#ff5a1f]">
                    <MapPin size={20} />
                  </div>
                  <div className="min-w-0 text-sm">
                    <p className="font-semibold text-gray-900">
                      {address.fullName}
                    </p>
                    <p className="mt-1 leading-6 text-gray-500">
                      {address.address}
                      <br />
                      {address.city}, {address.state} {address.zipCode}
                      <br />
                      {address.country}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                      <Phone size={12} />
                      {address.phone}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-400">
                  Address details aren't available for this order.
                </p>
              )}
            </section>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <AdminSidebar></AdminSidebar>

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-none">{renderBody()}</div>
      </main>
    </div>
  );
};

export default Order;
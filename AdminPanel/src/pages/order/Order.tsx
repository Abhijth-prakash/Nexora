import { useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
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
  Wallet,
  Check,
  Zap,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* types + constants                                                          */
/* -------------------------------------------------------------------------- */

type OrderItem = Baseorder["items"][number];

const MAIN_STEPS = [
  { key: "confirmed", status: "confirmed", label: "Order confirmed", note: "The order was placed and confirmed." },
  { key: "shipped", status: "shipped", label: "Shipped", note: "The order was handed to the courier." },
  { key: "outForDelivery", status: "out_for_delivery", label: "Out for delivery", note: "The courier is delivering the order." },
  { key: "delivered", status: "delivered", label: "Delivered", note: "The order was delivered to the customer." },
] as const;

const RETURN_TRACK_STEPS = [
  { key: "requested", label: "Return requested", note: "The customer submitted a return request." },
  { key: "approved", label: "Return approved", note: "The return request was approved." },
  { key: "pickup_scheduled", label: "Pickup scheduled", note: "Pickup is being arranged for the returned item." },
  { key: "picked_up", label: "Picked up", note: "The returned item has been collected." },
  { key: "received", label: "Return received", note: "The returned item has been received and checked." },
  { key: "refunded", label: "Refund completed", note: "The refund was credited to the customer's wallet." },
] as const;

/* -------------------------------------------------------------------------- */
/* helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatPrice = (value: number) =>
  `₹${(value ?? 0).toLocaleString("en-IN")}`;

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

const PAYMENT_STYLES: Record<
  Baseorder["paymentStatus"],
  { label: string; className: string; icon: ReactNode }
> = {
  cod: { label: "COD", className: "bg-amber-50 text-amber-700 ring-amber-100", icon: <CreditCard size={14} /> },
  paid: { label: "Paid", className: "bg-emerald-50 text-emerald-700 ring-emerald-100", icon: <CheckCircle2 size={14} /> },
  pending: { label: "Payment pending", className: "bg-amber-50 text-amber-700 ring-amber-100", icon: <Clock size={14} /> },
  failed: { label: "Failed", className: "bg-red-50 text-red-700 ring-red-100", icon: <XCircle size={14} /> },
  partially_refunded: { label: "Partially refunded", className: "bg-blue-50 text-blue-700 ring-blue-100", icon: <RefreshCw size={14} /> },
  refunded: { label: "Refunded", className: "bg-blue-50 text-blue-700 ring-blue-100", icon: <RefreshCw size={14} /> },
};

const getPaymentStyle = (status: Baseorder["paymentStatus"]) =>
  PAYMENT_STYLES[status] ?? {
    label: String(status),
    className: "bg-gray-50 text-gray-600 ring-gray-200",
    icon: <Package size={14} />,
  };

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  payment_pending: { label: "Payment pending", className: "bg-yellow-50 text-yellow-700 ring-yellow-100" },
  confirmed: { label: "Confirmed", className: "bg-orange-50 text-[#ff5a1f] ring-orange-100" },
  shipped: { label: "Shipped", className: "bg-blue-50 text-blue-700 ring-blue-100" },
  out_for_delivery: { label: "Out for delivery", className: "bg-indigo-50 text-indigo-700 ring-indigo-100" },
  delivered: { label: "Delivered", className: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 ring-red-100" },
  return_requested: { label: "Return requested", className: "bg-amber-50 text-amber-700 ring-amber-100" },
  returned: { label: "Returned", className: "bg-gray-100 text-gray-700 ring-gray-200" },
};

const getStatusStyle = (status: string) =>
  STATUS_STYLES[status] ?? {
    label: status.replaceAll("_", " "),
    className: "bg-gray-50 text-gray-600 ring-gray-200",
  };

// product / variant can be an id string or a populated object
const getItemDetails = (item: OrderItem) => {
  const product = typeof item.product === "string" ? null : item.product;
  const variant =
    item.variantId && typeof item.variantId !== "string" ? item.variantId : null;

  return {
    name: product?.name || "Product",
    brand: product?.brand || "",
    image: variant?.images?.[0] || product?.images?.[0] || "",
    color: variant?.color || product?.color || "",
    size: variant?.size?.length ? variant.size.join(", ") : "",
  };
};

const Pill = ({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ring-inset ${className}`}
  >
    {children}
  </span>
);

const Panel = ({
  title,
  right,
  children,
  className = "",
}: {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <section
    className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
  >
    {title && (
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        {right}
      </div>
    )}
    {children}
  </section>
);

/* -------------------------------------------------------------------------- */
/* order timeline                                                             */
/* -------------------------------------------------------------------------- */

type Step = {
  key: string;
  label: string;
  note: string;
  date: string | null;
  state: "done" | "current" | "pending" | "cancelled";
};

const buildTimeline = (order: Baseorder): Step[] => {
  const status = order.orderStatus;
  const t = order.trackingDates;
  const isCancelled = status === "cancelled";
  const inReturnFlow = status === "return_requested" || status === "returned";

  const dates: Record<(typeof MAIN_STEPS)[number]["key"], string | null> = {
    confirmed:
      t?.confirmed ||
      (status === "payment_pending" ? null : order.orderDate || order.createdAt),
    shipped: t?.shipped ?? null,
    outForDelivery: t?.outForDelivery ?? null,
    delivered: t?.delivered ?? null,
  };

  let reached = MAIN_STEPS.findIndex((s) => s.status === status);
  if (status === "payment_pending") reached = -1;
  if (inReturnFlow) reached = MAIN_STEPS.length - 1;
  if (isCancelled) {
    reached = MAIN_STEPS.reduce((last, s, i) => (dates[s.key] ? i : last), -1);
  }

  const visible = isCancelled ? MAIN_STEPS.slice(0, reached + 1) : MAIN_STEPS;

  const steps: Step[] = visible.map((s, i) => ({
    key: s.key,
    label: s.label,
    note: s.note,
    date: dates[s.key],
    state:
      isCancelled || inReturnFlow || status === "delivered"
        ? i <= reached
          ? "done"
          : "pending"
        : i < reached
        ? "done"
        : i === reached
        ? "current"
        : "pending",
  }));

  if (isCancelled) {
    steps.push({
      key: "cancelled",
      label: "Order cancelled",
      note: "",
      date: t?.cancelled || order.updatedAt,
      state: "cancelled",
    });
  }

  if (inReturnFlow) {
    steps.push(
      {
        key: "returnRequested",
        label: "Return requested",
        note: "The customer asked to return this order.",
        date: t?.returnRequested ?? null,
        state: status === "return_requested" ? "current" : "done",
      },
      {
        key: "returned",
        label: "Returned",
        note: "The returned order was received.",
        date: t?.returned ?? null,
        state: status === "returned" ? "done" : "pending",
      }
    );
  }

  return steps;
};

const Timeline = ({ steps, order }: { steps: Step[]; order: Baseorder }) => (
  <ol>
    {steps.map((step, i) => {
      const last = i === steps.length - 1;
      const next = steps[i + 1];
      const lineDone = step.state === "done" && next && next.state !== "pending";

      const dot =
        step.state === "cancelled"
          ? "border-red-500 bg-red-500 text-white"
          : step.state === "done"
          ? "border-emerald-500 bg-emerald-500 text-white"
          : step.state === "current"
          ? "border-[#ff5a1f] bg-white text-[#ff5a1f] ring-4 ring-orange-100"
          : "border-gray-300 bg-white text-transparent";

      return (
        <li key={step.key} className="relative flex gap-4 pb-7 last:pb-0">
          {!last && (
            <span
              className={`absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-0.5 ${
                lineDone ? "bg-emerald-500" : "bg-gray-200"
              }`}
            />
          )}

          <span
            className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${dot}`}
          >
            {step.state === "cancelled" ? (
              <XCircle size={12} />
            ) : (
              <Check size={12} strokeWidth={3} />
            )}
          </span>

          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-semibold ${
                step.state === "pending"
                  ? "text-gray-400"
                  : step.state === "cancelled"
                  ? "text-red-600"
                  : "text-gray-900"
              }`}
            >
              {step.label}
              {step.date && step.state !== "pending" && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  {formatTrackDate(step.date)}
                </span>
              )}
            </p>

            {step.state === "cancelled" ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-red-200 bg-red-50/70">
                <div className="flex items-center justify-between gap-2 border-b border-red-100 px-4 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-red-500">
                    Cancellation details
                  </p>
                  {order.cancelledBy && (
                    <span className="text-xs text-red-700">
                      by{" "}
                      <span className="font-semibold capitalize">
                        {order.cancelledBy}
                      </span>
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-wrap break-words px-4 py-3 text-sm leading-6 text-gray-700">
                  {order.cancelReason?.trim() ||
                    "No cancellation reason was provided."}
                </p>
              </div>
            ) : (
              <p
                className={`mt-1 text-xs ${
                  step.state === "pending" ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {step.state === "pending" ? "Waiting" : step.note}
              </p>
            )}
          </div>
        </li>
      );
    })}
  </ol>
);

/* -------------------------------------------------------------------------- */
/* page                                                                       */
/* -------------------------------------------------------------------------- */

const Order = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const { orders, loading, error } = useAppSelector(
    (state) => state.orderData
  );

  const load = () =>
    dispatch(getOrders({ page: 1, search: "", status: "", payment: "" }));

  // fetch once if the list isn't in the store yet (e.g. page refreshed)
  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    if (!orders || orders.length === 0) {
      fetchedRef.current = true;
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, orders]);

  const order = orders?.find((o) => o._id === id) as Baseorder | undefined;
  const timeline = useMemo(() => (order ? buildTimeline(order) : []), [order]);

  const renderBody = () => {
    if (loading && !order) {
      return (
        <div className="rounded-3xl border border-gray-100 bg-white px-6 py-24 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1eb]">
            <Package size={25} className="animate-pulse text-[#ff5a1f]" />
          </div>
          <p className="mt-5 text-sm font-semibold text-gray-800">Loading order</p>
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
            onClick={load}
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
          <h2 className="mt-6 text-xl font-bold text-gray-900">Order not found</h2>
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

    const payment = getPaymentStyle(order.paymentStatus);
    const orderStatus = getStatusStyle(order.orderStatus);
    const user = typeof order.user === "string" ? null : order.user;
    const address = typeof order.address === "string" ? null : order.address;
    const coupon =
      order.coupon && typeof order.coupon !== "string" ? order.coupon : null;
    const couponCode =
      coupon?.code || (typeof order.coupon === "string" ? order.coupon : "");
    const returnRequest =
      order.return && typeof order.return !== "string" ? order.return : null;

    const totalQuantity = order.items.reduce((sum, i) => sum + i.quantity, 0);
    const cancelledItems = order.items.filter((i) => i.status === "cancelled").length;
    const returnItems = order.items.filter(
      (i) => i.status === "return_requested" || i.status === "returned"
    ).length;

    const isCod = order.paymentMethod === "cod";

    return (
      <>
        {/* HEADER */}
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
              <Pill className={orderStatus.className}>{orderStatus.label}</Pill>
              <Pill className={payment.className}>
                {payment.icon}
                {payment.label}
              </Pill>
              {order.isBuyNow && (
                <Pill className="bg-violet-50 text-violet-700 ring-violet-100">
                  <Zap size={13} />
                  Buy now
                </Pill>
              )}
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
          {/* LEFT */}
          <div className="space-y-6">
            {/* ITEMS */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-4 sm:px-7">
                <h2 className="text-sm font-bold text-gray-900">Items</h2>
                <p className="text-xs text-gray-400">
                  {totalQuantity} {totalQuantity === 1 ? "unit" : "units"} ·{" "}
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "product" : "products"}
                  {cancelledItems > 0 && ` · ${cancelledItems} cancelled`}
                  {returnItems > 0 && ` · ${returnItems} in return`}
                </p>
              </div>

              <ul className="divide-y divide-gray-100">
                {order.items.map((item, index) => {
                  const d = getItemDetails(item);
                  const cancelled = item.status === "cancelled";
                  const itemStatus =
                    item.status === "active"
                      ? getStatusStyle(order.orderStatus)
                      : getStatusStyle(item.status);

                  return (
                    <li
                      key={item._id || index}
                      className={`px-5 py-5 sm:px-7 ${
                        cancelled ? "bg-red-50/30" : ""
                      }`}
                    >
                      <div className="flex gap-4 sm:gap-5">
                        <div
                          className={`h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:h-28 sm:w-28 ${
                            cancelled ? "opacity-60 grayscale" : ""
                          }`}
                        >
                          {d.image ? (
                            <img
                              src={d.image}
                              alt={d.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-300">
                              <Package size={28} />
                            </div>
                          )}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div className="min-w-0">
                            {d.brand && (
                              <p className="text-[11px] font-semibold text-[#ff5a1f]">
                                {d.brand}
                              </p>
                            )}
                            <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-gray-900 sm:text-base">
                              {d.name}
                            </h3>

                            <div className="mt-2 flex flex-wrap gap-2">
                              {d.color && (
                                <span className="rounded-md bg-gray-50 px-2 py-1 text-[11px] font-medium capitalize text-gray-600 ring-1 ring-inset ring-gray-200">
                                  {d.color}
                                </span>
                              )}
                              {d.size && (
                                <span className="rounded-md bg-gray-50 px-2 py-1 text-[11px] font-medium uppercase text-gray-600 ring-1 ring-inset ring-gray-200">
                                  Size {d.size}
                                </span>
                              )}
                            </div>

                            <p className="mt-3 text-xs text-gray-400">
                              {formatPrice(item.price)} × {item.quantity} ={" "}
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>

                          <div className="sm:text-right">
                            <p
                              className={`text-base font-bold ${
                                cancelled
                                  ? "text-gray-400 line-through"
                                  : "text-gray-900"
                              }`}
                            >
                              {formatPrice(item.finalAmount)}
                            </p>
                            {item.discountShare > 0 && (
                              <p className="mt-0.5 text-[11px] text-emerald-600">
                                after {formatPrice(item.discountShare)} discount
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* item status row */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Pill className={itemStatus.className}>
                          {itemStatus.label}
                        </Pill>

                        {item.refund.status !== "none" && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              item.refund.status === "completed"
                                ? "bg-emerald-50 text-emerald-700"
                                : item.refund.status === "failed"
                                ? "bg-red-50 text-red-600"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            <Wallet size={12} />
                            Refund {item.refund.status} ·{" "}
                            {formatPrice(item.refund.amount)}
                            {item.refund.refundedAt &&
                              ` · ${formatTrackDate(item.refund.refundedAt)}`}
                          </span>
                        )}
                      </div>

                      {cancelled && (
                        <div className="mt-3 rounded-xl border border-red-100 bg-white px-4 py-3 text-xs text-gray-600">
                          <p className="font-semibold text-red-600">
                            Cancelled
                            {item.cancelledBy && (
                              <>
                                {" "}
                                by{" "}
                                <span className="capitalize">
                                  {item.cancelledBy}
                                </span>
                              </>
                            )}
                            {item.cancelledAt && (
                              <span className="ml-2 font-normal text-gray-400">
                                {formatTrackDate(item.cancelledAt)}
                              </span>
                            )}
                          </p>
                          <p className="mt-1 whitespace-pre-wrap break-words leading-5">
                            {item.cancelReason?.trim() ||
                              "No reason was provided."}
                          </p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* ORDER TRACKING */}
            <Panel
              title="Order tracking"
              right={<Pill className={orderStatus.className}>{orderStatus.label}</Pill>}
            >
              <Timeline steps={timeline} order={order} />
            </Panel>

            {/* RETURN TRACKING */}
            {order.return && (
              <section className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#ff5a1f]">
                      <RefreshCw size={18} />
                    </span>
                    <div>
                      <h2 className="text-sm font-bold text-gray-900">
                        Return tracking
                      </h2>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Track the return request and refund progress
                      </p>
                    </div>
                  </div>

                  {returnRequest && (
                    <span
                      className={`rounded-full px-3 py-1.5 text-[11px] font-bold capitalize ${
                        returnRequest.status === "refunded"
                          ? "bg-emerald-50 text-emerald-700"
                          : returnRequest.status === "rejected" ||
                            returnRequest.status === "cancelled"
                          ? "bg-red-50 text-red-600"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
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
                          <span className="ml-2 text-xs font-medium text-gray-500">
                            · Wallet
                          </span>
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
                          ? returnRequest.trackingDates?.[
                              dateKey as keyof typeof returnRequest.trackingDates
                            ]
                          : null;
                        const currentIndex = RETURN_TRACK_STEPS.findIndex(
                          (s) => s.key === returnRequest.status
                        );
                        const done = index <= currentIndex || Boolean(date);

                        return (
                          <li
                            key={step.key}
                            className="relative flex gap-4 pb-6 last:pb-0"
                          >
                            {index !== RETURN_TRACK_STEPS.length - 1 && (
                              <span
                                className={`absolute left-[7px] top-4 h-full w-0.5 ${
                                  done && index < currentIndex
                                    ? "bg-emerald-400"
                                    : "bg-gray-200"
                                }`}
                              />
                            )}
                            <span
                              className={`relative z-10 mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                                done
                                  ? "border-emerald-500 bg-emerald-500"
                                  : "border-gray-300 bg-white"
                              }`}
                            />
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p
                                  className={`text-sm font-semibold ${
                                    done ? "text-gray-900" : "text-gray-400"
                                  }`}
                                >
                                  {step.label}
                                </p>
                                {date && (
                                  <span className="text-[11px] text-gray-400">
                                    {formatTrackDate(date)}
                                  </span>
                                )}
                              </div>
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

                      {(returnRequest.status === "rejected" ||
                        returnRequest.status === "cancelled") && (
                        <li className="flex gap-4">
                          <span
                            className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                              returnRequest.status === "rejected"
                                ? "border-red-500 bg-red-500"
                                : "border-gray-400 bg-gray-400"
                            }`}
                          />
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                returnRequest.status === "rejected"
                                  ? "text-red-600"
                                  : "text-gray-700"
                              }`}
                            >
                              Return {returnRequest.status}
                              {(() => {
                                const terminalDate =
                                  returnRequest.trackingDates?.[
                                    returnRequest.status
                                  ];
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
                      <span className="text-xs font-medium text-gray-500">
                        Refund status
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
                          returnRequest.refund.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : returnRequest.refund.status === "failed"
                            ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {returnRequest.refund.status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-5 sm:px-6">
                    <p className="text-sm font-medium text-gray-700">
                      Return request exists, but its tracking details aren't
                      available.
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Populate the order's return reference with the Return
                      document to display its timeline.
                    </p>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-6 xl:sticky xl:top-6">
            {/* PAYMENT SUMMARY */}
            <Panel title="Payment summary">
              <dl className="space-y-3 text-sm">
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

                {order.refundedAmount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Refunded to wallet</dt>
                    <dd className="font-semibold text-blue-600">
                      {formatPrice(order.refundedAmount)}
                    </dd>
                  </div>
                )}
              </dl>

              {order.cancelRefund && order.cancelRefund.amount > 0 && (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Wallet size={14} />
                    Cancellation refund
                  </span>
                  <span className="text-right font-semibold text-gray-800">
                    {formatPrice(order.cancelRefund.amount)} ·{" "}
                    <span
                      className={`capitalize ${
                        order.cancelRefund.status === "completed"
                          ? "text-emerald-600"
                          : order.cancelRefund.status === "failed"
                          ? "text-red-600"
                          : "text-amber-600"
                      }`}
                    >
                      {order.cancelRefund.status}
                    </span>
                  </span>
                </div>
              )}

              <div className="mt-5 space-y-3 rounded-xl bg-gray-50 p-4 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-gray-500">
                    <CreditCard size={14} />
                    Method
                  </span>
                  <span className="font-semibold capitalize text-gray-800">
                    {isCod ? "Cash on delivery" : order.paymentMethod || "N/A"}
                  </span>
                </div>

                {order.razorpayOrderId && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Hash size={14} />
                      Razorpay order
                    </span>
                    <span className="truncate font-mono font-semibold text-gray-800">
                      {order.razorpayOrderId}
                    </span>
                  </div>
                )}

                {order.razorpay_payment_id && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Hash size={14} />
                      Payment ID
                    </span>
                    <span className="truncate font-mono font-semibold text-gray-800">
                      {order.razorpay_payment_id}
                    </span>
                  </div>
                )}

                {isCod && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-gray-500">
                      <ShieldCheck size={14} />
                      Delivery OTP
                    </span>
                    <span
                      className={`font-semibold ${
                        order.otpVerified ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {order.otpVerified
                        ? "Verified"
                        : `Not verified${
                            order.otpAttempts > 0
                              ? ` · ${order.otpAttempts} attempt${
                                  order.otpAttempts > 1 ? "s" : ""
                                }`
                              : ""
                          }`}
                    </span>
                  </div>
                )}
              </div>
            </Panel>

            {/* CUSTOMER */}
            <Panel title="Customer">
              <div className="flex items-center gap-3.5">
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
            </Panel>

            {/* SHIPPING ADDRESS */}
            <Panel
              title="Shipping address"
              right={
                address?.type ? (
                  <span className="rounded-md bg-gray-50 px-2 py-1 text-[11px] font-medium capitalize text-gray-600 ring-1 ring-inset ring-gray-200">
                    {address.type}
                  </span>
                ) : undefined
              }
            >
              {address ? (
                <div className="flex gap-3.5">
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
                <p className="text-sm text-gray-400">
                  Address details aren't available for this order.
                </p>
              )}
            </Panel>
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
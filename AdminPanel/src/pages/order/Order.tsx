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

type OrderItem = Baseorder["items"][number];

const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

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
      dispatch(getOrders());
    }
  }, [dispatch]);

  const order = orders?.find((o) => o._id === id);

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
            onClick={() => dispatch(getOrders())}
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
          {/* LEFT: ITEMS */}
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
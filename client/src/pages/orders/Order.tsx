import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getOrders, cancelOrder } from "../../redux/features/orderSlice";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  MapPin,
  CreditCard,
  CalendarDays,
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  Tag,
  Receipt,
  ShoppingBag,
  Truck,
} from "lucide-react";

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

const formatTrackDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "2-digit",
  });

const Order = () => {
  const dispatch = useAppDispatch();

  const { orders, loading, ordererrors } = useAppSelector(
    (state) => state.orderData
  );

  const { orderId } = useParams<{ orderId: string }>();

  // ---- cancel order state ----
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    if (!orders || orders.length === 0) {
      dispatch(getOrders({page:1,search:""}));
    }
  }, [dispatch, orders]);

  // Find the selected order
  const order = orders?.find((item) => item._id === orderId);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatPrice = (amount: number) =>
    `₹${(amount ?? 0).toLocaleString("en-IN")}`;

  const getStatus = (status: string) => {
    switch (status) {
      case "cod":
        return {
          label: "Cash on delivery",
          icon: <CreditCard size={16} />,
          style: "bg-amber-50 text-amber-700 border-amber-200",
        };

      case "paid":
        return {
          label: "Paid",
          icon: <CheckCircle2 size={16} />,
          style: "bg-green-50 text-green-700 border-green-200",
        };

      case "pending":
        return {
          label: "Pending",
          icon: <Clock size={16} />,
          style: "bg-yellow-50 text-yellow-700 border-yellow-200",
        };

      case "failed":
        return {
          label: "Failed",
          icon: <XCircle size={16} />,
          style: "bg-red-50 text-red-700 border-red-200",
        };

      case "refunded":
        return {
          label: "Refunded",
          icon: <Receipt size={16} />,
          style: "bg-blue-50 text-blue-700 border-blue-200",
        };

      default:
        return {
          label: status,
          icon: <Clock size={16} />,
          style: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  // ---- cancel handlers ----
  const openCancelModal = () => {
    setCancelReason("");
    setCancelError("");
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    if (cancelling) return; // don't close while the request is running
    setShowCancelModal(false);
    setCancelReason("");
    setCancelError("");
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    const reason = cancelReason.trim();
    if (!reason) {
      setCancelError("Please enter a reason for cancelling.");
      return;
    }

    try {
      setCancelling(true);
      setCancelError("");

      // wait until the cancel request finishes
      await dispatch(
        cancelOrder({ orderId: order._id, cancelReason: reason })
      ).unwrap();

      // then fetch the latest orders
      await dispatch(getOrders({ page: 1, search: "" })).unwrap();

      setShowCancelModal(false);
      setCancelReason("");
    } catch (err) {
      setCancelError(
        typeof err === "string"
          ? err
          : "Failed to cancel order. Please try again."
      );
    } finally {
      setCancelling(false);
    }
  };

  // Loading state
  if (loading && (!orders || orders.length === 0)) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (ordererrors && (!orders || orders.length === 0)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-red-500">{ordererrors}</p>

        <button
          onClick={() => dispatch(getOrders({page:1,search:""}))}
          className="px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Try again
        </button>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Package size={48} className="text-gray-300" />

        <h2 className="text-xl font-semibold text-gray-800">
          Order not found
        </h2>

        <p className="text-sm text-gray-500">
          We couldn't find an order with this ID.
        </p>

        <Link
          to="/users/orders"
          className="flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
        >
          <ArrowLeft size={17} />
          Back to orders
        </Link>
      </div>
    );
  }

  const status = getStatus(order.paymentStatus);

  // ---- tracking ----
  const isCancelled = order.orderStatus === "cancelled";

  // cancel button is hidden once the order is out for delivery, delivered or cancelled
  const canCancel = !["out_for_delivery", "delivered", "cancelled"].includes(
    order.orderStatus
  );

  // date for each stage (confirmed falls back to the order date)
  const trackDates: Record<(typeof TRACK_STEPS)[number]["key"], string | null> = {
    confirmed:
      order.trackingDates?.confirmed || order.orderDate || order.createdAt,
    shipped: order.trackingDates?.shipped ?? null,
    outForDelivery: order.trackingDates?.outForDelivery ?? null,
    delivered: order.trackingDates?.delivered ?? null,
  };

  // index of the last stage the order has reached
  let reachedIndex = TRACK_STEPS.findIndex(
    (s) => s.status === order.orderStatus
  );
  if (isCancelled) {
    // cancelled: stop at the last stage that has a date
    reachedIndex = TRACK_STEPS.reduce(
      (last, s, i) => (trackDates[s.key] ? i : last),
      0
    );
  }
  if (reachedIndex < 0) reachedIndex = 0;

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-8 sm:px-8 lg:px-12 xl:px-16">
      <div className="w-full max-w-none">

        {/* Back navigation */}
        <Link
          to="/users/orders"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 mb-6 transition"
        >
          <ArrowLeft size={17} />
          Back to orders
        </Link>

        {/* Order header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Order details
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Placed on{" "}
              {formatDate(order.orderDate || order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold w-fit ${status.style}`}
            >
              {status.icon}
              {status.label}
            </span>

            {/* Cancel button (hidden when out for delivery / delivered / cancelled) */}
            {canCancel && (
              <button
                type="button"
                onClick={openCancelModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 bg-white text-red-600 text-sm font-semibold hover:bg-red-50 transition"
              >
                <XCircle size={16} />
                Cancel order
              </button>
            )}
          </div>
        </div>

        {/* Full-width layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Ordered products */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <ShoppingBag className="text-orange-500" size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Ordered items
                  </h2>

                  <p className="text-xs text-gray-500">
                    {order.items.length} item(s) in this order
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {order.items.map((item, index) => {
                  const product =
                    typeof item.product === "string"
                      ? null
                      : item.product;

                  const productId =
                    typeof item.product === "string"
                      ? item.product
                      : item.product?._id;

                  return (
                    <div
                      key={`${productId || index}-${index}`}
                      className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                      <div className="flex items-center gap-5 min-w-0">

                        {/* Clickable product image */}
                        <Link
                          to={productId ? `/product/${productId}` : "#"}
                          className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center hover:border-orange-300 transition"
                        >
                          {product?.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name || "Product"}
                              className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <Package
                              size={36}
                              className="text-gray-300"
                            />
                          )}
                        </Link>

                        {/* Product information */}
                        <div className="min-w-0">
                          <Link
                            to={productId ? `/product/${productId}` : "#"}
                            className="font-semibold text-base sm:text-lg text-gray-900 hover:text-orange-600 transition line-clamp-2"
                          >
                            {product?.name || "Product"}
                          </Link>

                          {product?.brand && (
                            <p className="text-sm text-gray-500 mt-1">
                              {product.brand}
                            </p>
                          )}

                          <p className="text-sm text-gray-500 mt-3">
                            Quantity: {item.quantity}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            Unit price: {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>

                      {/* Item total */}
                      <div className="sm:text-right pl-0 sm:pl-4">
                        <p className="text-xs text-gray-400 mb-1">
                          Item total
                        </p>

                        <p className="font-semibold text-lg text-gray-900 whitespace-nowrap">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Order tracking */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Truck className="text-orange-500" size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Order tracking
                    </h2>

                    <p className="text-xs text-gray-500">
                      Follow your order's journey
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    isCancelled
                      ? "bg-red-50 text-red-600"
                      : order.orderStatus === "delivered"
                      ? "bg-green-50 text-green-700"
                      : "bg-orange-50 text-orange-600"
                  }`}
                >
                  {isCancelled
                    ? "Cancelled"
                    : TRACK_STEPS[reachedIndex].label}
                </span>
              </div>

              <ol>
                {TRACK_STEPS.map((step, i) => {
                  const done = i <= reachedIndex;
                  const date = trackDates[step.key];
                  const isLast = i === TRACK_STEPS.length - 1 && !isCancelled;
                  const lineDone = i < reachedIndex;

                  return (
                    <li
                      key={step.key}
                      className="relative flex gap-4 pb-8 last:pb-0"
                    >
                      {/* connector line */}
                      {!isLast && (
                        <span
                          className={`absolute left-[7px] top-4 h-full w-0.5 ${
                            lineDone ? "bg-green-500" : "bg-gray-200"
                          }`}
                        />
                      )}

                      {/* dot */}
                      <span
                        className={`relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                          done
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300 bg-white"
                        }`}
                      />

                      <div className="min-w-0">
                        <p
                          className={`text-sm sm:text-base font-semibold ${
                            done ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                          {done && date && (
                            <span className="ml-2 text-xs sm:text-sm font-normal text-gray-400">
                              {formatTrackDate(date)}
                            </span>
                          )}
                        </p>

                        <p
                          className={`text-xs sm:text-sm mt-1 ${
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
                    <span className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-red-500 bg-red-500" />

                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-semibold text-red-600">
                        Cancelled
                        <span className="ml-2 text-xs sm:text-sm font-normal text-gray-400">
                          {formatTrackDate(order.updatedAt)}
                        </span>
                      </p>

                      <p className="text-xs sm:text-sm mt-1 text-gray-500">
                        This order was cancelled.
                      </p>
                    </div>
                  </li>
                )}
              </ol>
            </section>

            {/* Delivery address */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <MapPin className="text-orange-500" size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Delivery address
                  </h2>

                  <p className="text-xs text-gray-500">
                    Shipping information
                  </p>
                </div>
              </div>

              {typeof order.address !== "string" && order.address ? (
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-900">
                    {order.address.fullName}
                  </p>

                  <p>{order.address.address}</p>

                  <p>
                    {order.address.city}, {order.address.state}
                  </p>

                  <p>
                    {order.address.country} - {order.address.zipCode}
                  </p>

                  <p className="pt-2">
                    Phone: {order.address.phone}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Address details are unavailable.
                </p>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Payment details */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <CreditCard className="text-orange-500" size={20} />

                <h2 className="font-semibold text-gray-900">
                  Payment details
                </h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">
                    Payment method
                  </span>

                  <span className="font-medium text-gray-900 capitalize">
                    {order.paymentMethod || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">
                    Payment status
                  </span>

                  <span className="font-medium text-gray-900 capitalize">
                    {order.paymentStatus}
                  </span>
                </div>

                {order.razorpayOrderId && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">
                      Payment reference
                    </p>

                    <p className="text-xs font-medium text-gray-700 break-all">
                      {order.razorpayOrderId}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Order summary */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <Receipt className="text-orange-500" size={20} />

                <h2 className="font-semibold text-gray-900">
                  Order summary
                </h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>

                  <span className="text-gray-900">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>

                  <span className="text-green-600">
                    -{formatPrice(order.discountAmount)}
                  </span>
                </div>

                {typeof order.coupon !== "string" && order.coupon && (
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Tag size={14} />
                      Coupon
                    </span>

                    <span className="text-xs font-semibold text-orange-600">
                      {order.coupon.code}
                    </span>
                  </div>
                )}

                <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">
                    Total amount
                  </span>

                  <span className="text-xl font-bold text-orange-600">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </section>

            {/* Order date */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-start gap-3">
              <CalendarDays
                className="text-orange-500 mt-0.5"
                size={20}
              />

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Order placed
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  {formatDate(order.orderDate || order.createdAt)}
                </p>
              </div>
            </div>

            {/* Delivery information */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start gap-3">
              <Truck
                className="text-orange-500 mt-0.5"
                size={20}
              />

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Delivery information
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Your order details and delivery address are available here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel order modal */}
      {showCancelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={closeCancelModal}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <XCircle className="text-red-500" size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Cancel this order?
                </h3>

                <p className="text-xs text-gray-500">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            <label
              htmlFor="cancelReason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reason for cancellation
            </label>

            <textarea
              id="cancelReason"
              rows={4}
              maxLength={500}
              value={cancelReason}
              onChange={(e) => {
                setCancelReason(e.target.value);
                if (cancelError) setCancelError("");
              }}
              disabled={cancelling}
              placeholder="Tell us why you want to cancel this order"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-50 resize-none"
            />

            <div className="flex justify-between mt-1">
              <p className="text-xs text-red-500 min-h-[1rem]">
                {cancelError}
              </p>

              <p className="text-xs text-gray-400">
                {cancelReason.length}/500
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={closeCancelModal}
                disabled={cancelling}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Keep order
              </button>

              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={cancelling || !cancelReason.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {cancelling ? "Cancelling..." : "Confirm cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
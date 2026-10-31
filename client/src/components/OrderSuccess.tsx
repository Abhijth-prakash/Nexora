
import {
  CheckCircle2,
  Package,
  CalendarDays,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  Copy,
  MapPin,
  User,
  Mail,
  Phone,
  Tag,
  ShieldCheck,
  Truck,
  Receipt,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import type { Baseorder } from "../utils/baseTypes";

const OrderSuccess = () => {
  const navigate = useNavigate();

  const { orderDetails } = useAppSelector(
    (state) => state.orderData
  );

  const order: Baseorder | undefined = Array.isArray(orderDetails)
    ? orderDetails[0]
    : orderDetails ?? undefined;

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Package size={42} className="mx-auto mb-4 text-gray-400" />

          <h1 className="text-xl font-bold text-gray-900">
            Order details unavailable
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            We couldn't find your order details.
          </p>

          <button
            onClick={() => navigate("/users/orders")}
            className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            View My Orders
          </button>
        </div>
      </main>
    );
  }

  const items = order.items ?? [];

  const user =
    typeof order.user === "string" ? null : order.user;

  const address =
    typeof order.address === "string" ? null : order.address;

  const coupon =
    typeof order.coupon === "string" ? null : order.coupon;

  const formatCurrency = (amount?: number) =>
    `₹${(amount ?? 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date?: string) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
  };

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order._id);
    } catch (error) {
      console.error("Failed to copy order ID:", error);
    }
  };

  const isPaid = order.paymentStatus === "paid";

  return (
    <main className="min-h-screen bg-[#f7f8fa] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-5xl">

        {/* SUCCESS HEADER */}
        <section className="mb-9 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-50/60">
            <CheckCircle2
              size={42}
              strokeWidth={1.7}
              className="text-green-600"
            />
          </div>

          <span className="text-xs font-bold uppercase tracking-[0.22em] text-green-700">
            Order confirmation
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Thank you for your order!
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
            Your order has been successfully placed. We've summarized
            everything below for your reference.
          </p>
        </section>

        {/* ORDER REFERENCE CARD */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Order reference
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <h2 className="break-all text-lg font-bold text-gray-900">
                  {order._id}
                </h2>

                <button
                  onClick={copyOrderId}
                  title="Copy order ID"
                  className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
                >
                  <Copy size={15} />
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Placed on {formatDate(order.orderDate)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold capitalize ${
                  isPaid
                    ? "bg-green-50 text-green-700"
                    : order.paymentStatus === "pending"
                    ? "bg-amber-50 text-amber-700"
                    : order.paymentStatus === "refunded"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isPaid
                      ? "bg-green-500"
                      : order.paymentStatus === "pending"
                      ? "bg-amber-500"
                      : order.paymentStatus === "refunded"
                      ? "bg-blue-500"
                      : "bg-red-500"
                  }`}
                />
                Payment {order.paymentStatus}
              </span>

              <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold capitalize text-gray-700">
                {order.paymentMethod ?? "Not specified"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 border-t border-gray-100 bg-gray-50/70">
            <div className="flex items-center gap-3 p-4 sm:px-7">
              <CalendarDays size={18} className="text-gray-400" />
              <div>
                <p className="text-[11px] text-gray-400">Order date</p>
                <p className="mt-1 text-xs font-semibold text-gray-800">
                  {formatDate(order.orderDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-l border-gray-100 p-4 sm:px-7">
              <CreditCard size={18} className="text-gray-400" />
              <div>
                <p className="text-[11px] text-gray-400">Payment method</p>
                <p className="mt-1 text-xs font-semibold capitalize text-gray-800">
                  {order.paymentMethod ?? "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CUSTOMER & DELIVERY DETAILS */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* CUSTOMER */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <User size={19} className="text-gray-700" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  Customer information
                </h2>
                <p className="mt-0.5 text-xs text-gray-400">
                  Your account details
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Full name
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {user?.name ?? "Not available"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-gray-400" />
                <p className="break-all text-sm text-gray-600">
                  {user?.email ?? "Not available"}
                </p>
              </div>
            </div>
          </section>

          {/* DELIVERY ADDRESS */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <MapPin size={19} className="text-gray-700" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  Delivery address
                </h2>
                <p className="mt-0.5 text-xs text-gray-400">
                  Shipping destination
                </p>
              </div>
            </div>

            {address ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {address.fullName}
                  </p>

                  <span className="rounded-md bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600">
                    {address.type}
                  </span>
                </div>

                <p className="whitespace-pre-line text-sm leading-6 text-gray-600">
                  {address.address}
                </p>

                <p className="text-sm text-gray-600">
                  {address.city}, {address.state}
                </p>

                <p className="text-sm text-gray-600">
                  {address.country} - {address.zipCode}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <Phone size={15} className="text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">
                    {address.phone}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Address information unavailable
              </p>
            )}
          </section>
        </div>

        {/* ORDER ITEMS */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <ShoppingBag size={19} className="text-gray-700" />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Ordered items
                </h2>
                <p className="mt-0.5 text-xs text-gray-400">
                  {items.length} {items.length === 1 ? "product" : "products"} in this order
                </p>
              </div>
            </div>

            <Package size={21} className="text-gray-300" />
          </div>

          <div className="divide-y divide-gray-100 px-5 sm:px-7">
            {items.length === 0 ? (
              <p className="py-6 text-sm text-gray-500">
                No order items available.
              </p>
            ) : (
              items.map((item, index) => {
                const product =
                  typeof item.product === "string"
                    ? null
                    : item.product;

                const productId =
                  typeof item.product === "string"
                    ? item.product
                    : item.product._id;

                const productName =
                  product?.name ?? `Product ID: ${productId}`;

                return (
                  <div
                    key={`${productId}-${index}`}
                    className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900">
                        {productName}
                      </h3>

                      {product?.brand && (
                        <p className="mt-1 text-xs text-gray-500">
                          Brand: {product.brand}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span>Qty: {item.quantity}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-300" />
                        <span>
                          Unit price: {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
                      <span className="text-xs text-gray-400 sm:hidden">
                        Item total
                      </span>

                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* PAYMENT SUMMARY */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center gap-3 border-b border-gray-100 p-5 sm:p-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <Receipt size={19} className="text-gray-700" />
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900">
                Payment summary
              </h2>
              <p className="mt-0.5 text-xs text-gray-400">
                Detailed breakdown of your order
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="mx-auto max-w-lg space-y-4">

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Discount</span>
                <span className="font-semibold text-green-600">
                  -{formatCurrency(order.discountAmount)}
                </span>
              </div>

              {coupon && (
                <div className="flex items-center justify-between rounded-xl bg-green-50 p-3">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-green-600" />
                    <div>
                      <p className="text-xs font-bold text-green-800">
                        {coupon.code}
                      </p>
                      <p className="mt-0.5 text-[11px] text-green-700">
                        Coupon applied successfully
                      </p>
                    </div>
                  </div>

                  <ShieldCheck size={18} className="text-green-600" />
                </div>
              )}

              <div className="border-t border-dashed border-gray-200 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-bold text-gray-900">
                      Total paid
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {isPaid
                        ? "Payment successfully completed"
                        : `Payment ${order.paymentStatus}`}
                    </p>
                  </div>

                  <p className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DELIVERY MESSAGE */}
        <div className="mb-7 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
          <Truck size={20} className="mt-0.5 shrink-0 text-blue-600" />

          <div>
            <p className="text-sm font-semibold text-blue-900">
              What's next?
            </p>
            <p className="mt-1 text-xs leading-5 text-blue-700">
              You can track your order status and view your purchase
              history from the My Orders section.
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/users/orders")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            View My Orders
            <ArrowRight size={17} />
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </div>

        <p className="mt-7 text-center text-xs text-gray-400">
          Thank you for choosing Nexora.
        </p>

      </div>
    </main>
  );
};

export default OrderSuccess;

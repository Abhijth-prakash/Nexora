import {
  CheckCircle2,
  Package,
  CalendarDays,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  Copy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const OrderSuccess = () => {
  const navigate = useNavigate();

  const { orderDetails } = useAppSelector(
    (state) => state.orderData
  );

  if (!orderDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Package
            className="mx-auto mb-4 text-gray-400"
            size={48}
          />

          <h1 className="text-xl font-bold text-gray-900">
            Order details unavailable
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            We couldn't find your order details. Please check your orders.
          </p>

          <button
            onClick={() => navigate("/users/orders")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            View My Orders
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  const order = orderDetails;
  const items = order.items ?? [];

  const formatDate = (date?: string) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
  };

  const formatCurrency = (amount?: number) =>
    `₹${(amount ?? 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order._id);
    } catch (error) {
      console.error("Failed to copy order ID:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        {/* Success Header */}
        <section className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2
              size={44}
              strokeWidth={1.8}
              className="text-green-600"
            />
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Order Confirmation
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Order placed successfully!
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
            Thank you for shopping with Nexora. Your order details are
            summarized below.
          </p>
        </section>

        {/* Order Details */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Order Reference and Payment Status */}
          <div className="border-b border-gray-100 p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <p className="text-sm text-gray-500">
                  Order reference
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <p className="break-all text-base font-bold text-gray-900">
                    {order._id}
                  </p>

                  <button
                    onClick={copyOrderId}
                    title="Copy order ID"
                    aria-label="Copy order ID"
                    className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                  order.paymentStatus === "paid"
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
                    order.paymentStatus === "paid"
                      ? "bg-green-500"
                      : order.paymentStatus === "pending"
                      ? "bg-amber-500"
                      : order.paymentStatus === "refunded"
                      ? "bg-blue-500"
                      : "bg-red-500"
                  }`}
                />
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Order Date and Payment Method */}
          <div className="grid grid-cols-1 gap-5 border-b border-gray-100 p-5 sm:grid-cols-2 sm:p-7">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-gray-100 p-3">
                <CalendarDays size={20} className="text-gray-700" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Order date</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatDate(order.orderDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-gray-100 p-3">
                <CreditCard size={20} className="text-gray-700" />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Payment method
                </p>
                <p className="mt-1 text-sm font-semibold capitalize text-gray-900">
                  {order.paymentMethod ?? "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-gray-100 p-3">
                <ShoppingBag size={20} className="text-gray-700" />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Order summary
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {items.length}{" "}
                  {items.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {items.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No order items available.
                </p>
              ) : (
                items.map((item, index) => {
                  const productId =
                    typeof item.product === "string"
                      ? item.product
                      : item.product?._id ?? "Unavailable";

                  const productName =
                    typeof item.product === "string"
                      ? `Product ID: ${item.product}`
                      : item.product?.name ??
                        `Product ID: ${productId}`;

                  return (
                    <div
                      key={`${productId}-${item.variantId ?? "default"}-${index}`}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                          <Package
                            size={21}
                            className="text-gray-500"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="break-all text-sm font-semibold text-gray-900">
                            {productName}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Unit price: {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Total */}
            <div className="mt-7 border-t border-dashed border-gray-200 pt-5">
              {order.coupon && (
                <p className="mb-4 text-sm font-medium text-green-700">
                  Coupon applied to this order.
                </p>
              )}

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-bold text-gray-900">
                    Total amount
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Including discounts, if applicable
                  </p>
                </div>

                <p className="text-2xl font-bold tracking-tight text-gray-900">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/users/orders")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            View My Orders
            <ArrowRight size={17} />
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
          >
            Continue Shopping
          </button>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          Thank you for choosing Nexora. Keep your order reference for
          future assistance.
        </p>
      </div>
    </main>
  );
};

export default OrderSuccess;

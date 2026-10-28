
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getOrderSummary } from "../../redux/features/orderSlice";
import { getCart } from "../../redux/features/cartSlice";
import { getAddress } from "../../redux/features/addressSlice";
import type { BaseAddress } from "../../utils/baseTypes";

const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const couponId: string | undefined =
    location.state?.couponId ?? undefined;

  const {
    subtotal = 0,
    finalAmount = 0,
    discount = 0,
    coupon,
    loading,
    ordererrors,
  } = useAppSelector((state) => state.orderData);

  const { cartItems } = useAppSelector((state) => state.cartData);
  const { address } = useAppSelector((state) => state.addressData);

  const [selectedAddress, setSelectedAddress] = useState("");

  const addresses: BaseAddress[] = Array.isArray(address)
    ? address
    : [];

  const formatPrice = (amount: number) =>
    `₹${Number(amount ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  useEffect(() => {
    dispatch(getOrderSummary(couponId));
    dispatch(getCart());
    dispatch(getAddress());
  }, [dispatch, couponId]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find(
        (item) => item.isDefault
      );

      setSelectedAddress(
        defaultAddress?._id ?? addresses[0]._id
      );
    }
  }, [addresses, selectedAddress]);

  const handlePlaceOrder = () => {
    if (!cartItems?.length) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    // Connect your order-placement API here.
    toast.info("Connect your order placement API.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
            NEXORA / CHECKOUT
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Review your order and confirm your delivery details.
          </p>
        </div>

        {/* Progress: Cart → Summary → Payment */}
        <div className="mb-8 flex items-center justify-center overflow-x-auto rounded-2xl border border-gray-100 bg-white px-4 py-6 shadow-sm sm:px-8">
          <div className="flex w-full max-w-2xl items-center justify-between">
            {/* Cart - completed */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5 12 4 4L19 6"
                  />
                </svg>
              </div>

              <span className="text-sm font-medium text-gray-500 sm:text-base">
                Cart
              </span>
            </div>

            <div className="mx-3 h-px min-w-5 flex-1 bg-gray-300 sm:mx-5" />

            {/* Summary - current step */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-700 text-sm font-bold text-white">
                2
              </div>

              <span className="text-sm font-bold text-gray-900 sm:text-base">
                Summary
              </span>
            </div>

            <div className="mx-3 h-px min-w-5 flex-1 bg-gray-300 sm:mx-5" />

            {/* Payment - upcoming */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-500">
                3
              </div>

              <span className="text-sm text-gray-400 sm:text-base">
                Payment
              </span>
            </div>
          </div>
        </div>

        {ordererrors && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {ordererrors}
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Delivery address */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Delivery address
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Select your preferred delivery location.
                  </p>
                </div>

                <span className="text-2xl">📍</span>
              </div>

              {addresses.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {addresses.map((item) => {
                    const isSelected =
                      selectedAddress === item._id;

                    return (
                      <button
                        key={item._id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() =>
                          setSelectedAddress(item._id)
                        }
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                              isSelected
                                ? "border-emerald-600"
                                : "border-gray-400"
                            }`}
                          >
                            {isSelected && (
                              <span className="h-2 w-2 rounded-full bg-emerald-600" />
                            )}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-gray-900">
                                {item.fullName}
                              </h3>

                              {item.type && (
                                <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                  {item.type}
                                </span>
                              )}

                              {item.isDefault && (
                                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                                  Default
                                </span>
                              )}

                              {isSelected && (
                                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                                  Selected
                                </span>
                              )}
                            </div>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                              {item.address}, {item.city},{" "}
                              {item.state}, {item.zipCode},{" "}
                              {item.country}
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                              Phone: {item.phone}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center">
                  <div className="text-3xl">🏠</div>
                  <h3 className="mt-3 font-semibold text-gray-900">
                    No saved addresses
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add an address before continuing.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => navigate("/profile/address")}
                className="mt-5 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                + Manage addresses
              </button>
            </section>

            {/* Order items */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Order items
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Review the products in your order.
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                  {cartItems?.length ?? 0} products
                </span>
              </div>

              <div className="mt-6 divide-y divide-gray-100">
                {cartItems?.length ? (
                  cartItems.map((item: any) => (
                    <div
                      key={item._id}
                      className="flex gap-4 py-5 first:pt-0 last:pb-0"
                    >
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-28">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name ?? "Product"}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">
                            No image
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.name ?? "Product"}
                        </h3>

                        {item.brand && (
                          <p className="mt-1 text-sm text-gray-500">
                            {item.brand}
                          </p>
                        )}

                        {item.size && (
                          <p className="mt-1 text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                        )}

                        <p className="mt-2 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 font-semibold text-gray-900">
                        {formatPrice(
                          Number(
                            item.lineTotal ??
                              item.price * item.quantity
                          )
                        )}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <p className="font-medium text-gray-700">
                      Your cart is empty.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="mt-3 text-sm font-semibold text-red-700 hover:text-red-800"
                    >
                      Continue shopping
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => navigate("/users/cart")}
                className="mt-6 text-sm font-semibold text-red-700 hover:text-red-800"
              >
                ← Return to cart
              </button>
            </section>
          </div>

          {/* Right column: Order summary */}
          <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-6 sm:p-7">
            <h2 className="text-xl font-bold text-gray-900">
              Order summary
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your payment breakdown
            </p>

            {coupon && (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl font-bold text-emerald-700">
                  %
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-emerald-800">
                    {coupon.code}
                  </p>
                  <p className="mt-1 text-xs text-emerald-700">
                    Coupon applied successfully
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-4 border-b border-gray-200 pb-5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-500">Discount</span>
                <span className="font-semibold text-emerald-700">
                  −{formatPrice(discount)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-gray-600">
                  Calculated by order policy
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-gray-900">
                  Total payable
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(finalAmount)}
                </span>
              </div>

              {discount > 0 && (
                <p className="mt-2 text-right text-xs font-medium text-emerald-700">
                  You save {formatPrice(discount)} on this order.
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={
                loading ||
                !cartItems?.length ||
                !selectedAddress
              }
              onClick={handlePlaceOrder}
              className="mt-6 w-full rounded-xl bg-red-700 px-5 py-4 font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading ? "Calculating total..." : "Continue to payment"}
            </button>

            {!selectedAddress && addresses.length > 0 && (
              <p className="mt-3 text-center text-xs text-gray-500">
                Select a delivery address to continue.
              </p>
            )}

            <div className="mt-5 flex items-start gap-3 border-t border-gray-100 pt-5">
              <span className="text-lg">🔒</span>
              <p className="text-xs leading-5 text-gray-500">
                Your order total is calculated by the server. Your final
                payment and confirmation depend on successful order
                placement.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Checkout;

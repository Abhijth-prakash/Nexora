import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getCart,
  updateCartItem,
  setGuestItems,
  getCoupons,
  validateCoupon,
  deleteCart,
} from "../../redux/features/cartSlice";
import { UserProfile } from "../../redux/features/userSlice";
import {
  updateGuestQuantity,
  removeFromGuestCart,
} from "../../utils/guestCart";
import type { BaseCartItem } from "../../utils/baseTypes";
import { validateCart } from "../../redux/features/orderSlice";

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    cartItems,
    subtotal,
    totalItems,
    guestItems,
    coupons,
    finalAmount,
    discount,
    errors,
  } = useAppSelector((state) => state.cartData);

  const { logged, isStale } = useAppSelector(
    (state) => state.userData
  );

  const { ordererrors } = useAppSelector(
    (state) => state.orderData
  );

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [clearingCart, setClearingCart] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const [appliedCouponId, setAppliedCouponId] = useState<string | null>(
    null
  );

  const [applyingCouponId, setApplyingCouponId] = useState<string | null>(
    null
  );

  // Fetch cart and coupons
  useEffect(() => {
    if (isStale) {
      dispatch(UserProfile());
      return;
    }

    if (logged) {
      dispatch(getCart());
      dispatch(getCoupons());
    }
  }, [dispatch, logged, isStale]);

  // Convert guest cart items into BaseCartItem format
  const guestRows: BaseCartItem[] = guestItems.map((g) => ({
    _id: g.itemId,
    productId: g.productId,
    variantId: g.variantId,
    name: g.name,
    image: g.image,
    brand: g.brand,
    size: g.size,
    price: g.price,
    quantity: g.quantity,
    stock: g.stock,
    lineTotal: g.price * g.quantity,
    available: true,
  }));

  // Common cart items
  const items = logged ? cartItems : guestRows;

  const shownTotalItems = logged
    ? totalItems
    : guestItems.reduce((sum, item) => sum + item.quantity, 0);

  const shownSubtotal = logged
    ? subtotal
    : guestItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

  // Available coupons
  const availableCoupons: any[] = Array.isArray(coupons)
    ? coupons
    : (coupons as any)?.coupons ??
      (coupons as any)?.data ??
      [];

  const appliedCoupon = availableCoupons.find(
    (item: any) => (item._id ?? item.id) === appliedCouponId
  );

  const isCouponApplied = Boolean(appliedCouponId && appliedCoupon);

  // Price formatter
  const formatPrice = (amount: number) =>
    `₹${Number(amount ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Apply coupon
  const couponValidation = async (selectedCoupon: any) => {
    if (!logged) {
      toast.info("Please log in to apply a coupon.");
      return;
    }

    if (applyingCouponId) return;

    const couponId = selectedCoupon._id ?? selectedCoupon.id;

    if (!couponId) {
      toast.error("Invalid coupon. Please try another coupon.");
      return;
    }

    const categoryIds = [
      ...new Set(
        items
          .map((item: any) => {
            const category = item.category;

            if (typeof category === "string") {
              return category;
            }

            if (category && typeof category === "object") {
              return category._id?.toString();
            }

            return undefined;
          })
          .filter(
            (categoryId): categoryId is string =>
              typeof categoryId === "string" && Boolean(categoryId)
          )
      ),
    ];

    if (categoryIds.length === 0) {
      toast.error(
        "Unable to determine product categories. Please refresh your cart and try again."
      );
      return;
    }

    setApplyingCouponId(couponId);

    try {
      await dispatch(
        validateCoupon({
          couponID: couponId,
          subtotal: Number(shownSubtotal),
          category: categoryIds,
        })
      ).unwrap();

      setAppliedCouponId(couponId);

      toast.success(
        `Coupon ${selectedCoupon.code} applied successfully!`
      );
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Coupon validation failed. Please try again."
      );
    } finally {
      setApplyingCouponId(null);
    }
  };

  // Remove coupon
  const cancelCoupon = () => {
    setAppliedCouponId(null);
    toast.info("Coupon removed.");
  };

  // Update quantity
  const changeQuantity = async (
    itemId: string,
    quantity: number
  ) => {
    if (updatingId || clearingCart) return;

    // Guest cart
    if (!logged) {
      if (quantity < 1) {
        dispatch(setGuestItems(removeFromGuestCart(itemId)));
      } else {
        dispatch(setGuestItems(updateGuestQuantity(itemId, quantity)));
      }

      return;
    }

    setUpdatingId(itemId);

    try {
      await dispatch(
        updateCartItem({ itemId, quantity })
      ).unwrap();
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : "Could not update cart"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    if (clearingCart || items.length === 0 || updatingId) return;

    setClearingCart(true);

    try {
      if (logged) {
        await dispatch(deleteCart()).unwrap();
      } else {
        dispatch(setGuestItems([]));
      }

      setAppliedCouponId(null);
      setShowClearModal(false);

      toast.success("Cart cleared successfully!");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to clear cart. Please try again."
      );
    } finally {
      setClearingCart(false);
    }
  };

  // Discount calculations
  const displayedDiscount = isCouponApplied
    ? Number(discount ?? 0)
    : 0;

  const displayedFinalAmount = isCouponApplied
    ? Number(finalAmount ?? shownSubtotal)
    : Number(shownSubtotal ?? 0);

  // Checkout handler
  const checkoutHanlde = async () => {
    try {
      await dispatch(validateCart()).unwrap();

      navigate("/users/Checkout", {
        state: appliedCouponId
          ? { couponId: appliedCouponId }
          : null,
      });
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : ordererrors || "Cart validation failed. Please try again.",
        {
          position: "top-center",
          style: {
            fontSize: "18px",
            maxWidth: "500px",
            padding: "20px 24px",
            minHeight: "80px",
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-700">
            Nexora / Shopping Cart
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your Cart
          </h1>

          <p className="mt-2 text-gray-500">
            Review your items and get ready to checkout.
          </p>
        </div>

        {!items || items.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
              🛍️
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              You haven't added any products to your cart yet.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

            {/* Cart Items */}
            <section className="space-y-4 lg:col-span-2">

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Cart Items
                </h2>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
                    {shownTotalItems} items
                  </span>

                  {/* Clear Cart Button */}
                  <button
                    type="button"
                    onClick={() => setShowClearModal(true)}
                    disabled={clearingCart || !!updatingId}
                    className="
                      group inline-flex items-center gap-2
                      rounded-xl border border-red-100
                      bg-white px-4 py-2.5
                      text-sm font-semibold text-red-600
                      shadow-sm transition-all duration-200
                      hover:border-red-200 hover:bg-red-50
                      hover:shadow-md active:scale-95
                      disabled:cursor-not-allowed disabled:opacity-50
                    "
                  >
                    <svg
                      className="h-4 w-4 transition-transform group-hover:scale-110"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="m19 6-1 14H6L5 6" />
                      <path d="M10 11v5M14 11v5" />
                    </svg>

                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Individual Cart Items */}
              {items.map((item) => {
                const isUpdating = updatingId === item._id;

                const plusDisabled =
                  !!updatingId ||
                  item.stock === undefined ||
                  item.quantity >= item.stock;

                return (
                  <article
                    key={item._id}
                    className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:p-5"
                  >
                    <div className="flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 sm:w-36">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name ?? "Product"}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">
                          No image available
                        </span>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name ?? "Unavailable product"}
                          </h3>

                          {item.brand && (
                            <p className="mt-1 text-sm text-gray-500">
                              {item.brand}
                            </p>
                          )}

                          {item.color && (
                            <p className="mt-2 text-sm text-gray-600">
                              Color: {item.color}
                            </p>
                          )}

                          {item.size && (
                            <p className="mt-1 text-sm text-gray-600">
                              Size: {item.size}
                            </p>
                          )}
                        </div>

                        {item.price !== undefined && (
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price)}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Quantity
                          </p>

                          <div
                            className={`mt-1 inline-flex items-center overflow-hidden rounded-xl border border-gray-300 bg-white ${
                              isUpdating ? "opacity-60" : ""
                            }`}
                          >
                            <button
                              type="button"
                              aria-label={
                                item.quantity === 1
                                  ? "Remove item"
                                  : "Decrease quantity"
                              }
                              title={
                                item.quantity === 1
                                  ? "Remove item"
                                  : "Decrease quantity"
                              }
                              disabled={!!updatingId || clearingCart}
                              onClick={() =>
                                changeQuantity(
                                  item._id,
                                  item.quantity - 1
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-lg font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {item.quantity === 1 ? "🗑" : "−"}
                            </button>

                            <span className="flex h-9 w-10 items-center justify-center border-x border-gray-300 text-sm font-semibold text-gray-900">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              disabled={plusDisabled || clearingCart}
                              onClick={() =>
                                changeQuantity(
                                  item._id,
                                  item.quantity + 1
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-lg font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {item.lineTotal !== undefined && (
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              Item total
                            </p>

                            <p className="mt-1 font-bold text-gray-900">
                              {formatPrice(item.lineTotal)}
                            </p>
                          </div>
                        )}
                      </div>

                      {item.available === false && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                          {item.reason ?? "This product is unavailable"}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>

            {/* Order Summary */}
            <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4 border-b border-gray-200 pb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total items</span>
                  <span className="font-medium text-gray-900">
                    {shownTotalItems}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-green-700">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              {/* Available Coupons */}
              <div className="mt-6 border-b border-gray-200 pb-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Available Coupons
                  </h3>

                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                    {availableCoupons.length}
                  </span>
                </div>

                {isCouponApplied && appliedCoupon ? (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-green-200 bg-green-50">
                    <div className="flex items-start gap-3 p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 12v10H4V12" />
                          <path d="M2 7h20v5H2z" />
                          <path d="M12 22V7" />
                          <path d="M12 7H7.5a2.5 2.5 0 1 1 2.5-2.5C10 6 12 7 12 7Z" />
                          <path d="M12 7h4.5A2.5 2.5 0 1 0 14 4.5C10 6 12 7 12 7Z" />
                        </svg>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold tracking-wide text-green-900">
                            {appliedCoupon.code}
                          </p>

                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                            Applied
                          </span>
                        </div>

                        <p className="mt-1 text-sm leading-5 text-green-800">
                          {appliedCoupon.description ||
                            "Your coupon has been applied successfully."}
                        </p>

                        <p className="mt-2 text-sm font-semibold text-green-800">
                          You saved {formatPrice(displayedDiscount)}
                        </p>

                        <button
                          type="button"
                          onClick={cancelCoupon}
                          className="mt-3 text-sm font-semibold text-red-700 transition hover:text-red-900"
                        >
                          Remove coupon
                        </button>
                      </div>
                    </div>
                  </div>
                ) : availableCoupons.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {availableCoupons.map((coupon: any) => {
                      const couponId = coupon._id ?? coupon.id;
                      const isApplying = applyingCouponId === couponId;

                      return (
                        <div
                          key={couponId ?? coupon.code}
                          className="rounded-xl border border-gray-200 p-4 transition hover:border-red-200 hover:bg-red-50/30"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 font-bold text-red-700">
                                %
                              </div>

                              <div className="min-w-0">
                                <p className="break-words font-bold text-gray-900">
                                  {coupon.code ?? coupon.name ?? "Coupon"}
                                </p>

                                {coupon.description && (
                                  <p className="mt-1 text-sm leading-5 text-gray-500">
                                    {coupon.description}
                                  </p>
                                )}

                                {coupon.discountType && (
                                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-red-700">
                                    {coupon.discountType === "percentage"
                                      ? `${coupon.discountValue}% off`
                                      : `${formatPrice(coupon.discountValue)} off`}
                                  </p>
                                )}

                                {coupon.minOrderAmount > 0 && (
                                  <p className="mt-1 text-xs text-gray-500">
                                    Minimum order:{" "}
                                    {formatPrice(coupon.minOrderAmount)}
                                  </p>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              disabled={
                                Boolean(applyingCouponId) ||
                                !logged ||
                                !couponId
                              }
                              onClick={() => couponValidation(coupon)}
                              className="shrink-0 rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                              {isApplying ? "Applying..." : "Apply"}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {!logged && (
                      <p className="mt-2 text-xs text-gray-500">
                        Log in to apply available coupons.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                    No coupons available right now.
                  </p>
                )}

                {errors && !applyingCouponId && (
                  <p className="mt-3 text-sm text-red-600">
                    {errors}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(Number(shownSubtotal ?? 0))}
                  </span>
                </div>

                {isCouponApplied && (
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-green-700">
                      Coupon discount
                    </span>
                    <span className="font-semibold text-green-700">
                      −{formatPrice(displayedDiscount)}
                    </span>
                  </div>
                )}

                <div className="border-t border-dashed border-gray-200 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-gray-900">
                      Total
                    </span>

                    <div className="text-right">
                      {isCouponApplied &&
                        displayedFinalAmount <
                          Number(shownSubtotal ?? 0) && (
                          <p className="text-sm text-gray-400 line-through">
                            {formatPrice(Number(shownSubtotal ?? 0))}
                          </p>
                        )}

                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(displayedFinalAmount)}
                      </p>
                    </div>
                  </div>

                  {isCouponApplied && (
                    <p className="mt-2 text-right text-xs font-medium text-green-700">
                      Coupon savings included
                    </p>
                  )}
                </div>
              </div>

              {items.some((item) => item.available === false) && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  Some products are unavailable and are excluded from your subtotal.
                </p>
              )}

              {/* Checkout */}
              <button
                type="button"
                disabled={!shownTotalItems || clearingCart}
                onClick={checkoutHanlde}
                className="mt-6 w-full rounded-xl bg-red-700 px-5 py-3.5 font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="mt-4 block text-center text-sm font-medium text-gray-600 transition hover:text-red-700"
              >
                Continue Shopping
              </Link>

              <div className="mt-6 border-t border-gray-100 pt-5 text-center">
                <p className="text-xs leading-5 text-gray-400">
                  Secure checkout · Quality products · Easy shopping
                </p>
              </div>
            </aside>
          </div>
        )}

        {/* Clear Cart Confirmation Modal */}
        {showClearModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
            onClick={() => {
              if (!clearingCart) setShowClearModal(false);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="clear-cart-title"
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-3xl bg-white p-7 shadow-2xl duration-200"
            >
              {/* Warning icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16"
                  />
                </svg>
              </div>

              {/* Modal content */}
              <div className="mt-5 text-center">
                <h2
                  id="clear-cart-title"
                  className="text-2xl font-bold tracking-tight text-gray-900"
                >
                  Clear your cart?
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Are you sure you want to remove all {shownTotalItems} items
                  from your cart? This action cannot be undone.
                </p>
              </div>

              {/* Modal actions */}
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  disabled={clearingCart}
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={clearingCart}
                  onClick={handleClearCart}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {clearingCart ? "Clearing..." : "Yes, Clear Cart"}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Cart;
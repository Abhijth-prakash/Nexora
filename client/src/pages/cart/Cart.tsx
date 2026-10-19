
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getCart } from "../../redux/features/cartSlice";
import Navbar from "../../components/Navbar";

const Cart = () => {
  const dispatch = useAppDispatch();
  const { cartItems, subtotal, totalItems } = useAppSelector(
    (state) => state.cartData
  );

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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

        {!cartItems || cartItems.length === 0 ? (
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
            <section className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Cart Items
                </h2>

                <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
                  {totalItems} items
                </span>
              </div>

              {cartItems.map((item) => (
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
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Quantity
                        </p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {item.quantity}
                        </p>
                      </div>

                      {item.lineTotal !== undefined && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            Item total
                          </p>
                          <p className="mt-1 font-bold text-gray-900">
                            ₹{item.lineTotal.toLocaleString("en-IN")}
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
              ))}
            </section>

            <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4 border-b border-gray-200 pb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total items</span>
                  <span className="font-medium text-gray-900">
                    {totalItems}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-green-700">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="font-semibold text-gray-900">
                  Subtotal
                </span>

                <span className="text-2xl font-bold text-gray-900">
                  ₹{(subtotal ?? 0).toLocaleString("en-IN")}
                </span>
              </div>

              {cartItems.some((item) => item.available === false) && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  Some products are unavailable and are excluded from your subtotal.
                </p>
              )}

              <button
                type="button"
                disabled={!totalItems}
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
      </main>
    </div>
  );
};

export default Cart;


import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      handler: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => void;
      modal?: {
        ondismiss?: () => void;
      };
      theme?: {
        color: string;
      };
    }) => {
      open: () => void;
      close: () => void;
    };
  }
}

type PaymentMethod = "cod" | "wallet" | "razorpay";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    reservationId,
    expiresAt,
    finalAmount,
    razorpayOrderId,
    orderId,
    keyId,
    amount,
    currency,
  } = location.state ?? {};

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("razorpay");

  const [error, setError] = useState("");

  const openRazorpay = () => {
    const paymentOrderId = razorpayOrderId ?? orderId;

    if (!reservationId) {
      setError("No active reservation. Please start checkout again.");
      return;
    }

    console.log(paymentOrderId,"paymentOrderId")
    console.log(keyId,"keyId")
    console.log(amount,"amount")
    // if (!paymentOrderId || !keyId || amount == null || !currency) {
    //   setError(
    //     "Payment details are missing. Please return to checkout and try again."
    //   );
    //   return;
    // }

    if (!window.Razorpay) {
      setError("Razorpay could not load. Please refresh and try again.");
      return;
    }

    setError("");

    const razorpay = new window.Razorpay({
      key: keyId,
      amount,
      currency,
      name: "Nexora",
      description: "Complete your order",
      order_id: paymentOrderId,

      handler: (response) => {
        // Verify the payment signature on your backend
        // before marking the order as paid.
        console.log("Razorpay payment response:", response);
      },

      modal: {
        ondismiss: () => {
          console.log("Razorpay modal closed");
        },
      },

      theme: {
        color: "#b91c1c",
      },
    });

    razorpay.open();
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setError("");

    if (method === "razorpay") {
      // Open directly from the click handler for better browser compatibility.
      openRazorpay();
    }
  };

  const methods = [
    {
      id: "razorpay" as const,
      title: "Razorpay",
      description: "UPI, debit card, credit card & net banking",
      icon: "💳",
    },
    {
      id: "cod" as const,
      title: "Cash on Delivery",
      description: "Pay when your order arrives",
      icon: "📦",
    },
    {
      id: "wallet" as const,
      title: "Wallet",
      description: "Pay using your available wallet balance",
      icon: "👛",
    },
  ];

  return (
    <div className="min-h-[80vh] bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <button
            type="button"
            onClick={() => navigate("/users/cart")}
            className="mb-6 text-sm font-medium text-gray-500 transition hover:text-red-700"
          >
            ← Back to cart
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Choose your payment
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Select your preferred way to pay for your order.
          </p>

          <div className="mt-7 space-y-3">
            {methods.map((method) => {
              const selected = paymentMethod === method.id;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => handlePaymentMethodChange(method.id)}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-red-700 bg-red-50 ring-1 ring-red-700"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                    {method.icon}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-gray-900">
                      {method.title}
                    </span>

                    <span className="mt-1 block text-sm text-gray-500">
                      {method.description}
                    </span>
                  </span>

                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      selected ? "border-red-700" : "border-gray-300"
                    }`}
                  >
                    {selected && (
                      <span className="h-2.5 w-2.5 rounded-full bg-red-700" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {paymentMethod === "razorpay" && (
            <p className="mt-4 text-sm text-gray-500">
              Select Razorpay to open the secure payment window. If you closed
              it, select Razorpay again to reopen it.
            </p>
          )}

          {paymentMethod === "cod" && (
            <button
              type="button"
              onClick={() =>
                setError("Cash on Delivery is not connected to the backend yet.")
              }
              className="mt-7 w-full rounded-xl bg-red-700 px-5 py-3.5 font-semibold text-white transition hover:bg-red-800"
            >
              Place COD order
            </button>
          )}

          {paymentMethod === "wallet" && (
            <button
              type="button"
              onClick={() =>
                setError("Wallet payment is not connected to the backend yet.")
              }
              className="mt-7 w-full rounded-xl bg-red-700 px-5 py-3.5 font-semibold text-white transition hover:bg-red-800"
            >
              Pay with Wallet
            </button>
          )}

          <p className="mt-4 text-center text-xs text-gray-500">
            🔒 Secure checkout with Nexora
          </p>
        </section>

        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-gray-900">
            Order summary
          </h2>

          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">Total amount</span>

            <span className="text-2xl font-bold text-gray-900">
              ₹{Number(finalAmount ?? 0).toFixed(2)}
            </span>
          </div>

          <div className="my-5 border-t border-gray-100" />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Payment method</span>
              <span className="font-medium text-gray-900">
                {methods.find((method) => method.id === paymentMethod)?.title}
              </span>
            </div>

            {reservationId && (
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Reservation</span>
                <span className="max-w-[170px] truncate font-medium text-gray-900">
                  {reservationId}
                </span>
              </div>
            )}

            {expiresAt && (
              <div className="flex flex-col gap-1">
                <span className="text-gray-500">
                  Stock reservation expires
                </span>
                <span className="font-medium text-gray-900">
                  {new Date(expiresAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Payment;

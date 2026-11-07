import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  createRazorpayment,
  sendCodOtp,
  verifyPayment,
  payByWallet,
  recordPaymentFailure,
} from "../../redux/features/orderSlice";
import { markWalletStale } from "../../redux/features/walletSlice";
import CodOtpModal from "../../components/CodOtpModal";
import { toast } from "react-toastify";
import OrderSuccess from "../../components/OrderSuccess";
import { getCart } from "../../redux/features/cartSlice";

// how long the success animation plays before moving to the success page
const WALLET_SUCCESS_DELAY = 2500;

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (
    event: "payment.failed",
    callback: (response: RazorpayFailureResponse) => void
  ) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const Payment = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  
  const [cod,setCod] = useState(false)
   

  const {amount,razorpayOrderId,currency,keyId ,orderId}= useAppSelector(state=> state.orderData)
  const [success,setSuccess] = useState(false)
  const [codLoading, setCodLoading] = useState(false)
  const [walletStatus, setWalletStatus] = useState<"idle" | "loading" | "success">("idle")
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // clear the pending redirect if the user leaves this page some other way
  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);


  //razor pay page open function
const handleRazorpay = async () => {
  try {
    if (!orderId) {
      toast.error("Order ID is missing");
      return;
    }

    const paymentData = await dispatch(
      createRazorpayment(orderId)
    ).unwrap();

    if (!window.Razorpay) {
      alert("Razorpay failed to load. Please refresh and try again.");
      return;
    }

    if (
      !paymentData.keyId ||
      !paymentData.razorpayOrderId ||
      !paymentData.amount ||
      !paymentData.currency
    ) {
      alert("Payment details are missing.");
      return;
    }

    const options: RazorpayOptions = {
      key: paymentData.keyId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      name: "Nexora",
      order_id: paymentData.razorpayOrderId,

      handler: async (response: RazorpaySuccessResponse) => {
        try {
          await dispatch(
            verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              paymentMethod: "razorpay",
              orderId,
            })
          ).unwrap();

          navigate('/users/payment/sucess')
          dispatch(getCart())
        } catch (error) {
          console.error("Payment verification failed:", error);
          toast.error("Payment verification failed");
        }
      },

      modal: {
        ondismiss: () => {
          console.log("Payment popup closed");
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on(
      "payment.failed",
      (response: RazorpayFailureResponse) => {
        console.error("Payment failed:", response.error);
        toast.error(
          response.error.description || "Payment failed"
        );

        // tell the server this payment attempt failed.
        // fire-and-forget: a failure here must not break the page
        dispatch(
          recordPaymentFailure({
            orderId: orderId ?? undefined,
            razorpayOrderId:
              response.error.metadata?.order_id ?? paymentData.razorpayOrderId,
            razorpayPaymentId: response.error.metadata?.payment_id,
            error: {
              code: response.error.code,
              description: response.error.description,
              reason: response.error.reason,
            },
          })
        )
          .unwrap()
          .catch((err) =>
            console.error("Failed to record payment failure:", err)
          );
      }
    );

    razorpay.open();
  } catch (error) {
    console.error("Razorpay initialization failed:", error);
    toast.error("Unable to initialize Razorpay");
  }
};

  
//pay with wallet
const handleWallet = async () => {
  if (!orderId) {
    toast.error("Order ID is missing");
    return;
  }
  if (walletStatus !== "idle") return;

  setWalletStatus("loading");
  try {
    await dispatch(payByWallet(orderId)).unwrap();

    setWalletStatus("success");
    dispatch(markWalletStale());

    // keep the success animation on screen, then move to the success page.
    // getCart runs after navigating (same as the Razorpay flow) so a cleared
    // cart can't redirect the user away while the animation is playing.
    redirectTimer.current = setTimeout(() => {
      navigate('/users/payment/sucess');
      dispatch(getCart());
    }, WALLET_SUCCESS_DELAY);
  } catch (error) {
    console.error("Wallet payment failed:", error);
    setWalletStatus("idle");
    toast.error(
      typeof error === "string" ? error : "Wallet payment failed. Please try again."
    );
  }
};


const handleCod = async () => {
  if (!orderId || codLoading) return

  setCodLoading(true)
  try {
    await dispatch(sendCodOtp(orderId)).unwrap()
    setCod(true)
  } catch (err) {
    console.error(err)
    
  } finally {
    setCodLoading(false)
  }
}

//closing cod otp

const onCLose = ()=>{
  setCod(false)
}
  

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#EEF0F8] px-4 py-12 sm:px-6">
      {/* Animations used by the wallet payment overlay */}
      <style>{`
        @keyframes nx-fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes nx-pop {
          0% { transform: scale(0.6); opacity: 0 }
          60% { transform: scale(1.08); opacity: 1 }
          100% { transform: scale(1); opacity: 1 }
        }
        @keyframes nx-draw { to { stroke-dashoffset: 0 } }
        @keyframes nx-ring {
          0% { transform: scale(0.9); opacity: 0.6 }
          100% { transform: scale(1.6); opacity: 0 }
        }
        @keyframes nx-progress { from { width: 0% } to { width: 100% } }
        @keyframes nx-rise {
          from { transform: translateY(8px); opacity: 0 }
          to { transform: translateY(0); opacity: 1 }
        }
      `}</style>

      {/* Soft ambient colour behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#B9B2FF] opacity-40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-20 h-[26rem] w-[26rem] rounded-full bg-[#9ED8F5] opacity-40 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        {/* Heading */}
        <div className="mb-8 px-1">
          <h1 className="text-[2rem] font-semibold leading-tight tracking-tight text-[#12142B]">
            How would you like
            <br />
            to pay?
          </h1>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-[#5C6078]">
            Pick a method to finish your Nexora order. You can pay now or when it arrives.
          </p>
        </div>

        {/* Primary: online payment */}
        <div className="relative overflow-hidden rounded-[28px] bg-[#12142B] p-6 text-white shadow-[0_24px_60px_-20px_rgba(18,20,43,0.55)] sm:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(124,108,255,0.65),rgba(124,108,255,0)_70%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(86,190,240,0.35),rgba(86,190,240,0)_70%)]"
          />

          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#D9D5FF] ring-1 ring-white/15">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7CF0C0]" />
                Instant confirmation
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-white/70"
              >
                <rect x="2" y="5" width="20" height="14" rx="3" />
                <path d="M2 10h20" />
                <path d="M6 15h3" />
              </svg>
            </div>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight">Pay online</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              UPI, cards, net banking and wallets, handled securely by Razorpay.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {["UPI", "Cards", "Net banking", "Wallets"].map((m) => (
                <span
                  key={m}
                  className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/80 ring-1 ring-white/12"
                >
                  {m}
                </span>
              ))}
            </div>

            <button
              onClick={handleRazorpay}
              disabled={walletStatus !== "idle"}
              className="group mt-7 flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 text-[15px] font-semibold text-[#12142B] transition hover:bg-[#F1EEFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B9B2FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12142B] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>Pay with Razorpay</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#12142B] text-white transition group-hover:translate-x-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Wallet */}
        <div className="mt-4 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-[0_8px_30px_-12px_rgba(18,20,43,0.18)] backdrop-blur sm:p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDF5EA] text-[#14925F]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9z" />
                <path d="M16 13h2" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-semibold text-[#12142B]">Nexora Wallet</h2>
              <p className="mt-0.5 text-sm text-[#5C6078]">
                Pay instantly using your wallet balance.
              </p>
            </div>
          </div>

          <button
            onClick={handleWallet}
            disabled={walletStatus !== "idle"}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#12142B]/[0.06] px-5 py-3 text-sm font-semibold text-[#12142B] transition hover:bg-[#12142B] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12142B] focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#12142B]/[0.06] disabled:hover:text-[#12142B]"
          >
            Pay with wallet
          </button>
        </div>

        {/* Secondary: cash on delivery */}
        <div className="mt-4 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-[0_8px_30px_-12px_rgba(18,20,43,0.18)] backdrop-blur sm:p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E4E1FF] text-[#4B3FD0]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="12" cy="12" r="2.5" />
                <path d="M6 12h.01M18 12h.01" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-semibold text-[#12142B]">Cash on delivery</h2>
              <p className="mt-0.5 text-sm text-[#5C6078]">
                Pay at your door. We'll confirm with an OTP first.
              </p>
            </div>
          </div>

          <button
            onClick={handleCod}
            disabled={codLoading || walletStatus !== "idle"}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#12142B]/[0.06] px-5 py-3 text-sm font-semibold text-[#12142B] transition hover:bg-[#12142B] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12142B] focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#12142B]/[0.06] disabled:hover:text-[#12142B]"
          >
            {codLoading && (
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {codLoading ? "Sending OTP..." : "Place order with COD"}
          </button>
        </div>

        {/* Trust line */}
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-[#6B6F86]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Payments are encrypted. Nexora never stores your card details.
        </p>
      </div>

      {success && <OrderSuccess></OrderSuccess>}

      {cod&& orderId&&  <CodOtpModal orderId={orderId} onClose={onCLose} email=""></CodOtpModal>}

      {/* Wallet payment overlay: covers the whole screen so nothing can be clicked */}
      {walletStatus !== "idle" && (
        <div
          role="alertdialog"
          aria-live="assertive"
          aria-busy={walletStatus === "loading"}
          className="fixed inset-0 z-[100] flex cursor-wait items-center justify-center bg-[#12142B]/85 px-4 backdrop-blur-sm"
          style={{ animation: "nx-fade-in 200ms ease-out" }}
        >
          <div
            className="w-full max-w-xs rounded-3xl bg-white p-8 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
            style={{ animation: "nx-pop 400ms ease-out" }}
          >
            {walletStatus === "loading" ? (
              <>
                <div className="mx-auto flex h-24 w-24 items-center justify-center">
                  <svg
                    className="h-14 w-14 animate-spin text-[#12142B]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-20"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-90"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#12142B]">
                  Processing payment
                </h3>
                <p className="mt-1 text-sm text-[#5C6078]">
                  Please don't close or refresh this page.
                </p>
              </>
            ) : (
              <>
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  {/* expanding ring */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[#14925F]/30"
                    style={{ animation: "nx-ring 1100ms ease-out 300ms 2 both" }}
                  />
                  <svg
                    viewBox="0 0 100 100"
                    className="relative h-24 w-24"
                    fill="none"
                    stroke="#14925F"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      strokeDasharray="277"
                      strokeDashoffset="277"
                      style={{ animation: "nx-draw 600ms ease-out forwards" }}
                    />
                    <path
                      d="M30 52 L44 66 L71 36"
                      strokeDasharray="60"
                      strokeDashoffset="60"
                      style={{ animation: "nx-draw 400ms ease-out 550ms forwards" }}
                    />
                  </svg>
                </div>

                <h3
                  className="mt-4 text-lg font-semibold text-[#12142B]"
                  style={{ animation: "nx-rise 400ms ease-out 700ms both" }}
                >
                  Payment successful
                </h3>
                <p
                  className="mt-1 text-sm text-[#5C6078]"
                  style={{ animation: "nx-rise 400ms ease-out 850ms both" }}
                >
                  Taking you to your order...
                </p>

                {/* progress bar fills over the same time as the redirect delay */}
                <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-[#12142B]/10">
                  <div
                    className="h-full rounded-full bg-[#14925F]"
                    style={{
                      animation: `nx-progress ${WALLET_SUCCESS_DELAY}ms linear forwards`,
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
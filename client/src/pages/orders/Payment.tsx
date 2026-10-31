import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createRazorpayment, sendCodOtp, verifyPayment } from "../../redux/features/orderSlice";
import CodOtpModal from "../../components/CodOtpModal";
import { toast } from "react-toastify";
import OrderSuccess from "../../components/OrderSuccess";
import { getCart } from "../../redux/features/cartSlice";




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
      }
    );

    razorpay.open();
  } catch (error) {
    console.error("Razorpay initialization failed:", error);
    toast.error("Unable to initialize Razorpay");
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
              className="group mt-7 flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 text-[15px] font-semibold text-[#12142B] transition hover:bg-[#F1EEFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B9B2FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12142B] active:scale-[0.99]"
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
            disabled={codLoading}
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
    </div>
  );
};

export default Payment;
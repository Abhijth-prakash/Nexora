import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { verifyPayment } from "../../redux/features/orderSlice";

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

interface PaymentLocationState {
  reservationId: string;
  expiresAt: string;
  finalAmount: number;
  razorpayOrderId: string;
  orderId: string;
  keyId: string;
  amount: number;
  currency: string;
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  

  const state = location.state as PaymentLocationState | null;

  const {
    reservationId,
    expiresAt,
    finalAmount,
    razorpayOrderId,
    orderId,
    keyId,
    amount,
    currency,
  } = state ?? ({} as Partial<PaymentLocationState>);

  // If the page is opened directly (no state), send the user back
  useEffect(() => {
    if (!razorpayOrderId) {
      navigate(-1);
    }
  }, [razorpayOrderId, navigate]);

  const handlePayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay failed to load. Please refresh and try again.");
      return;
    }

    if (!keyId || !razorpayOrderId || !amount || !currency) {
      alert("Payment details are missing.");
      return;
    }

    const options: RazorpayOptions = {
      key: keyId,
      amount: amount, 
      currency: currency,
      name: "nexora",
      order_id: razorpayOrderId, 
    handler: async (response: RazorpaySuccessResponse) => {
  console.log("success", response);

  try {
    await dispatch(
      verifyPayment({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      })
    ).unwrap();

    navigate("/order-success");
  } catch (error) {
    console.log("verification failed", error);
  
  }
},
      modal: {
        ondismiss: () => {
          console.log("Payment popup closed");
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", (response: RazorpayFailureResponse) => {
      console.log("payment failed", response.error);
    });

    razorpay.open();
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 px-4 py-10 sm:px-6">
      <button
        onClick={handlePayment}
        className="rounded bg-black px-6 py-3 text-white"
      >
        Pay now
      </button>
    </div>
  );
};

export default Payment;
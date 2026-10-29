import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createRazorpayment, sendCodOtp, verifyPayment } from "../../redux/features/orderSlice";
import CodOtpModal from "../../components/CodOtpModal";
import { toast } from "react-toastify";
import OrderSuccess from "../../components/OrderSuccess";


//states coming from checkout
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



  




  //razor pay page open function

const handleRazorpay = async () => {
  try {
    if (!orderId) {
      toast.error("Order ID is missing");
      return;
    }

    // Wait until the backend returns Razorpay order details
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

          setSuccess(true);
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

  


  const handleCod = async ()=>{
    if(orderId){
      console.log(orderId)
      await dispatch(sendCodOtp(orderId)).unwrap()
      setCod(true)
    }
   
  }


  return (
    <div className="min-h-[80vh] bg-gray-50 px-4 py-10 sm:px-6">


         <button
        onClick={handleRazorpay}
        className="rounded bg-black px-6 py-3 text-white"
      >
        Razorpay
      </button>
  
  {success && <OrderSuccess></OrderSuccess>}


    {cod&& orderId&&  <CodOtpModal orderId={orderId} email=""></CodOtpModal>}
      <button
        onClick={handleCod}
        className="rounded bg-black px-6 py-3 text-white"
      >
        cod
      </button>
    </div>
  );
};

export default Payment;
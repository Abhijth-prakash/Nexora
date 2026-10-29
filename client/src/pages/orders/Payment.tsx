import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createRazorpayment, sendCodOtp, verifyPayment } from "../../redux/features/orderSlice";
import CodOtpModal from "../../components/CodOtpModal";
import { toast } from "react-toastify";


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


//     const logging= ()=>{
// console.log('amount',amount) 
//      console.log('razorpayOrderId',razorpayOrderId) 
//      console.log('currency',currency) 
//      console.log('keyId',keyId) 
//     }
  




  //razor pay page open function

const handleRazorpay = async () => {

  try{
    if(orderId){
       await dispatch(createRazorpayment(orderId)).unwrap()
    }
      // logging()

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

      //response from razorpay
    handler: async (response: RazorpaySuccessResponse) => {
  console.log("success", response);


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

  }catch(error){
    toast.error('razor pay unaviable')
  }
   
  };

  


  const handleCod = async ()=>{
    if(orderId){
      console.log(orderId)
      await dispatch(sendCodOtp(orderId)).unwrap()
      setCod(true)
    }
   
  }

// const paymentOrder = await dispatch(
//   createPaymentOrder({
//     reservationId: result.reservationId,
//     addressId: selectedAddress,
//   })
// ).unwrap();



  return (
    <div className="min-h-[80vh] bg-gray-50 px-4 py-10 sm:px-6">


         <button
        onClick={handleRazorpay}
        className="rounded bg-black px-6 py-3 text-white"
      >
        Razorpay
      </button>



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
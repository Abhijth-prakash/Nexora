import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { verifyPayment } from "../redux/features/orderSlice";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

const getErrorMessage = (err: unknown, fallback: string) =>
  typeof err === "string" ? err : fallback;


export type Props = {
    orderId:string
    email:string
}

const CodOtpModal = ({orderId}:Props) => {



const dispatch = useAppDispatch()


  const isOpen = true;
  const email = "test@example.com";
  const onClose = () => console.log("close clicked");


  const onVerify = async (otp: string) => {
    try{
         await dispatch(
              verifyPayment({
                razorpay_payment_id: "",
                razorpay_order_id: "",
                razorpay_signature: "",
                paymentMethod:"cod",
                otp:otp,
                orderId:orderId
              })
            ).unwrap();
        
    }catch(error){

    }
  };



  const onResend = async () => {
    console.log("resend otp");
  };

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // reset everything each time the modal opens
  useEffect(() => {
    if (!isOpen) return;
    setDigits(Array(OTP_LENGTH).fill(""));
    setSecondsLeft(RESEND_SECONDS);
    setError("");
    setTimeout(() => inputsRef.current[0]?.focus(), 50);
  }, [isOpen]);

  // resend countdown
  useEffect(() => {
    if (!isOpen || secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [isOpen, secondsLeft]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError("");
    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    const otp = digits.join("");
    if (otp.length !== OTP_LENGTH) {
      setError("Please enter the 6 digit OTP");
      return;
    }
    try {
      setVerifying(true);
      setError("");
      await onVerify(otp);
    } catch (err) {
      setError(getErrorMessage(err, "Invalid or expired OTP"));
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return;
    try {
      setResending(true);
      setError("");
      await onResend();
      setDigits(Array(OTP_LENGTH).fill(""));
      setSecondsLeft(RESEND_SECONDS);
      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to resend OTP"));
    } finally {
      setResending(false);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-gray-900">
          Confirm your order
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter the 6 digit OTP sent to{" "}
          <span className="font-medium">{email ?? "your email"}</span> to
          confirm your Cash on Delivery order.
        </p>

        <div className="mt-6 flex justify-between gap-2">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className="h-12 w-12 rounded-md border border-gray-300 text-center text-xl font-semibold focus:border-black focus:outline-none"
            />
          ))}
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={verifying}
          className="mt-6 w-full rounded-md bg-black py-3 text-white disabled:opacity-60"
        >
          {verifying ? "Verifying..." : "Verify & confirm order"}
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          {secondsLeft > 0 ? (
            <span>
              Resend OTP in {minutes}:{seconds}
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="font-medium text-blue-600 hover:underline disabled:opacity-60"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodOtpModal;
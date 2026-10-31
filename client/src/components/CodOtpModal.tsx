
import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  LockKeyhole,
  ArrowRight,
  RefreshCw,
  X,
  Mail,
  CheckCircle2,
} from "lucide-react";

import { useAppDispatch } from "../redux/hooks";
import {
  sendCodOtp,
  verifyCodOtp,
} from "../redux/features/orderSlice";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getCart } from "../redux/features/cartSlice";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export type Props = {
  orderId: string;
  email: string;
  onClose: () => void;
};

const CodOtpModal = ({ orderId, email, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [digits, setDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );

  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input when modal mounts
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Resend countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const id = setTimeout(
      () => setSecondsLeft((s) => s - 1),
      1000
    );

    return () => clearTimeout(id);
  }, [secondsLeft]);

  // Verify OTP
  const onVerify = async (otp: string) => {
    try {
      const result = await dispatch(
        verifyCodOtp({
          otp,
          orderId,
        })
      ).unwrap();

      toast.success("COD order confirmed successfully!");

      onClose();

      navigate("/users/payment/sucess");
      dispatch(getCart())
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : "Invalid or expired OTP";

      setError(message);
      throw error;
    }
  };

  // Handle digit changes
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

  // Keyboard navigation
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === "Backspace" &&
      !digits[index] &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (
      e.key === "ArrowRight" &&
      index < OTP_LENGTH - 1
    ) {
      inputsRef.current[index + 1]?.focus();
    }

    if (e.key === "Enter") {
      handleVerify();
    }
  };

  // Paste complete OTP
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill("");

    pasted.split("").forEach((digit, index) => {
      next[index] = digit;
    });

    setDigits(next);
    setError("");

    inputsRef.current[
      Math.min(pasted.length, OTP_LENGTH - 1)
    ]?.focus();
  };

  // Submit OTP
  const handleVerify = async () => {
    const otp = digits.join("");

    if (otp.length !== OTP_LENGTH) {
      setError("Please enter all 6 digits of your OTP.");
      return;
    }

    try {
      setVerifying(true);
      setError("");

      await onVerify(otp);
    } catch {
      // Error is handled inside onVerify
    } finally {
      setVerifying(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return;

    try {
      setResending(true);
      setError("");

      await dispatch(sendCodOtp(orderId)).unwrap();

      setDigits(Array(OTP_LENGTH).fill(""));
      setSecondsLeft(RESEND_SECONDS);

      inputsRef.current[0]?.focus();

      toast.success("A new OTP has been sent.");
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : "Failed to resend OTP";

      setError(message);
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const progress = (secondsLeft / RESEND_SECONDS) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/60 px-4 py-8 backdrop-blur-sm">

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">

        {/* Dark Header */}
        <div className="relative overflow-hidden bg-gray-950 px-6 pb-9 pt-8 text-white sm:px-8">

          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border border-white/10" />
          <div className="absolute -right-4 -top-8 h-32 w-32 rounded-full border border-white/10" />

          <button
            onClick={onClose}
            disabled={verifying}
            aria-label="Close modal"
            className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-2 text-gray-300 transition hover:bg-white/20 hover:text-white disabled:opacity-50"
          >
            <X size={18} />
          </button>

          <div className="relative z-10">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
              <ShieldCheck
                size={29}
                strokeWidth={1.7}
                className="text-white"
              />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
              Secure verification
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Confirm your order
            </h2>

            <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">
              One final step! Verify your OTP to confirm your
              Cash on Delivery order.
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 pb-7 pt-7 sm:px-8">

          {/* Email Information */}
          <div className="mb-7 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <Mail size={18} className="text-gray-700" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                OTP sent to
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                {email || "Your registered email"}
              </p>
            </div>

            <CheckCircle2
              size={18}
              className="ml-auto shrink-0 text-green-600"
            />
          </div>

          {/* OTP Inputs */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-bold text-gray-900">
                Enter verification code
              </label>

              <span className="text-xs font-medium text-gray-400">
                6-digit code
              </span>
            </div>

            <div className="flex justify-between gap-2 sm:gap-3">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  disabled={verifying}
                  onChange={(e) =>
                    handleChange(index, e.target.value)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(index, e)
                  }
                  onPaste={handlePaste}
                  className={`h-12 min-w-0 flex-1 rounded-xl border text-center text-xl font-bold text-gray-900 outline-none transition-all sm:h-14 ${
                    error
                      ? "border-red-300 bg-red-50 focus:border-red-500"
                      : digit
                      ? "border-gray-950 bg-gray-50"
                      : "border-gray-200 bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
                  }`}
                />
              ))}
            </div>

            {error && (
              <p className="mt-3 flex items-center gap-2 text-xs font-medium text-red-600">
                <X size={14} />
                {error}
              </p>
            )}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={verifying || digits.join("").length !== OTP_LENGTH}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-950 py-4 text-sm font-bold text-white shadow-lg shadow-gray-950/10 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {verifying ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Verifying OTP...
              </>
            ) : (
              <>
                <LockKeyhole size={17} />
                Verify & Confirm Order
                <ArrowRight size={17} />
              </>
            )}
          </button>

          {/* Resend Section */}
          <div className="mt-7 border-t border-gray-100 pt-5">
            <div className="flex flex-col items-center gap-3">

              <p className="text-xs text-gray-500">
                Didn't receive the verification code?
              </p>

              {secondsLeft > 0 ? (
                <div className="w-full max-w-[220px]">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">
                      Resend available in
                    </span>

                    <span className="text-xs font-bold tabular-nums text-gray-900">
                      {minutes}:{seconds}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gray-950 transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending || verifying}
                  className="inline-flex items-center gap-2 text-sm font-bold text-gray-950 transition hover:text-gray-600 disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={resending ? "animate-spin" : ""}
                  />

                  {resending ? "Sending new OTP..." : "Resend OTP"}
                </button>
              )}
            </div>
          </div>

          {/* Security Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <LockKeyhole size={12} />
            Your verification is secure and encrypted.
          </div>

        </div>
      </div>
    </div>
  );
};

export default CodOtpModal;

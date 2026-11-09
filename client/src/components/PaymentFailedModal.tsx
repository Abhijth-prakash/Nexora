interface Props {
  type: "failed" | "cancelled" | "verification";
  message: string;
  retrying: boolean;
  onRetry: () => void;
  onClose: () => void;
  onViewOrders?: () => void;
}

const titles = {
  failed: "Payment failed",
  cancelled: "Payment cancelled",
  verification: "We couldn't confirm your payment",
};

const PaymentFailedModal = ({
  type,
  message,
  retrying,
  onRetry,
  onClose,
  onViewOrders,
}: Props) => {
  const isVerification = type === "verification";

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="pay-fail-title"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#12142B]/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6M9 9l6 6" />
          </svg>
        </div>

        <h3
          id="pay-fail-title"
          className="mt-4 text-lg font-semibold text-[#12142B]"
        >
          {titles[type]}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#5C6078]">{message}</p>

        <div className="mt-6 flex flex-col gap-2">
          {isVerification ? (
            <button
              onClick={onViewOrders}
              className="w-full rounded-xl bg-[#12142B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#23264a]"
            >
              Check my orders
            </button>
          ) : (
            <button
              onClick={onRetry}
              disabled={retrying}
              className="w-full rounded-xl bg-[#12142B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#23264a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {retrying ? "Opening payment..." : "Try again"}
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-[#12142B]/[0.06] px-5 py-3 text-sm font-semibold text-[#12142B] transition hover:bg-[#12142B]/10"
          >
            {isVerification ? "Close" : "Choose another method"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedModal;
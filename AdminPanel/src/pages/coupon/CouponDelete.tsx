import { useState } from "react";
import { toast } from 'react-toastify'
import {
  deleteCoupon,
  getCoupons,
} from "../../redux/features/CouponSlice";
import { useAppDispatch } from "../../redux/hooks";

export type props = {
  id: string;
  removeClose: () => void;
};

const CouponDelete = ({ id, removeClose }: props) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const dataHandle = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const limit = 10;
      const search = "";
      const filter = "";
      const page = 1;

      await dispatch(deleteCoupon(id)).unwrap();

      toast.success("Coupon deleted successfully!");

      await dispatch(
        getCoupons({ page, limit, search, filter })
      ).unwrap();

      removeClose();
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to delete coupon. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={removeClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-coupon-title"
        className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3m0 4h.01M10.3 3.86 1.82 18.14A2 2 0 0 0 3.53 21h16.94a2 2 0 0 0 1.71-2.86L13.71 3.86a2 2 0 0 0-3.41 0Z"
            />
          </svg>
        </div>

        {/* Modal content */}
        <div className="mt-5 text-center">
          <h2
            id="delete-coupon-title"
            className="text-xl font-bold tracking-tight text-slate-900"
          >
            Delete Coupon?
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Are you sure you want to delete this coupon? This action
            cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={removeClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={dataHandle}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
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
                  d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
                />
              </svg>
            )}
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponDelete
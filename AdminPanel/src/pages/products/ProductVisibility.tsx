import { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import {
  getProducts,
  visiblityToggle,
} from "../../redux/features/ProductSlice";
import { toast } from "react-toastify";

export type props = {
  CloseVisble: () => void;
  visible: boolean;
  id: string;
};

const ProductVisibility = ({ CloseVisble, visible, id }: props) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const visibleHandle = async () => {
    try {
      setLoading(true);

      await dispatch(visiblityToggle(id)).unwrap();

      const page = 1;
      const search = "";
      const filter = "";
      const sort = "";

      dispatch(getProducts({ page, search, filter, sort }));

      toast.success(
        visible
          ? "Product hidden successfully!"
          : "Product made visible successfully!"
      );

      CloseVisble();
    } catch (error) {
      toast.error("Failed to update product visibility. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#eee8e5] bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-[#f0eeec] px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                visible ? "bg-amber-50" : "bg-emerald-50"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={visible ? "text-amber-600" : "text-emerald-600"}
              >
                {visible ? (
                  <>
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <circle cx="8" cy="12" r="2" />
                    <path d="M13 10h4M13 14h4" />
                  </>
                ) : (
                  <>
                    <path d="M12 3l9 5v4c0 5-3.8 8.5-9 9-5.2-.5-9-4-9-9V8l9-5z" />
                    <path d="m9 12 2 2 4-4" />
                  </>
                )}
              </svg>
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-bold text-[#262322]">
                {visible ? "Hide product?" : "Make product visible?"}
              </h2>
              <p className="mt-1 text-sm text-[#89817d]">
                Confirm your visibility change
              </p>
            </div>

            <button
              type="button"
              onClick={CloseVisble}
              disabled={loading}
              aria-label="Close dialog"
              className="rounded-lg p-2 text-[#89817d] transition hover:bg-[#f7f4f2] hover:text-[#262322] disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-[#625b57]">
            {visible
              ? "This product will no longer be visible to customers in your store. You can make it visible again later."
              : "This product will become visible to customers in your store."}
          </p>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-[#eee8e5] bg-[#fdfaf9] p-4">
            <div>
              <p className="text-sm font-semibold text-[#262322]">
                Current status
              </p>
              <p className="mt-1 text-xs text-[#89817d]">
                Product visibility
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                visible
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  visible ? "bg-emerald-500" : "bg-gray-400"
                }`}
              />
              {visible ? "ON" : "OFF"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#f0eeec] bg-[#fdfcfb] px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={CloseVisble}
            disabled={loading}
            className="rounded-xl border border-[#e9e4e1] px-5 py-3 text-sm font-semibold text-[#625b57] transition hover:bg-[#f7f4f2] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={visibleHandle}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff624d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#eb503c] focus:outline-none focus:ring-4 focus:ring-[#ff624d]/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}

            {loading
              ? "Updating..."
              : visible
                ? "Yes, hide product"
                : "Yes, make visible"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductVisibility;

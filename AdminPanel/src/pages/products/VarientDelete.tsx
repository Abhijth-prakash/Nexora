
import { toast } from "react-toastify"
import { deleteVarient, getProductbyid } from "../../redux/features/ProductSlice"
import { useAppDispatch } from "../../redux/hooks"

export type props = {
  Close: () => void
  id: string
  variantId: string
}

const VarientDelete = ({ Close, id, variantId }: props) => {
  const dispatch = useAppDispatch()

  const handle = async () => {
    try {
      await dispatch(deleteVarient({ id, variantId })).unwrap()
      await dispatch(getProductbyid(id))

      toast.success("Variant deleted successfully!")
      Close()
    } catch (error) {
      console.log(error)
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to delete variant. Please try again."
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/50 p-3 backdrop-blur-[2px] sm:p-5">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-variant-title"
        aria-describedby="delete-variant-description"
        className="w-full max-w-md overflow-hidden rounded-xl border border-[#E4E0DD] bg-white shadow-2xl"
      >
        {/* Security banner */}
        <div className="bg-[#101010] px-3 py-2 text-center text-[9px] font-medium uppercase tracking-[0.12em] text-white/80 sm:tracking-[0.16em]">
          Nexora Admin Portal | Secure Store Management
        </div>

        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#E4E0DD] px-5 py-4 sm:px-6">
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-bold tracking-tight text-[#111111]">
                Nexora
              </h2>
              <span className="text-[10px] font-medium uppercase tracking-wider text-[#8A756B]">
                Admin
              </span>
            </div>
            <p className="mt-1 text-sm text-[#8A756B]">
              Variant management
            </p>
          </div>

          <button
            type="button"
            onClick={Close}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E4E0DD] text-2xl leading-none text-[#8A756B] transition hover:border-[#F87552] hover:bg-[#FFF1ED] hover:text-[#F87552]"
          >
            &times;
          </button>
        </header>

        {/* Confirmation content */}
        <div className="px-5 py-7 sm:px-6 sm:py-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
              className="h-7 w-7"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.1a2 2 0 0 0-3.4 0Z"
              />
            </svg>
          </div>

          <div className="mt-5 text-center">
            <h3
              id="delete-variant-title"
              className="text-lg font-bold tracking-tight text-[#111111]"
            >
              Delete this variant?
            </h3>

            <p
              id="delete-variant-description"
              className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#8A756B]"
            >
              Are you sure you want to delete this variant? This action cannot
              be undone, and its associated images will also be removed.
            </p>
          </div>

          <div className="mt-5 rounded-md border border-red-100 bg-red-50/70 px-4 py-3">
            <p className="text-xs leading-relaxed text-red-700">
              <span className="font-semibold">Warning:</span> The variant will
              be permanently removed from your product.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col-reverse gap-3 border-t border-[#E4E0DD] bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={Close}
            className="rounded-md border border-[#E4E0DD] px-5 py-2.5 text-sm font-medium text-[#5F514A] transition hover:bg-[#F7F6F4]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handle}
            className="rounded-md bg-[#F87552] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E96543] focus:outline-none focus:ring-2 focus:ring-[#F87552]/30 focus:ring-offset-2"
          >
            Yes, delete variant
          </button>
        </footer>
      </div>
    </div>
  )
}

export default VarientDelete

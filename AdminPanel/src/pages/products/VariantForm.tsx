
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-toastify"
import {
  variantValidation,
  type VariantFormData,
} from "../../utils/validation"
import { useAppDispatch } from "../../redux/hooks"
import {
  addVarient,
  getProductbyid,
} from "../../redux/features/ProductSlice"

export type props = {
  onClose: () => void
  id: string
  category: string
}

const SIZES = ["S", "M", "L", "XL", "XXL"]

const VariantForm = ({ onClose, id, category }: props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof variantValidation>, unknown, VariantFormData>({
    resolver: zodResolver(variantValidation),
  })

  const [previmage, setPrevimage] = useState<string[]>([])
  const [images, setImages] = useState<File[]>([])
  const [imageError, setImageError] = useState("")

  const dispatch = useAppDispatch()

  const isClothing = category.toLowerCase() === "clothing"

  // Image preview logic
  const fileHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])

    setImages((prev) => [...prev, ...files])
    setImageError("")

    files.forEach((file) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = (e) => {
        const result = e.target?.result

        if (typeof result === "string") {
          setPrevimage((prev) => [...prev, result])
        }
      }
    })

    e.target.value = ""
  }

  const dataHandle = async (values: VariantFormData) => {
    if (images.length === 0) {
      setImageError("At least one image is required")
      toast.error("Please upload at least one image")
      return
    }

    if (images.length > 5) {
      setImageError("Maximum 5 images allowed")
      toast.error("You can upload a maximum of 5 images")
      return
    }

    const formData = new FormData()

    formData.append("color", values.color)
    formData.append("price", String(values.price))
    formData.append("stock", String(values.stock))
    formData.append("rating", String(values.rating))

    if (isClothing && values.size.length) {
      formData.append("size", JSON.stringify(values.size))
    }

    images.forEach((file) => formData.append("images", file))

    try {
      await dispatch(addVarient({ data: formData, id })).unwrap()
      await dispatch(getProductbyid(id))

      toast.success("Variant added successfully!")
      onClose()
    } catch (error) {
      console.error(error)

      toast.error(
        typeof error === "string"
          ? error
          : "Failed to add variant. Please try again."
      )
    }
  }

  const inputClass =
    "w-full rounded-md border border-[#E4E0DD] bg-white px-3 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#B5AAA4] focus:border-[#F87552] focus:ring-2 focus:ring-[#F87552]/15"

  const labelClass =
    "mb-1.5 block text-xs font-semibold text-[#111111]"

  const errorClass = "mt-1.5 text-xs text-red-600"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/50 p-3 backdrop-blur-[2px] sm:p-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="variant-modal-title"
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[#E4E0DD] bg-white shadow-2xl"
      >
        {/* Security banner */}
        <div className="shrink-0 bg-[#101010] px-3 py-2 text-center text-[9px] font-medium uppercase tracking-[0.12em] text-white/80 sm:tracking-[0.16em]">
          Nexora Admin Portal | Secure Store Management
        </div>

        {/* Fixed header */}
        <header className="flex shrink-0 items-center justify-between border-b border-[#E4E0DD] bg-white px-5 py-4 sm:px-8">
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
              Add a new product variant
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E4E0DD] text-2xl leading-none text-[#8A756B] transition hover:border-[#F87552] hover:bg-[#FFF1ED] hover:text-[#F87552]"
          >
            &times;
          </button>
        </header>

        {/* Scrollable form body */}
        <form
          onSubmit={handleSubmit(dataHandle)}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8"
        >
          <div className="space-y-6">
            {/* Variant information */}
            <section>
              <div className="mb-3">
                <h3
                  id="variant-modal-title"
                  className="text-sm font-semibold text-[#111111]"
                >
                  Variant information
                </h3>

                <p className="mt-1 text-xs text-[#8A756B]">
                  Configure the color, pricing, and inventory for this variant.
                </p>
              </div>

              <div className="mb-4 flex items-center justify-between rounded-md border border-[#E4E0DD] bg-[#F7F6F4] px-4 py-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#8A756B]">
                    Product category
                  </p>

                  <p className="mt-1 text-sm font-semibold capitalize text-[#111111]">
                    {category}
                  </p>
                </div>

                <span className="rounded-md border border-[#F87552]/20 bg-[#FFF1ED] px-3 py-1.5 text-xs font-semibold text-[#E96543]">
                  New variant
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Color</label>

                  <input
                    type="text"
                    placeholder="e.g. Black"
                    {...register("color")}
                    className={inputClass}
                  />

                  {errors.color && (
                    <p className={errorClass}>
                      {errors.color.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Price (₹)</label>

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter price"
                    {...register("price")}
                    className={inputClass}
                  />

                  {errors.price && (
                    <p className={errorClass}>
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Stock quantity</label>

                  <input
                    type="number"
                    placeholder="Available units"
                    {...register("stock")}
                    className={inputClass}
                  />

                  {errors.stock && (
                    <p className={errorClass}>
                      {errors.stock.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Rating (0–5)</label>

                  <input
                    type="number"
                    min={0}
                    max={5}
                    step="0.1"
                    placeholder="e.g. 4.5"
                    {...register("rating")}
                    className={inputClass}
                  />

                  {errors.rating && (
                    <p className={errorClass}>
                      {errors.rating.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <div className="h-px bg-[#E4E0DD]" />

            {/* Sizes */}
            {isClothing && (
              <section>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-[#111111]">
                    Available sizes
                  </h3>

                  <p className="mt-1 text-xs text-[#8A756B]">
                    Select the sizes available for this color.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <label
                      key={size}
                      className="cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={size}
                        {...register("size")}
                        className="peer sr-only"
                      />

                      <span className="flex h-10 min-w-12 items-center justify-center rounded-md border border-[#E4E0DD] bg-white px-4 text-sm font-medium text-[#5F514A] transition hover:border-[#F87552] peer-checked:border-[#F87552] peer-checked:bg-[#FFF1ED] peer-checked:text-[#E96543] peer-focus-visible:ring-2 peer-focus-visible:ring-[#F87552]/30">
                        {size}
                      </span>
                    </label>
                  ))}
                </div>

                {errors.size && (
                  <p className={errorClass}>
                    {errors.size.message}
                  </p>
                )}
              </section>
            )}

            {isClothing && <div className="h-px bg-[#E4E0DD]" />}

            {/* Variant images */}
            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-[#111111]">
                  Variant images
                </h3>

                <p className="mt-1 text-xs text-[#8A756B]">
                  Upload up to five images to showcase this variant.
                </p>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#D8CEC8] bg-[#F7F6F4] px-4 py-6 text-center transition hover:border-[#F87552] hover:bg-[#FFF7F4]">
                <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#FCE5DF] text-[#F87552]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16V4m0 0L8 8m4-4 4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"
                    />
                  </svg>
                </span>

                <span className="text-sm font-semibold text-[#111111]">
                  Click to upload images
                </span>

                <span className="mt-1 text-xs text-[#8A756B]">
                  Image files only · Maximum 5 images
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={fileHandle}
                  className="sr-only"
                />
              </label>

              {imageError && (
                <p className="mt-2 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
                  {imageError}
                </p>
              )}

              {/* Image previews */}
              {previmage.length > 0 && (
                <div className="mt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#111111]">
                      Selected images
                    </p>

                    <span className="text-xs text-[#8A756B]">
                      {previmage.length} selected
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {previmage.map((image, index) => (
                      <div
                        key={index}
                        className="rounded-md border border-[#E4E0DD] bg-white p-1"
                      >
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="h-20 w-20 rounded-sm object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Fixed footer */}
          <footer className="mt-7 flex shrink-0 flex-col-reverse gap-3 border-t border-[#E4E0DD] bg-white pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] text-[#8A756B]">
              Nexora Admin · Secure variant management
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-[#E4E0DD] px-5 py-2.5 text-sm font-medium text-[#5F514A] transition hover:bg-[#F7F6F4]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-[#F87552] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E96543] focus:outline-none focus:ring-2 focus:ring-[#F87552]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Adding..." : "Add Variant"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default VariantForm

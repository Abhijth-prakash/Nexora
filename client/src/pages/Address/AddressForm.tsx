import { useForm } from "react-hook-form"
import type { BaseAddress } from "../../utils/baseTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddressSchema, type AddressFormData } from "../../utils/Validation"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { useNavigate } from "react-router-dom"
import {
  addAddress,
  getAddress,
  updateAddress,
} from "../../redux/features/addressSlice"
import { toast } from "react-toastify"

type Props = {
  address: BaseAddress | null
  onClose: () => void
}

const AddressForm = ({ address, onClose }: Props) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { error } = useAppSelector(
    (state) => state.addressData
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      fullName: address?.fullName || "",
      phone: address?.phone || "",
      address: address?.address || "",
      city: address?.city || "",
      state: address?.state || "",
      country: address?.country || "",
      zipCode: address?.zipCode || "",
      type: address?.type || "Home",
    },
    resolver: zodResolver(AddressSchema),
  })

  const isEditing = address !== null

  const onSubmit = async (data: AddressFormData) => {
    try {
      if (address) {
        const id = address._id

        await dispatch(updateAddress({ data, id })).unwrap()
        await dispatch(getAddress()).unwrap()

        toast.success("Address updated successfully!")

        onClose()
        navigate("/profile/address")
      } else {
        await dispatch(addAddress(data)).unwrap()
        await dispatch(getAddress()).unwrap()

        toast.success("Address added successfully!")

        onClose()
        navigate("/profile/address")
      }
    } catch (error) {
      console.log("Failed ", error)
      toast.error("Failed to save address. Please try again.")
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-[#f5f6f8] px-4 py-5 sm:px-6 lg:px-8">

      <div className="w-full">

        {/* ================= HEADER ================= */}

        <div className="mb-5 rounded-3xl border border-gray-200 bg-white px-6 py-6 shadow-sm sm:px-8 lg:px-10">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff1eb] text-[#ff5a1f]">

                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21s7-5.25 7-11a7 7 0 10-14 0c0 5.75 7 11 7 11z"
                  />

                  <circle
                    cx="12"
                    cy="10"
                    r="2.2"
                  />
                </svg>

              </div>

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {isEditing ? "Edit Address" : "Add New Address"}
                  </h2>

                  <span className="hidden rounded-full bg-[#fff1eb] px-3 py-1 text-xs font-semibold text-[#ff5a1f] sm:block">
                    {isEditing ? "Edit" : "New"}
                  </span>

                </div>

                <p className="mt-1 text-sm text-gray-400">
                  {isEditing
                    ? "Update your delivery address details"
                    : "Add a new delivery address to your account"}
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >

              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>

              Close

            </button>

          </div>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">

                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />

                  <path
                    strokeLinecap="round"
                    d="M12 8v4M12 16h.01"
                  />
                </svg>

              </div>

              <p className="text-sm font-medium text-red-600">
                {error}
              </p>

            </div>

          </div>
        )}

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl border border-gray-200 bg-white shadow-sm"
        >

          <div className="p-6 sm:p-8 lg:p-10">

            {/* ================= CONTACT ================= */}

            <div className="mb-8">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff1eb] text-sm font-bold text-[#ff5a1f]">
                  01
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Contact Information
                  </h3>

                  <p className="text-xs text-gray-400">
                    Enter the recipient's details
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* Full Name */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    {...register("fullName")}
                    placeholder="Enter full name"
                    className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                      errors.fullName
                        ? "border-red-400 focus:border-red-400 focus:ring-red-50"
                        : "border-gray-200 focus:border-[#ff5a1f] focus:ring-[#fff1eb]"
                    }`}
                  />

                  {errors.fullName && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.fullName.message}
                    </p>
                  )}

                </div>

                {/* Phone */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone
                  </label>

                  <input
                    type="text"
                    {...register("phone")}
                    placeholder="Enter phone number"
                    className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                      errors.phone
                        ? "border-red-400 focus:border-red-400 focus:ring-red-50"
                        : "border-gray-200 focus:border-[#ff5a1f] focus:ring-[#fff1eb]"
                    }`}
                  />

                  {errors.phone && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.phone.message}
                    </p>
                  )}

                </div>

              </div>

            </div>

            {/* ================= ADDRESS ================= */}

            <div className="border-t border-gray-100 pt-8">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff1eb] text-sm font-bold text-[#ff5a1f]">
                  02
                </div>

                <div>

                  <h3 className="text-base font-bold text-gray-900">
                    Delivery Address
                  </h3>

                  <p className="text-xs text-gray-400">
                    Enter the complete delivery location
                  </p>

                </div>

              </div>

              {/* Address */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Address
                </label>

                <textarea
                  {...register("address")}
                  placeholder="House name, street, locality"
                  rows={4}
                  className={`w-full resize-none rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                    errors.address
                      ? "border-red-400 focus:border-red-400 focus:ring-red-50"
                      : "border-gray-200 focus:border-[#ff5a1f] focus:ring-[#fff1eb]"
                  }`}
                />

                {errors.address && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.address.message}
                  </p>
                )}

              </div>

              {/* City + State */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    City
                  </label>

                  <input
                    type="text"
                    {...register("city")}
                    placeholder="City"
                    className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                      errors.city
                        ? "border-red-400 focus:border-red-400 focus:ring-red-50"
                        : "border-gray-200 focus:border-[#ff5a1f] focus:ring-[#fff1eb]"
                    }`}
                  />

                  {errors.city && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.city.message}
                    </p>
                  )}

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    State
                  </label>

                  <input
                    type="text"
                    {...register("state")}
                    placeholder="State"
                    className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                      errors.state
                        ? "border-red-400 focus:border-red-400 focus:ring-red-50"
                        : "border-gray-200 focus:border-[#ff5a1f] focus:ring-[#fff1eb]"
                    }`}
                  />

                  {errors.state && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.state.message}
                    </p>
                  )}

                </div>

              </div>

              {/* Country + ZIP */}

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Country
                  </label>

                  <input
                    type="text"
                    {...register("country")}
                    placeholder="Country"
                    className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                      errors.country
                        ? "border-red-400 focus:border-red-400 focus:ring-red-50"
                        : "border-gray-200 focus:border-[#ff5a1f] focus:ring-[#fff1eb]"
                    }`}
                  />

                  {errors.country && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.country.message}
                    </p>
                  )}

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    ZIP Code
                  </label>

                  <input
                    type="text"
                    {...register("zipCode")}
                    placeholder="ZIP Code"
                    className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                      errors.zipCode
                        ? "border-red-400 focus:border-red-400 focus:ring-red-50"
                        : "border-gray-200 focus:border-[#ff5a1f] focus:ring-[#fff1eb]"
                    }`}
                  />

                  {errors.zipCode && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.zipCode.message}
                    </p>
                  )}

                </div>

              </div>

            </div>

            {/* ================= ADDRESS TYPE ================= */}

            <div className="mt-8 border-t border-gray-100 pt-8">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff1eb] text-sm font-bold text-[#ff5a1f]">
                  03
                </div>

                <div>

                  <h3 className="text-base font-bold text-gray-900">
                    Address Type
                  </h3>

                  <p className="text-xs text-gray-400">
                    Choose how you want to identify this address
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                {["Home", "Work", "Other"].map((type) => (

                  <label
                    key={type}
                    className="group cursor-pointer"
                  >

                    <input
                      type="radio"
                      value={type}
                      {...register("type")}
                      className="peer sr-only"
                    />

                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 transition peer-checked:border-[#ff5a1f] peer-checked:bg-[#fff1eb]">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm transition peer-checked:text-[#ff5a1f]">

                        {type === "Home" && (
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 10.5L12 3l9 7.5M5 9.5V21h14V9.5M9 21v-6h6v6"
                            />
                          </svg>
                        )}

                        {type === "Work" && (
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <rect
                              x="3"
                              y="6"
                              width="18"
                              height="14"
                              rx="2"
                            />

                            <path
                              strokeLinecap="round"
                              d="M8 6V4h8v2M3 11h18"
                            />
                          </svg>
                        )}

                        {type === "Other" && (
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="8"
                            />

                            <path
                              strokeLinecap="round"
                              d="M8 12h8M12 8v8"
                            />
                          </svg>
                        )}

                      </div>

                      <span className="text-sm font-semibold text-gray-700">
                        {type}
                      </span>

                    </div>

                  </label>

                ))}

              </div>

              {errors.type && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  {errors.type.message}
                </p>
              )}

            </div>

          </div>

          {/* ================= FOOTER ================= */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/70 px-6 py-5 sm:flex-row sm:justify-end sm:px-8 lg:px-10">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#ff5a1f] px-7 py-3 text-sm font-semibold text-white shadow-md shadow-[#ff5a1f]/20 transition hover:bg-[#e64f19] hover:shadow-lg"
            >
              {isEditing ? "Update Address" : "Save Address"}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default AddressForm
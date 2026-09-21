import { useForm } from "react-hook-form"
import type { BaseAddress } from "../../utils/baseTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddressSchema, type AddressFormData } from "../../utils/Validation"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { useNavigate } from "react-router-dom"
import { addAddress, getAddress, updateAddress } from "../../redux/features/addressSlice"
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
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        {/* Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">

          {/* Header */}
          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-gray-900">
              {isEditing ? "Edit Address" : "Add New Address"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter your delivery address details
            </p>
          </div>

          {/* Backend Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* Full Name + Phone */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  {...register("fullName")}
                  placeholder="Enter full name"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                    errors.fullName
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                  }`}
                />

                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  type="text"
                  {...register("phone")}
                  placeholder="Enter phone number"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                    errors.phone
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                  }`}
                />

                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

            </div>

            {/* Address */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Address
              </label>

              <textarea
                {...register("address")}
                placeholder="House name, street, locality"
                rows={3}
                className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                  errors.address
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                }`}
              />

              {errors.address && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* City + State */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  City
                </label>

                <input
                  type="text"
                  {...register("city")}
                  placeholder="City"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                    errors.city
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                  }`}
                />

                {errors.city && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  State
                </label>

                <input
                  type="text"
                  {...register("state")}
                  placeholder="State"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                    errors.state
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                  }`}
                />

                {errors.state && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.state.message}
                  </p>
                )}
              </div>

            </div>

            {/* Country + ZIP */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Country
                </label>

                <input
                  type="text"
                  {...register("country")}
                  placeholder="Country"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                    errors.country
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                  }`}
                />

                {errors.country && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>

                <input
                  type="text"
                  {...register("zipCode")}
                  placeholder="ZIP Code"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                    errors.zipCode
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                  }`}
                />

                {errors.zipCode && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>

            </div>

            {/* Address Type */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Address Type
              </label>

              <select
                {...register("type")}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                  errors.type
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                }`}
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>

              {errors.type && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                {isEditing ? "Update Address" : "Save Address"}
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default AddressForm
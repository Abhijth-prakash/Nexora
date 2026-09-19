import { useForm } from "react-hook-form"
import type { BaseAddress } from "../../utils/baseTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddressSchema, type AddressFormData } from "../../utils/Validation"

type Props = {
  address: BaseAddress | null
  onClose: () => void
}

const AddressForm = ({ address, onClose }: Props) => {

  const { register, handleSubmit } = useForm<AddressFormData>({
    defaultValues: {
      fullName: address?.fullName || "",
      phone: address?.phone || "",
      address: address?.address || "",
      city: address?.city || "",
      state: address?.state || "",
      country: address?.country || "",
      zipCode: address?.zipCode || "",
      type: address?.type || "Home",
    },resolver:zodResolver(AddressSchema)
  })

  const isEditing = address !== null

  const onSubmit = (data: AddressFormData) => {
    console.log(data)
  }

  return (
    <div>

      <h2>
        {isEditing ? "Edit Address" : "Add Address"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <input
          type="text"
          {...register("fullName")}
          placeholder="Full Name"
        />

        <input
          type="text"
          {...register("phone")}
          placeholder="Phone"
        />

        <input
          type="text"
          {...register("address")}
          placeholder="Address"
        />

        <input
          type="text"
          {...register("city")}
          placeholder="City"
        />

        <input
          type="text"
          {...register("state")}
          placeholder="State"
        />

        <input
          type="text"
          {...register("country")}
          placeholder="Country"
        />

        <input
          type="text"
          {...register("zipCode")}
          placeholder="ZIP Code"
        />

        <select {...register("type")}>
          <option value="Home">Home</option>
          <option value="Work">Work</option>
          <option value="Other">Other</option>
        </select>

        <button type="submit">
          {isEditing ? "Update Address" : "Save Address"}
        </button>

        <button type="button" onClick={onClose}>
          Cancel
        </button>

      </form>

    </div>
  )
}

export default AddressForm


import type { BaseAddress } from "../../utils/baseTypes"

type Props = {
  address: BaseAddress | null
  onClose: () => void
}

const AddressForm = ({ address, onClose }: Props) => {

  const isEditing = address !== null

  return (
    <div>

      <h2>
        {isEditing ? "Edit Address" : "Add Address"}
      </h2>

      <form>

        <input
          type="text"
          placeholder="Full Name"
          defaultValue={address?.fullName || ""}
        />

        <input
          type="text"
          placeholder="Phone"
          defaultValue={address?.phone || ""}
        />

        <input
          type="text"
          placeholder="Address"
          defaultValue={address?.address || ""}
        />

        <input
          type="text"
          placeholder="City"
          defaultValue={address?.city || ""}
        />

        <input
          type="text"
          placeholder="State"
          defaultValue={address?.state || ""}
        />

        <input
          type="text"
          placeholder="Country"
          defaultValue={address?.country || ""}
        />

        <input
          type="text"
          placeholder="ZIP Code"
          defaultValue={address?.zipCode || ""}
        />

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
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { useEffect, useState } from "react"
import { getAddress } from "../../redux/features/addressSlice"
import AddressForm from "./AddressForm"
import type { BaseAddress } from "../../utils/baseTypes"

const Address = () => {
  const { address } = useAppSelector((state) => state.addressData)

  const dispatch = useAppDispatch()

  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<BaseAddress | null>(null)

  useEffect(() => {
    dispatch(getAddress())
  }, [dispatch])

  const handleAdd = () => {
    setEditingAddress(null)
    setShowForm(true)
  }

  const handleEdit = (item: BaseAddress) => {
    setEditingAddress(item)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingAddress(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {!showForm ? (
          <>
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="mb-2">
                  <Link
                    to="/"
                    className="text-sm text-gray-500 transition hover:text-gray-900"
                  >
                    ← Home
                  </Link>
                </div>

                <h1 className="text-2xl font-semibold text-gray-900">
                  My Addresses
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your saved delivery addresses
                </p>
              </div>

              <button
                disabled={address.length >= 2}
                onClick={handleAdd}
                className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                  address.length >= 2
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                + Add Address
              </button>

            </div>


            {/* Address count */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Saved addresses
              </p>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {address.length} / 2
              </span>
            </div>


            {/* Empty state */}
            {address.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-2xl">📍</span>
                </div>

                <h2 className="text-lg font-medium text-gray-900">
                  No addresses saved
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                  Add a delivery address to make your checkout faster and easier.
                </p>

                <button
                  onClick={handleAdd}
                  className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Add Your First Address
                </button>

              </div>
            ) : (

              /* Address cards */
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {address.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >

                    {/* Card header */}
                    <div className="mb-5 flex items-start justify-between">

                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {item.fullName}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.phone}
                        </p>
                      </div>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {item.type}
                      </span>

                    </div>


                    {/* Address */}
                    <div className="space-y-1 text-sm text-gray-600">

                      <p>{item.address}</p>

                      <p>
                        {item.city}, {item.state}
                      </p>

                      <p>
                        {item.country} - {item.zipCode}
                      </p>

                    </div>


                    {/* Divider */}
                    <div className="my-5 border-t border-gray-100" />


                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">

                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <button
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}
          </>
        ) : (

          /* Address form */
          <AddressForm
            address={editingAddress}
            onClose={handleClose}
          />

        )}

      </div>

    </div>
  )
}

export default Address


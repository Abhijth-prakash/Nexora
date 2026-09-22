import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { useEffect, useState } from "react"
import { deleteAddress, getAddress } from "../../redux/features/addressSlice"
import AddressForm from "./AddressForm"
import type { BaseAddress } from "../../utils/baseTypes"
import DeleteAddress from "./DeleteAddress"
import type { Addressid } from "../../utils/Validation"
import Navbar from "../../components/Navbar"

const Address = () => {
  const { address, error } = useAppSelector(
    (state) => state.addressData
  )

  const dispatch = useAppDispatch()

  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] =
    useState<BaseAddress | null>(null)

  const [showDelete, setShowDelete] = useState(false)
  const [id, setId] = useState("")

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

  const handleDelete = (id: Addressid) => {
    setShowDelete(true)
    setId(id)
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8]">

      <Navbar />

      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">

        {!showForm ? (
          <>

            {/* ================= HEADER ================= */}

            <div className="mb-6 rounded-3xl border border-gray-200 bg-white px-6 py-6 shadow-sm sm:px-8 lg:px-10">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-5">

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

                      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        My Addresses
                      </h1>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                        {address.length}/2
                      </span>

                    </div>

                    <p className="mt-1 text-sm text-gray-400">
                      Your saved delivery addresses
                    </p>

                  </div>

                </div>

                {address.length < 2 && (
                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff5a1f] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#ff5a1f]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#e64f19] hover:shadow-lg"
                  >

                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14M5 12h14"
                      />
                    </svg>

                    Add Address

                  </button>
                )}

              </div>

            </div>

            {/* ================= ADDRESS STATUS ================= */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Saved
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {address.length}
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1eb] text-[#ff5a1f]">

                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21s7-5.25 7-11a7 7 0 10-14 0c0 5.75 7 11 7 11z"
                      />

                      <circle
                        cx="12"
                        cy="10"
                        r="2"
                      />

                    </svg>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Available
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {2 - address.length}
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">

                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14M5 12h14"
                      />
                    </svg>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Capacity
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      2
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">

                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="3"
                      />

                      <path
                        strokeLinecap="round"
                        d="M8 12h8"
                      />

                    </svg>

                  </div>

                </div>

              </div>

            </div>

            {/* ================= PROGRESS ================= */}

            <div className="mb-6 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">

              <div className="flex items-center justify-between">

                <p className="text-sm font-semibold text-gray-800">
                  Address storage
                </p>

                <p className="text-xs font-semibold text-gray-400">
                  {address.length} of 2 used
                </p>

              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-[#ff5a1f] transition-all duration-500"
                  style={{
                    width: `${(address.length / 2) * 100}%`,
                  }}
                />

              </div>

            </div>

            {/* ================= EMPTY STATE ================= */}

            {address.length === 0 ? (

              <div className="flex min-h-[480px] items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">

                <div>

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#fff1eb] text-[#ff5a1f]">

                    <svg
                      className="h-9 w-9"
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

                  <h2 className="mt-6 text-xl font-bold text-gray-900">
                    No addresses saved
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
                    Add your first delivery address to make your checkout experience faster.
                  </p>

                  <button
                    onClick={handleAdd}
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#ff5a1f] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#ff5a1f]/20 transition hover:bg-[#e64f19] hover:shadow-lg"
                  >

                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14M5 12h14"
                      />
                    </svg>

                    Add Your First Address

                  </button>

                </div>

              </div>

            ) : (

              /* ================= ADDRESS CARDS ================= */

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

                {address.map((item) => (

                  <div
                    key={item._id}
                    className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
                  >

                    {/* Orange accent */}

                    <div className="absolute left-0 top-0 h-full w-1 bg-[#ff5a1f] opacity-0 transition group-hover:opacity-100" />

                    {/* CARD HEADER */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-4">

                        <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#fff1eb] text-lg font-bold text-[#ff5a1f]">

                          {item.fullName?.[0]?.toUpperCase() || "?"}

                        </div>

                        <div className="min-w-0">

                          <h2 className="truncate text-lg font-bold text-gray-900">
                            {item.fullName}
                          </h2>

                          <p className="mt-1 text-sm text-gray-400">
                            {item.phone}
                          </p>

                        </div>

                      </div>

                      <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                        {item.type}
                      </span>

                    </div>

                    {/* DIVIDER */}

                    <div className="my-5 h-px bg-gray-100" />

                    {/* ADDRESS */}

                    <div className="flex gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500">

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
                            d="M12 21s7-5.25 7-11a7 7 0 10-14 0c0 5.75 7 11 7 11z"
                          />

                          <circle
                            cx="12"
                            cy="10"
                            r="2"
                          />

                        </svg>

                      </div>

                      <div className="text-sm leading-6 text-gray-500">

                        <p className="font-medium text-gray-700">
                          {item.address}
                        </p>

                        <p>
                          {item.city}, {item.state}
                        </p>

                        <p>
                          {item.country} - {item.zipCode}
                        </p>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">

                      <span className="text-xs font-medium text-gray-400">
                        Saved address
                      </span>

                      <div className="flex items-center gap-2">

                        <button
                          onClick={() => handleEdit(item)}
                          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="rounded-xl border border-red-100 px-4 py-2 text-sm font-semibold text-red-500 transition hover:border-red-200 hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </>

        ) : (

          /* ================= ADDRESS FORM ================= */

          <AddressForm
            address={editingAddress}
            onClose={handleClose}
          />

        )}

        {/* ================= REDUX ERROR ================= */}

        {error && (
          <p className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-500">
            {error}
          </p>
        )}

      </div>

      {/* ================= DELETE MODAL ================= */}

      {showDelete && (
        <DeleteAddress
          onClose={() => setShowDelete(false)}
          onConfirm={async () => {
            try {
              await dispatch(deleteAddress(id)).unwrap()
              dispatch(getAddress()).unwrap()
              setShowDelete(false)
            } catch (error) {
              console.log("delete address failed", error)
            }
          }}
        />
      )}

    </div>
  )
}

export default Address
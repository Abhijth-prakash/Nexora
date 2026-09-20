type Props = {
  onClose: () => void
  onConfirm: () => void
}

const DeleteAddress = ({ onClose, onConfirm }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">

        <h2 className="text-lg font-semibold text-gray-900">
          Delete Address
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Do you want to delete this address?
        </p>

        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            No
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Yes
          </button>

        </div>

      </div>

    </div>
  )
}

export default DeleteAddress
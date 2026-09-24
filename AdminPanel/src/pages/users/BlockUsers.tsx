import { blockuser, getUser, unblockUser } from "../../redux/features/userSlice"
import { useAppDispatch } from "../../redux/hooks"

type Props = {
  onClose: () => void
  page: number
  userId: string
  banned: boolean
}

const BlockUsers = ({ onClose, page, userId, banned }: Props) => {
  const dispatch = useAppDispatch()

  const blockHandle = async () => {
    try {
      if (banned) {
        await dispatch(unblockUser(userId)).unwrap()
      } else {
        await dispatch(blockuser(userId)).unwrap()
      }
      dispatch(getUser(page))
      onClose()
    } catch (error) {
      console.log("failed to update user", error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="text-lg font-semibold text-gray-900">
          {banned
            ? "Do you want to unblock this user?"
            : "Do you want to block this user?"}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {banned
            ? "This user will regain access to their account."
            : "This user will lose access to their account."}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={blockHandle}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
              banned
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {banned ? "Unblock" : "Block"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlockUsers
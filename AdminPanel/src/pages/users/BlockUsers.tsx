import { blockuser, getUser } from "../../redux/features/userSlice"
import { useAppDispatch } from "../../redux/hooks"

type Props = {
  onClose: () => void
  page: number
  userId: string
}

const BlockUsers = ({ onClose, page, userId }: Props) => {
  const dispatch = useAppDispatch()

  const blockHandle = async () => {
    try {
      await dispatch(blockuser(userId)).unwrap()
      dispatch(getUser(page))
      onClose() 
    } catch (error) {
      console.log("failed to block user", error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="text-lg font-semibold text-gray-900">
          Do you want to block this user?
        </h1>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={blockHandle}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Block
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlockUsers
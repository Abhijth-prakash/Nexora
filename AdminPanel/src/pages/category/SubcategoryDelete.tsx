import {
    getAllCategories,
    getCategory,
    deleteSubCategory
} from "../../redux/features/categorySlice"
import { useAppDispatch } from "../../redux/hooks"
import { toast } from "react-toastify"

export type props = {
    close: () => void
    id: string
    subId: string
}

const SubcategoryDelete = ({ close, id, subId }: props) => {

    const dispatch = useAppDispatch()

    const handle = async () => {
        try {

            await dispatch(
                deleteSubCategory({
                    id,
                    subId
                })
            ).unwrap()

            await dispatch(getCategory(id)).unwrap()

            await dispatch(getAllCategories())

            toast.success("Subcategory deleted successfully")

            close()

        } catch (error) {

            toast.error(
                typeof error === "string"
                    ? error
                    : "Failed to delete subcategory"
            )

            close()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">

            <div className="w-full max-w-sm rounded-2xl border border-[#eee2dd] bg-white p-6 shadow-2xl">

                {/* Icon */}
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-6 w-6 text-red-500"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v4m0 4h.01M10.3 3.8l-8 14A2 2 0 004 21h16a2 2 0 001.7-3.2l-8-14a2 2 0 00-3.4 0z"
                        />
                    </svg>
                </div>

                {/* Content */}
                <div>
                    <h2 className="text-lg font-bold text-[#171717]">
                        Delete Subcategory?
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Are you sure you want to delete this subcategory?
                        This action cannot be undone.
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-7 flex items-center justify-end gap-3">

                    <button
                        type="button"
                        onClick={close}
                        className="rounded-xl border border-[#e3dcd7] bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-[#faf7f5]"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handle}
                        className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 hover:shadow-md"
                    >
                        Delete
                    </button>

                </div>

            </div>
        </div>
    )
}

export default SubcategoryDelete
import { getAllCategories, hideCategory, unhideCategory } from "../../redux/features/categorySlice"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { toast } from "react-toastify"

export type props = {
    onClose: () => void
    visible: boolean
    id: string
}

const CategoryVisiblity = ({ onClose, visible, id }: props) => {
    const dispatch = useAppDispatch()

const handleVisible = async () => {
    try {
        if (visible) {
            await dispatch(hideCategory(id)).unwrap()

            toast.success("Category hidden successfully")

            dispatch(getAllCategories())
            onClose()
        } else {
            await dispatch(unhideCategory(id)).unwrap()

            toast.success("Category made visible successfully")

            dispatch(getAllCategories())
            onClose()
        }

    } catch (error) {
        toast.error(error as string)
         onClose()
    }
}

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">

            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#eee5e1] bg-white shadow-2xl">

                {/* Header */}
                <div className="border-b border-[#eee8e5] px-6 py-5">

                    <div className="flex items-start gap-4">

                        {/* Icon */}
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                                visible
                                    ? "bg-[#fff0ec] text-[#ff624d]"
                                    : "bg-[#e9f8ee] text-[#2d9b55]"
                            }`}
                        >
                            {visible ? "!" : "✓"}
                        </div>

                        <div>
                            <h1 className="text-base font-bold text-[#171717]">
                                {visible
                                    ? "Hide category?"
                                    : "Unhide category?"}
                            </h1>

                            <p className="mt-1 text-sm leading-5 text-[#8f7d75]">
                                {visible
                                    ? "Are you sure you want to hide this category?"
                                    : "Do you want to make this category visible again?"}
                            </p>
                        </div>

                    </div>

                </div>


                {/* Content */}
                <div className="px-6 py-5">

                    <div
                        className={`rounded-xl border px-4 py-4 ${
                            visible
                                ? "border-[#f3dcd6] bg-[#fffaf8]"
                                : "border-[#d9eee0] bg-[#f7fcf8]"
                        }`}
                    >

                        <p className="text-sm font-semibold text-[#292421]">
                            {visible
                                ? "Category will be hidden"
                                : "Category will be visible"}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#95837c]">
                            {visible
                                ? "Customers will no longer be able to see this category."
                                : "Customers will be able to see this category again."}
                        </p>

                    </div>

                </div>


                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-[#eee8e5] bg-[#fffdfc] px-6 py-4">

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-[#e1d9d5] px-5 py-2.5 text-sm font-medium text-[#5f5550] transition hover:bg-[#f7f4f2]"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleVisible}
                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98] ${
                            visible
                                ? "bg-[#e34b3d] hover:bg-[#cc3d31]"
                                : "bg-[#ff624d] hover:bg-[#ed5542]"
                        }`}
                    >
                        {visible ? "Yes, Hide" : "Yes, Unhide"}
                    </button>

                </div>

            </div>

        </div>
    )
}

export default CategoryVisiblity
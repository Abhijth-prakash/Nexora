import { deleteCategory, getAllCategories } from "../../redux/features/categorySlice";
import { useAppDispatch } from "../../redux/hooks";

export type props = {
    id: string;
    Close: () => void;
};

const CategoryDelete = ({ id, Close }: props) => {
    const dispatch = useAppDispatch();

    const handleDelete = async () => {
        try {
            await dispatch(deleteCategory(id)).unwrap();
            await dispatch(getAllCategories());
            Close();
        } catch (error) {

        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">

            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#eee5e1] bg-white shadow-2xl">

                {/* Header */}
                <div className="border-b border-[#eee8e5] px-6 py-5">

                    <div className="flex items-start gap-4">

                        {/* Warning Icon */}
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff0ec] text-[#ff624d]">
                            !
                        </div>

                        <div>
                            <h1 className="text-base font-bold text-[#171717]">
                                Delete category?
                            </h1>

                            <p className="mt-1 text-sm leading-5 text-[#8f7d75]">
                                Are you sure you want to delete this category?
                                This action cannot be undone.
                            </p>
                        </div>

                    </div>

                </div>

                {/* Content */}
                <div className="px-6 py-5">

                    <div className="rounded-lg border border-[#f0e5e1] bg-[#faf8f7] px-4 py-3">

                        <p className="text-xs text-[#9a8780]">
                            Category
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#25201e]">
                            This category and its data will be removed.
                        </p>

                    </div>

                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-[#eee8e5] bg-[#fffdfc] px-6 py-4">

                    <button
                        onClick={Close}
                        className="rounded-lg border border-[#e1d9d5] px-5 py-2.5 text-sm font-medium text-[#5f5550] transition hover:bg-[#f7f4f2]"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        className="rounded-lg bg-[#e34b3d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#cc3d31] active:scale-[0.98]"
                    >
                        Yes, Delete
                    </button>

                </div>

            </div>

        </div>
    );
};

export default CategoryDelete;
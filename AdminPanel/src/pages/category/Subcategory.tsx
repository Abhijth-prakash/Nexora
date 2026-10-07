import { useForm } from "react-hook-form"
import type { Basecategory } from "../../utils/BaseType"
import { zodResolver } from "@hookform/resolvers/zod"
import { subCategorySchema, type subCategoryData } from "../../utils/validation"
import { useAppDispatch } from "../../redux/hooks"
import { addCategory, getCategory } from "../../redux/features/categorySlice"
import { toast } from "react-toastify"

export type props = {
    onClose: () => void
    category: Basecategory
}

const Subcategory = ({ onClose, category }: props) => {

    const dispatch = useAppDispatch()

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(subCategorySchema)
    })

    const dataHandle = async (data: subCategoryData) => {
        try {
            const modData = {
                name: category.name,
                description: category.description,
                subCategory: data.subCategory.toLowerCase()
            }

            await dispatch(addCategory(modData)).unwrap()
            await dispatch(getCategory(category._id))
            onClose()
            toast.success("subCategory added  successfully")

        } catch (error) {
            toast.error(error as string)
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                {/* Header */}
                <div className="mb-6">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#ff624d]">
                        Add Subcategory
                    </p>

                    <h1 className="text-2xl font-bold text-gray-900">
                        {category.name}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Add a new subcategory under this category.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(dataHandle)}
                    className="space-y-5"
                >

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-800">
                            Subcategory Name
                        </label>

                        <input
                            type="text"
                            {...register("subCategory")}
                            placeholder="Enter subcategory name"
                            className={`w-full rounded-xl border bg-[#faf8f6] px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-2 ${
                                errors.subCategory
                                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                    : "border-[#e8e1dc] focus:border-[#ff624d] focus:ring-[#ff624d]/20"
                            }`}
                        />

                        {errors.subCategory && (
                            <p className="mt-2 text-xs font-medium text-red-500">
                                {errors.subCategory?.message}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 border-t border-[#eee7e2] pt-5">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-[#e3dcd7] px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-[#f8f5f3]"
                        >
                            Cancel
                        </button>

                        <input
                            type="submit"
                            value="Add Subcategory"
                            className="cursor-pointer rounded-xl bg-[#ff624d] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#f4513b] hover:shadow-md"
                        />

                    </div>

                </form>
            </div>
        </div>
    )
}

export default Subcategory
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CategorySchema, type categoryData } from "../../utils/validation"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {
    addCategory,
    getCategories,
    getCategory,
    updateCategory
} from "../../redux/features/categorySlice"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"

export type props = {
    onClose: () => void
    editid: string
    page:number
    search:string
    filter:string
}

const CategoryForm = ({ onClose, editid,page,search,filter }: props) => {
    const dispatch = useAppDispatch()

    const { categories } = useAppSelector(
        state => state.categoryData
    )

    const category =
        editid &&
        categories.find(item => item._id === editid)

    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string>("")

    useEffect(() => {
        dispatch(getCategories({page,search,filter}))
    }, [])

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<categoryData>({
        resolver: zodResolver(CategorySchema)
    })

    useEffect(() => {
        if (category) {
            reset({
                name: category.name,
                description: category.description,
                subCategory: ""
            })
            setPreview(category.image?.url || "")
        }
    }, [category, reset])

    // show a preview of the newly chosen file, and release it when it changes
    useEffect(() => {
        if (!image) return

        const url = URL.createObjectURL(image)
        setPreview(url)

        return () => URL.revokeObjectURL(url)
    }, [image])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) return

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5 MB")
            return
        }

        setImage(file)
    }

    const buildFormData = (data: categoryData) => {
        const formData = new FormData()

        formData.append("name", data.name.toLowerCase())
        formData.append("description", data.description.toLowerCase())

        if (data.subCategory) {
            formData.append("subCategory", data.subCategory.toLowerCase())
        }

        if (image) {
            formData.append("image", image)
        }

        return formData
    }

    const handleData = async (data: categoryData) => {
        try {
            if (editid) {
                await dispatch(
                    updateCategory({
                        data: buildFormData(data),
                        id: editid
                    })
                ).unwrap()

                toast.success("Category updated successfully")
                dispatch(getCategory(editid))
                onClose()

            } else {
                await dispatch(addCategory(buildFormData(data))).unwrap()

                toast.success("Category added successfully")
            }
            dispatch(getCategories({page,search,filter}))
            onClose()

        } catch (error) {
            toast.error(
                editid
                    ? "Failed to update category"
                    : "Failed to add new  category"
            )
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex min-h-screen w-full items-center justify-center bg-black/40 px-4 backdrop-blur-sm">

            {/* Full width container */}
            <div className="flex min-h-screen w-full items-center justify-center">

                <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#eee5e1] bg-white shadow-2xl">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#eee8e5] px-6 py-5 sm:px-8">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#ff624d]">
                                Catalog
                            </p>

                            <h1 className="mt-1 text-xl font-bold text-[#171717]">
                                {editid
                                    ? "Update Category"
                                    : "Add Category"}
                            </h1>

                            <p className="mt-1 text-sm text-[#8f7d75]">
                                {editid
                                    ? "Update the category information below."
                                    : "Create a new category for your store."}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-[#8f7d75] transition hover:bg-[#fff0ec] hover:text-[#ff624d]"
                        >
                            ×
                        </button>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit(handleData)}
                        className="px-6 py-6 sm:px-8"
                    >

                        <div className="space-y-5">

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#292421]">
                                    Category Name
                                </label>

                                <input
                                    type="text"
                                    {...register("name")}
                                    placeholder="Enter category name"
                                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#292421] outline-none transition placeholder:text-[#b3a49e] focus:ring-2 ${
                                        errors.name
                                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                            : "border-[#e2d9d5] focus:border-[#ff624d] focus:ring-[#ff624d]/10"
                                    }`}
                                />

                                {errors.name && (
                                    <p className="mt-1.5 text-xs font-medium text-red-500">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#292421]">
                                    Description
                                </label>

                                <textarea
                                    {...register("description")}
                                    placeholder="Enter category description"
                                    rows={4}
                                    className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-[#292421] outline-none transition placeholder:text-[#b3a49e] focus:ring-2 ${
                                        errors.description
                                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                            : "border-[#e2d9d5] focus:border-[#ff624d] focus:ring-[#ff624d]/10"
                                    }`}
                                />

                                {errors.description && (
                                    <p className="mt-1.5 text-xs font-medium text-red-500">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            {/* Image */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-sm font-semibold text-[#292421]">
                                        Category Image
                                    </label>

                                    <span className="text-xs text-[#a3938c]">
                                        Optional
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#e2d9d5] bg-[#faf7f5]">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Category preview"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs text-[#b3a49e]">
                                                No image
                                            </span>
                                        )}
                                    </div>

                                    <label className="cursor-pointer rounded-xl border border-[#ddd3ce] px-4 py-2.5 text-sm font-semibold text-[#625650] transition hover:bg-[#faf7f5]">
                                        {preview ? "Change image" : "Choose image"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Subcategory */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-sm font-semibold text-[#292421]">
                                        Subcategory
                                    </label>

                                    <span className="text-xs text-[#a3938c]">
                                        Optional
                                    </span>
                                </div>

                                <input
                                    type="text"
                                    {...register("subCategory")}
                                    placeholder="Enter subcategory"
                                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#292421] outline-none transition placeholder:text-[#b3a49e] focus:ring-2 ${
                                        errors.subCategory
                                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                            : "border-[#e2d9d5] focus:border-[#ff624d] focus:ring-[#ff624d]/10"
                                    }`}
                                />

                                {errors.subCategory && (
                                    <p className="mt-1.5 text-xs font-medium text-red-500">
                                        {errors.subCategory.message}
                                    </p>
                                )}
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#eee8e5] pt-6 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full rounded-xl border border-[#ddd3ce] px-6 py-3 text-sm font-semibold text-[#625650] transition hover:bg-[#faf7f5] sm:w-auto"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-[#ff624d] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ed5744] active:scale-[0.98] sm:w-auto"
                            >
                                {editid
                                    ? "Update Category"
                                    : "Add Category"}
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CategoryForm
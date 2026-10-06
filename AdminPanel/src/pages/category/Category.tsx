import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { getAllCategories } from "../../redux/features/categorySlice"
import CategoryForm from "./CategoryForm"

const Category = () => {
    const { categories } = useAppSelector(state => state.categoryData)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getAllCategories())
    }, [])

    const listItems = categories && categories.map(item =>
        <li
            key={item._id}
            className="grid grid-cols-12 items-center border-b border-[#eee8e5] px-5 py-4 last:border-b-0"
        >
            {/* Category */}
            <div className="col-span-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff0ec] text-xs font-semibold uppercase text-[#ff624d]">
                    {item.name.substring(0, 2)}
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#171717]">
                        {item.name}
                    </p>

                    <p className="truncate text-xs text-[#9a8278]">
                        {item.slug}
                    </p>
                </div>
            </div>

            {/* Description */}
            <div className="col-span-3 pr-5">
                <p className="truncate text-xs text-[#9a8278]">
                    {item.description}
                </p>
            </div>

            {/* Products */}
            <div className="col-span-2">
                <span className="text-sm text-[#333]">
                    {item.productCount}
                </span>
            </div>

            {/* Visibility */}
            <div className="col-span-1">
                <div
                    className={`relative h-6 w-12 rounded-full ${
                        item.isVisible
                            ? "bg-[#ff624d]"
                            : "bg-[#d8d4d2]"
                    }`}
                >
                    <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm ${
                            item.isVisible
                                ? "right-1"
                                : "left-1"
                        }`}
                    />
                </div>
            </div>

            {/* Status */}
            <div className="col-span-1">
                <span
                    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${
                        item.isVisible
                            ? "bg-[#e5f6eb] text-[#2d9b55]"
                            : "bg-[#fff2d8] text-[#c48619]"
                    }`}
                >
                    {item.isVisible ? "Active" : "Inactive"}
                </span>
            </div>

            {/* Actions */}
            <div className="col-span-2 flex items-center gap-5">
                <Link
                    to={`/admin/category/${item._id}`}
                    className="text-xs font-medium text-[#ff624d] transition hover:underline"
                >
                    View Details
                </Link>

                <button className="text-xs font-medium text-[#ff624d] hover:underline">
                    Edit
                </button>

                <button className="text-xs font-medium text-[#ff3f32] hover:underline">
                    Delete
                </button>
            </div>
        </li>
    )

    const [form, setForm] = useState(false)

    const onCLose = () => {
        setForm(false)
    }

    return (
        <div className="min-h-screen w-full bg-[#faf9f8] text-[#171717]">

            {/* Main Content */}
            <main className="w-full px-8 py-7">

                {/* Header */}
                <div className="mb-6 flex items-start justify-between">

                    <div>
                        <h1 className="text-[30px] font-bold tracking-[-0.5px] text-[#111]">
                            Category Management
                        </h1>

                        <p className="mt-1 text-sm text-[#927d73]">
                            Create and manage product categories for your Nexora store.
                        </p>
                    </div>

                    <button
                        onClick={() => setForm(true)}
                        className="rounded-lg bg-[#ff624d] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#f25540]"
                    >
                        + Add Category
                    </button>

                </div>

                {/* Main Card */}
                <div className="w-full rounded-xl border border-[#e7e1de] bg-white px-7 py-5">

                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-[#eee8e5] pb-3">

                        <h2 className="text-base font-semibold text-[#171717]">
                            All Categories
                        </h2>

                        <span className="text-xs text-[#9a8278]">
                            {categories.length} categories
                        </span>

                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-5 py-5">

                        {/* Search */}
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[#9a8278]">
                                ⌕
                            </span>

                            <input
                                type="text"
                                placeholder="Search categories..."
                                className="h-12 w-full rounded-lg border border-[#e2dcd9] bg-white pl-11 pr-4 text-sm outline-none placeholder:text-[#b29f97] focus:border-[#ff624d]"
                            />
                        </div>

                        {/* Status */}
                        <button className="flex h-12 w-36 items-center justify-between rounded-lg border border-[#e2dcd9] px-5 text-xs font-semibold text-[#252525]">
                            All Status
                            <span className="text-[#9a8278]">⌄</span>
                        </button>

                    </div>

                    {/* Table */}
                    <div className="overflow-hidden">

                        {/* Table Header */}
                        <div className="grid grid-cols-12 items-center rounded-md bg-[#f7f5f4] px-5 py-3">

                            <div className="col-span-3 text-[10px] font-bold uppercase tracking-wide text-[#8e776d]">
                                Category
                            </div>

                            <div className="col-span-3 text-[10px] font-bold uppercase tracking-wide text-[#8e776d]">
                                Description
                            </div>

                            <div className="col-span-2 text-[10px] font-bold uppercase tracking-wide text-[#8e776d]">
                                Products
                            </div>

                            <div className="col-span-1 text-[10px] font-bold uppercase tracking-wide text-[#8e776d]">
                                Visibility
                            </div>

                            <div className="col-span-1 text-[10px] font-bold uppercase tracking-wide text-[#8e776d]">
                                Status
                            </div>

                            <div className="col-span-2 text-[10px] font-bold uppercase tracking-wide text-[#8e776d]">
                                Actions
                            </div>

                        </div>

                        {/* Categories */}
                        {categories.length > 0 ? (
                            <ul>
                                {listItems}
                            </ul>
                        ) : (
                            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0ec] text-xl text-[#ff624d]">
                                    +
                                </div>

                                <h3 className="text-sm font-semibold text-[#222]">
                                    No categories yet
                                </h3>

                                <p className="mt-1 text-xs text-[#9a8278]">
                                    Create your first category to get started.
                                </p>

                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    {categories.length > 0 && (
                        <div className="flex items-center justify-between pt-5">

                            <span className="text-xs text-[#9a8278]">
                                Showing 1–{categories.length} of {categories.length} categories
                            </span>

                            <div className="flex items-center gap-1">

                                <button className="flex h-8 w-8 items-center justify-center rounded-md bg-[#ff624d] text-xs font-semibold text-white">
                                    1
                                </button>

                                <button className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e2dcd9] text-xs text-[#444]">
                                    2
                                </button>

                                <button className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e2dcd9] text-xs text-[#444]">
                                    3
                                </button>

                                <button className="ml-1 rounded-md border border-[#e2dcd9] px-3 py-2 text-xs text-[#444]">
                                    Next →
                                </button>

                            </div>

                        </div>
                    )}

                </div>

            </main>

            {/* Modal */}
            {form && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
                        <CategoryForm onClose={onCLose} />
                    </div>
                </div>
            )}

        </div>
    )
}

export default Category
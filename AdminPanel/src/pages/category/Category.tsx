import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {
    getAllCategories,
    addpage,
    minuspage
} from "../../redux/features/categorySlice"
import CategoryForm from "./CategoryForm"
import CategoryDelete from "./CategoryDelete"
import CategoryVisiblity from "./CategoryVisiblity"

const Category = () => {

    const {
        categories,
        lastQuery,
        page,
        totalPages
    } = useAppSelector(
        state => state.categoryData
    )

    const dispatch = useAppDispatch()

    const [showdelete, setShowdelete] = useState(false)
    const [id, setId] = useState('')
    const [editid, setEditid] = useState('')
    const [form, setForm] = useState(false)
    const [visibleForm, setVisibleForm] = useState(false)
    const [visible, setVisible] = useState<boolean>(false)
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("")


    useEffect(() => {

        const sameQuery =
            lastQuery?.page === page &&
            lastQuery?.search === search &&
            lastQuery?.filter === filter

        if (!sameQuery) {
            dispatch(
                getAllCategories({
                    page,
                    search,
                    filter
                })
            )
        }

    }, [page, search, filter])


    const deleteHandle = (id: string) => {
        setShowdelete(true)
        setId(id)
    }


    // delete close
    const Close = () => {
        setShowdelete(false)
        setId("")
    }


    const editHandle = (id: string) => {
        setEditid(id)
        setForm(true)
    }


    // add or edit close
    const onCLose = () => {
        setForm(false)
        setEditid('')
    }


    // visible close
    const handleVisible = (value: boolean, id: string) => {
        setId(id)
        setVisibleForm(true)
        setVisible(value)
    }


    const visibleClose = () => {
        setId("")
        setVisible(false)
        setVisibleForm(false)
    }


    const listItems = categories && categories.map(item =>
        <li
            key={item._id}
            className="grid grid-cols-12 items-center border-b border-[#f0e7e3] px-6 py-5 transition duration-200 last:border-b-0 hover:bg-[#fffaf8]"
        >

            {/* Category */}
            <div className="col-span-3 flex min-w-0 items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0ed] text-xs font-bold uppercase tracking-wide text-[#ff624d] ring-1 ring-[#ff624d]/10">
                    {item.name.substring(0, 2)}
                </div>

                <div className="min-w-0">

                    <p className="truncate text-sm font-bold text-[#171717]">
                        {item.name}
                    </p>

                    <p className="mt-1 truncate font-mono text-[11px] text-[#a18d85]">
                        {item.slug}
                    </p>

                </div>

            </div>


            {/* Description */}
            <div className="col-span-3 min-w-0 pr-8">

                <p className="truncate text-sm leading-6 text-[#665b57]">
                    {item.description || "No description"}
                </p>

            </div>


            {/* Products */}
            <div className="col-span-2">

                <div className="flex items-baseline gap-2">

                    <span className="text-base font-bold text-[#222]">
                        {item.productCount}
                    </span>

                    <span className="text-xs text-[#a18d85]">
                        products
                    </span>

                </div>

            </div>


            {/* Visibility */}
            <div className="col-span-1">

                {item.isVisible ? (

                    <button
                        onClick={() =>
                            handleVisible(
                                item.isVisible,
                                item._id
                            )
                        }
                        type="button"
                        className="relative h-6 w-11 rounded-full bg-[#ff624d] shadow-sm transition duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#ff624d]/20"
                    >

                        <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition" />

                    </button>

                ) : (

                    <button
                        type="button"
                        onClick={() =>
                            handleVisible(
                                item.isVisible,
                                item._id
                            )
                        }
                        className="relative h-6 w-11 rounded-full bg-[#d8d3d0] shadow-inner transition duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#ff624d]/20"
                    >

                        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition" />

                    </button>

                )}

            </div>


            {/* Status */}
            <div className="col-span-1">

                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${
                        item.isVisible
                            ? "bg-[#eaf8ef] text-[#2d9b55]"
                            : "bg-[#fff4df] text-[#c48619]"
                    }`}
                >

                    <span
                        className={`h-1.5 w-1.5 rounded-full ${
                            item.isVisible
                                ? "bg-[#2d9b55]"
                                : "bg-[#c48619]"
                        }`}
                    />

                    {item.isVisible
                        ? "Active"
                        : "Inactive"}

                </span>

            </div>


            {/* Actions */}
            <div className="col-span-2 flex items-center gap-4">

                <Link
                    to={`/admin/category/${item._id}`}
                    className="rounded-lg px-2 py-1 text-xs font-bold text-[#ff624d] transition hover:bg-[#fff0ed] hover:text-[#e84e3b]"
                >
                    View
                </Link>

                <button
                    onClick={() =>
                        editHandle(item._id)
                    }
                    className="rounded-lg px-2 py-1 text-xs font-bold text-[#665b57] transition hover:bg-[#f5f1ef] hover:text-[#171717]"
                >
                    Edit
                </button>

                <button
                    onClick={() =>
                        deleteHandle(item._id)
                    }
                    className="rounded-lg px-2 py-1 text-xs font-bold text-[#e34b3d] transition hover:bg-red-50 hover:text-[#c83225]"
                >
                    Delete
                </button>

            </div>

        </li>
    )


    return (
        <div className="min-h-screen w-full bg-[#faf8f7] text-[#171717]">

            {/* Visibility Modal */}
            {visibleForm && (
                <CategoryVisiblity
                    page={page}
                    search={search}
                    filter={filter}
                    onClose={visibleClose}
                    visible={visible}
                    id={id}
                />
            )}


            {/* Delete Modal */}
            {showdelete && (
                <CategoryDelete
                    page={page}
                    search={search}
                    filter={filter}
                    id={id}
                    Close={Close}
                />
            )}


            <main className="w-full px-5 py-7 sm:px-7 lg:px-10">

                {/* ================= HEADER ================= */}
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <div className="mb-2.5 flex items-center gap-2">

                            <span className="h-2 w-2 rounded-full bg-[#ff624d]" />

                            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#ff624d]">
                                Catalog
                            </span>

                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-[#151515] sm:text-3xl">
                            Category Management
                        </h1>

                        <p className="mt-2 text-sm text-[#95837c]">
                            Create and manage product categories for your Nexora store.
                        </p>

                    </div>


                    <button
                        onClick={() => setForm(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff624d] px-5 py-3 text-sm font-bold text-white shadow-[0_4px_12px_rgba(255,98,77,0.18)] transition duration-200 hover:bg-[#ed5542] hover:shadow-[0_6px_18px_rgba(255,98,77,0.22)] active:scale-[0.98]"
                    >

                        <span className="text-lg leading-none">
                            +
                        </span>

                        Add Category

                    </button>

                </div>


                {/* ================= MAIN CARD ================= */}
                <div className="w-full overflow-hidden rounded-2xl border border-[#e8e1de] bg-white shadow-[0_2px_14px_rgba(50,30,20,0.035)]">

                    {/* Card Header */}
                    <div className="flex flex-col gap-4 border-b border-[#eee8e5] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <div className="flex items-center gap-3">

                                <h2 className="text-lg font-bold text-[#171717]">
                                    All Categories
                                </h2>

                                <span className="rounded-full bg-[#fff0ed] px-2.5 py-1 text-[10px] font-bold text-[#ff624d]">
                                    {categories.length}
                                </span>

                            </div>

                            <p className="mt-1.5 text-xs text-[#9a8780]">
                                View and manage all product categories.
                            </p>

                        </div>

                    </div>


                    {/* ================= FILTERS ================= */}
                    <div className="flex flex-col gap-3 border-b border-[#eee8e5] bg-[#fffdfc] px-6 py-5 sm:flex-row">

                        {/* Search */}
                        <div className="relative flex-1">

                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a18d85]">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-4 w-4"
                                >
                                    <circle
                                        cx="11"
                                        cy="11"
                                        r="7"
                                    />

                                    <path d="m20 20-4-4" />

                                </svg>

                            </span>

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                type="text"
                                placeholder="Search categories..."
                                className="h-11 w-full rounded-xl border border-[#e3dcd8] bg-white pl-11 pr-4 text-sm text-[#222] outline-none transition placeholder:text-[#b4a39c] focus:border-[#ff624d] focus:ring-4 focus:ring-[#ff624d]/10"
                            />

                        </div>


                        {/* Status Filter */}
                        <div className="relative w-full sm:w-52">

                            <select
                                value={filter}
                                onChange={(e) =>
                                    setFilter(e.target.value)
                                }
                                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-[#e3dcd8] bg-white px-4 pr-10 text-sm font-medium text-gray-700 outline-none transition hover:border-[#ffb0a4] focus:border-[#ff624d] focus:ring-4 focus:ring-[#ff624d]/10"
                            >

                                <option value="">
                                    Relevance
                                </option>

                                <option value="visible">
                                    Visible
                                </option>

                                <option value="notvisible">
                                    Not Visible
                                </option>

                            </select>

                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                ↓
                            </span>

                        </div>

                    </div>


                    {/* ================= TABLE ================= */}
                    <div className="w-full overflow-x-auto">

                        <div className="min-w-[950px]">

                            {/* Table Header */}
                            <div className="grid grid-cols-12 items-center border-b border-[#eee8e5] bg-[#faf8f7] px-6 py-3.5">

                                <div className="col-span-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#907c74]">
                                    Category
                                </div>

                                <div className="col-span-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#907c74]">
                                    Description
                                </div>

                                <div className="col-span-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#907c74]">
                                    Products
                                </div>

                                <div className="col-span-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#907c74]">
                                    Visibility
                                </div>

                                <div className="col-span-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#907c74]">
                                    Status
                                </div>

                                <div className="col-span-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#907c74]">
                                    Actions
                                </div>

                            </div>


                            {/* Categories */}
                            {categories.length > 0 ? (

                                <ul>
                                    {listItems}
                                </ul>

                            ) : (

                                <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">

                                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0ed] text-3xl font-light text-[#ff624d] ring-8 ring-[#fff8f6]">
                                        +
                                    </div>

                                    <h3 className="text-base font-bold text-[#222]">
                                        No categories yet
                                    </h3>

                                    <p className="mt-2 max-w-sm text-sm leading-6 text-[#9a8780]">
                                        Create your first category to start organizing your products.
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* ================= FOOTER ================= */}
                    {categories.length > 0 && (

                        <div className="flex flex-col gap-4 border-t border-[#eee8e5] bg-[#fffdfc] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <span className="text-xs font-medium text-[#9a8780]">
                                Page {page} of {totalPages}
                            </span>


                            {/* REAL PAGINATION */}
                            <div className="flex items-center gap-2">

                                {/* Previous */}
                                <button
                                    onClick={() =>
                                        dispatch(minuspage())
                                    }
                                    disabled={page === 1}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2dcd9] text-sm text-[#665b57] transition hover:border-[#ff624d] hover:text-[#ff624d] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    ←
                                </button>


                                {/* Current Page */}
                                <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#ff624d] px-3 text-xs font-bold text-white shadow-sm">
                                    {page}
                                </div>


                                {/* Next */}
                                <button
                                    onClick={() =>
                                        dispatch(addpage())
                                    }
                                    disabled={page === totalPages}
                                    className="rounded-lg border border-[#e2dcd9] px-3.5 py-2 text-xs font-semibold text-[#444] transition hover:border-[#ff624d] hover:text-[#ff624d] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next →
                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </main>


            {/* ================= ADD CATEGORY MODAL ================= */}
            {form && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">

                    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#eee5e1] bg-white shadow-2xl">

                        <div className="border-b border-[#eee8e5] bg-[#fffdfc] px-6 py-5">

                            <div className="flex items-start justify-between">

                                <div>

                                    <div className="mb-1 flex items-center gap-2">

                                        <span className="h-2 w-2 rounded-full bg-[#ff624d]" />

                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff624d]">
                                            Catalog
                                        </span>

                                    </div>

                                    <h2 className="text-lg font-bold text-[#171717]">
                                        {editid
                                            ? "Edit Category"
                                            : "Add Category"}
                                    </h2>

                                    <p className="mt-1 text-xs text-[#9a8780]">
                                        {editid
                                            ? "Update your category information."
                                            : "Create a new category for your store."}
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="p-6">

                            <CategoryForm
                                onClose={onCLose}
                                editid={editid}
                                page={page}
                                search={search}
                                filter={filter}
                            />

                        </div>

                    </div>

                </div>

            )}

        </div>
    )
}

export default Category
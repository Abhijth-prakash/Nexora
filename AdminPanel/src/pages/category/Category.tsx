import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { getAllCategories } from "../../redux/features/categorySlice"
import CategoryForm from "./CategoryForm"
import CategoryDelete from "./CategoryDelete"


const Category = () => {

    const { categories, fetched } = useAppSelector(state => state.categoryData)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!fetched) {
            dispatch(getAllCategories())
        }
    }, [])

    const [showdelete, setShowdelete] = useState(false)
    const [id, setId] = useState('')
    const [editid,setEditid] = useState('')
    const [form, setForm] = useState(false)

    const deleteHandle = (id: string) => {
        setShowdelete(true)
        setId(id)
    }


    //deleteclose
    const Close = () => {
        setShowdelete(false)
        setId("")
    }

    const editHandle =(id:string)=>{
        setEditid(id)
         setForm(true)
    }

    //add or edit close 
    const onCLose = () => {
        setForm(false)
        setEditid('')
    }


    const listItems = categories && categories.map(item =>
        <li
            key={item._id}
            className="grid grid-cols-12 items-center border-b border-[#f1ebe8] px-6 py-5 transition hover:bg-[#fffaf8]"
        >

            {/* Category */}
            <div className="col-span-3 flex min-w-0 items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0ec] text-xs font-bold uppercase text-[#ff624d]">
                    {item.name.substring(0, 2)}
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#171717]">
                        {item.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-[#a18d85]">
                        {item.slug}
                    </p>
                </div>

            </div>


            {/* Description */}
            <div className="col-span-3 min-w-0 pr-8">

                <p className="truncate text-sm text-[#665b57]">
                    {item.description || "No description"}
                </p>

            </div>


            {/* Products */}
            <div className="col-span-2">

                <div className="flex items-center gap-2">

                    <span className="text-sm font-semibold text-[#222]">
                        {item.productCount}
                    </span>

                    <span className="text-xs text-[#a18d85]">
                        products
                    </span>

                </div>

            </div>


            {/* Visibility */}
            <div className="col-span-1">

                <div
                    className={`relative h-6 w-11 rounded-full transition ${
                        item.isVisible
                            ? "bg-[#ff624d]"
                            : "bg-[#d8d3d0]"
                    }`}
                >

                    <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
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
                    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
                        item.isVisible
                            ? "bg-[#e9f8ee] text-[#2d9b55]"
                            : "bg-[#fff3dc] text-[#c48619]"
                    }`}
                >
                    {item.isVisible ? "Active" : "Inactive"}
                </span>

            </div>


            {/* Actions */}
            <div className="col-span-2 flex items-center gap-4">

                <Link
                    to={`/admin/category/${item._id}`}
                    className="text-xs font-semibold text-[#ff624d] transition hover:text-[#e84e3b]"
                >
                    View
                </Link>

                <button onClick={()=>editHandle(item._id)}
                    className="text-xs font-semibold text-[#5f5652] transition hover:text-[#171717]"
                >
                    Edit
                </button>

                <button
                    onClick={() => deleteHandle(item._id)}
                    className="text-xs font-semibold text-[#e34b3d] transition hover:text-[#c83225]"
                >
                    Delete
                </button>

            </div>

        </li>
    )





    return (

        <div className="min-h-screen w-full bg-[#faf8f7] text-[#171717]">

            {/* Delete Modal */}
            {showdelete && (
                <CategoryDelete
                    id={id}
                    Close={Close}
                />
            )}


            <main className="w-full px-5 py-6 sm:px-7 lg:px-9">


                {/* Header */}
                <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div className="mb-2 flex items-center gap-2">

                            <span className="h-2 w-2 rounded-full bg-[#ff624d]" />

                            <span className="text-xs font-semibold uppercase tracking-wider text-[#ff624d]">
                                Catalog
                            </span>

                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-[#151515] sm:text-[30px]">
                            Category Management
                        </h1>

                        <p className="mt-1.5 text-sm text-[#95837c]">
                            Create and manage product categories for your Nexora store.
                        </p>

                    </div>


                    <button
                        onClick={() => setForm(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff624d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ed5542] active:scale-[0.98]"
                    >
                        <span className="text-base">
                            +
                        </span>

                        Add Category
                    </button>

                </div>


                {/* Main Card */}
                <div className="w-full overflow-hidden rounded-2xl border border-[#e8e1de] bg-white shadow-[0_2px_12px_rgba(50,30,20,0.03)]">


                    {/* Card Header */}
                    <div className="flex flex-col gap-4 border-b border-[#eee8e5] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <h2 className="text-base font-bold text-[#171717]">
                                All Categories
                            </h2>

                            <p className="mt-1 text-xs text-[#9a8780]">
                                View and manage all product categories.
                            </p>

                        </div>


                        <div className="rounded-full bg-[#fff3ef] px-3 py-1.5">

                            <span className="text-xs font-semibold text-[#ff624d]">
                                {categories.length} categories
                            </span>

                        </div>

                    </div>


                    {/* Filters */}
                    <div className="flex flex-col gap-3 border-b border-[#eee8e5] px-6 py-5 sm:flex-row">

                        {/* Search */}
                        <div className="relative flex-1">

                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a18d85]">
                                ⌕
                            </span>

                            <input
                                type="text"
                                placeholder="Search categories..."
                                className="h-11 w-full rounded-lg border border-[#e3dcd8] bg-[#fff] pl-10 pr-4 text-sm text-[#222] outline-none transition placeholder:text-[#b4a39c] focus:border-[#ff624d] focus:ring-2 focus:ring-[#ff624d]/10"
                            />

                        </div>


                        {/* Status */}
                        <button
                            className="flex h-11 w-full items-center justify-between rounded-lg border border-[#e3dcd8] bg-white px-4 text-xs font-semibold text-[#38312e] transition hover:border-[#ff624d] sm:w-40"
                        >

                            <span>
                                All Status
                            </span>

                            <span className="text-[#9a8780]">
                                ⌄
                            </span>

                        </button>

                    </div>


                    {/* Table */}
                    <div className="w-full overflow-x-auto">

                        <div className="min-w-[950px]">


                            {/* Table Header */}
                            <div className="grid grid-cols-12 items-center bg-[#faf8f7] px-6 py-3.5">

                                <div className="col-span-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#907c74]">
                                    Category
                                </div>

                                <div className="col-span-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#907c74]">
                                    Description
                                </div>

                                <div className="col-span-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#907c74]">
                                    Products
                                </div>

                                <div className="col-span-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#907c74]">
                                    Visibility
                                </div>

                                <div className="col-span-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#907c74]">
                                    Status
                                </div>

                                <div className="col-span-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#907c74]">
                                    Actions
                                </div>

                            </div>


                            {/* Categories */}
                            {categories.length > 0 ? (

                                <ul>
                                    {listItems}
                                </ul>

                            ) : (

                                <div className="flex min-h-[340px] flex-col items-center justify-center px-6 text-center">

                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0ec] text-2xl text-[#ff624d]">
                                        +
                                    </div>

                                    <h3 className="text-sm font-bold text-[#222]">
                                        No categories yet
                                    </h3>

                                    <p className="mt-1 max-w-sm text-xs leading-5 text-[#9a8780]">
                                        Create your first category to start organizing your products.
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* Footer */}
                    {categories.length > 0 && (

                        <div className="flex flex-col gap-4 border-t border-[#eee8e5] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <span className="text-xs text-[#9a8780]">
                                Showing 1–{categories.length} of {categories.length} categories
                            </span>


                            <div className="flex items-center gap-1">

                                <button className="flex h-8 w-8 items-center justify-center rounded-md bg-[#ff624d] text-xs font-semibold text-white">
                                    1
                                </button>

                                <button className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e2dcd9] text-xs text-[#444] transition hover:border-[#ff624d] hover:text-[#ff624d]">
                                    2
                                </button>

                                <button className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e2dcd9] text-xs text-[#444] transition hover:border-[#ff624d] hover:text-[#ff624d]">
                                    3
                                </button>

                                <button className="ml-1 rounded-md border border-[#e2dcd9] px-3 py-2 text-xs font-medium text-[#444] transition hover:border-[#ff624d] hover:text-[#ff624d]">
                                    Next →
                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </main>


            {/* Add Category Modal */}
            {form && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">

                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                        <div className="border-b border-[#eee8e5] px-6 py-4">

                            <h2 className="text-base font-bold text-[#171717]">
                                Add Category
                            </h2>

                            <p className="mt-1 text-xs text-[#9a8780]">
                                Create a new category for your store.
                            </p>

                        </div>

                        <div className="p-6">
                            <CategoryForm onClose={onCLose} editid={editid} />
                        </div>

                    </div>

                </div>

            )}

        </div>
    )
}

export default Category
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {
  getCategories,
  addpage,
  minuspage,
  resetpage,
} from "../../redux/features/categorySlice"
import CategoryForm from "./CategoryForm"
import CategoryDelete from "./CategoryDelete"
import CategoryVisiblity from "./CategoryVisiblity"
import AdminSidebar from "../../components/Adminsidebar"

const Category = () => {
  const {
    categories,
    lastQuery,
    page,
    totalPages,
  } = useAppSelector((state) => state.categoryData)

  const dispatch = useAppDispatch()

  const [showdelete, setShowdelete] = useState(false)
  const [id, setId] = useState("")
  const [editid, setEditid] = useState("")
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
        getCategories({
          page,
          search,
          filter,
        })
      )
    }
  }, [page, search, filter])

  const deleteHandle = (id: string) => {
    setShowdelete(true)
    setId(id)
  }

  // Delete close
  const Close = () => {
    setShowdelete(false)
    setId("")
  }

  const editHandle = (id: string) => {
    setEditid(id)
    setForm(true)
  }

  // Add or edit close
  const onCLose = () => {
    setForm(false)
    setEditid("")
  }

  // Visibility close
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

  const listItems = categories && categories.map((item) => (
    <li
      key={item._id}
      className="grid grid-cols-12 items-center gap-y-4 border-b border-slate-100 px-5 py-5 transition-colors last:border-b-0 hover:bg-orange-50/30 sm:px-6"
    >
      {/* Category */}
      <div className="col-span-6 flex min-w-0 items-center gap-3 md:col-span-3">
        {item.image?.url ? (
          <img
            src={item.image.url}
            alt={item.name}
            className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xs font-bold uppercase tracking-wide text-orange-600">
            {item.name.substring(0, 2)}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-800">
            {item.name}
          </p>
          <p className="mt-1 truncate font-mono text-[11px] text-slate-400">
            {item.slug}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="col-span-6 min-w-0 md:col-span-3">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 md:hidden">
          Description
        </p>
        <p className="truncate pr-2 text-sm leading-6 text-slate-500">
          {item.description || "No description"}
        </p>
      </div>

      {/* Products */}
      <div className="col-span-4 md:col-span-2">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 md:hidden">
          Products
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-slate-800">
            {item.productCount}
          </span>
          <span className="text-xs text-slate-400">products</span>
        </div>
      </div>

      {/* Visibility */}
      <div className="col-span-4 md:col-span-1">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400 md:hidden">
          Visibility
        </p>

        {item.isVisible ? (
          <button
            onClick={() =>
              handleVisible(item.isVisible, item._id)
            }
            type="button"
            aria-label="Turn visibility off"
            aria-pressed={item.isVisible}
            className="relative h-6 w-11 rounded-full bg-orange-500 shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              handleVisible(item.isVisible, item._id)
            }
            aria-label="Turn visibility on"
            aria-pressed={item.isVisible}
            className="relative h-6 w-11 rounded-full bg-slate-300 shadow-inner transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
          </button>
        )}
      </div>

      {/* Status */}
      <div className="col-span-4 md:col-span-1">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400 md:hidden">
          Status
        </p>

        <span
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${
            item.isVisible
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              item.isVisible
                ? "bg-emerald-500"
                : "bg-amber-500"
            }`}
          />
          {item.isVisible ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Actions */}
      <div className="col-span-12 flex items-center gap-2 border-t border-slate-100 pt-3 md:col-span-2 md:border-0 md:pt-0">
        <Link
          to={`/admin/category/${item._id}`}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-orange-300 hover:text-orange-600"
        >
          View
        </Link>

        <button
          onClick={() => editHandle(item._id)}
          className="rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-100"
        >
          Edit
        </button>

        <button
          onClick={() => deleteHandle(item._id)}
          className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </li>
  ))

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fc] text-slate-800">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        {/* Visibility modal */}
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

        {/* Delete modal */}
        {showdelete && (
          <CategoryDelete
            page={page}
            search={search}
            filter={filter}
            id={id}
            Close={Close}
          />
        )}

        <div className="mx-auto w-full max-w-[1700px] space-y-7">
          {/* Header */}
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Nexora / Catalog
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Category Management
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Create and manage product categories for your Nexora store.
              </p>
            </div>

            <button
              onClick={() => setForm(true)}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100 sm:self-auto"
            >
              <span className="text-lg leading-none">+</span>
              Add Category
            </button>
          </div>

          {/* Categories card */}
          <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Card header */}
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-bold text-slate-900">
                    All Categories
                  </h2>

                  <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700">
                    {categories.length}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage your product categories.
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Category overview
              </span>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-5 sm:flex-row sm:px-6">
              {/* Search */}
              <div className="relative flex-1">
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    dispatch(resetpage())
                  }}
                  type="text"
                  placeholder="Search categories..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* Status filter */}
              <div className="relative sm:w-56">
                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value)
                    dispatch(resetpage())
                  }}
                  className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-orange-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                >
                  <option value="">Relevance</option>
                  <option value="visible">Visible</option>
                  <option value="notvisible">Not Visible</option>
                </select>

                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* Category list */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[950px]">
                {/* Table header */}
                <div className="grid grid-cols-12 items-center border-b border-slate-100 bg-slate-50 px-6 py-3.5">
                  <div className="col-span-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Category
                  </div>

                  <div className="col-span-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Description
                  </div>

                  <div className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Products
                  </div>

                  <div className="col-span-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Visibility
                  </div>

                  <div className="col-span-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </div>

                  <div className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </div>
                </div>

                {/* Categories */}
                {categories.length > 0 ? (
                  <ul>{listItems}</ul>
                ) : (
                  <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-7 w-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </div>

                    <h3 className="text-base font-bold text-slate-800">
                      No categories yet
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Create your first category to start organizing your
                      products.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination */}
            {categories.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-slate-500">
                  Page{" "}
                  <span className="font-bold text-slate-800">{page}</span> of{" "}
                  <span className="font-bold text-slate-800">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(minuspage())}
                    disabled={page === 1}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Previous
                  </button>

                  <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-orange-500 px-3 text-sm font-bold text-white">
                    {page}
                  </div>

                  <button
                    onClick={() => dispatch(addpage())}
                    disabled={page === totalPages}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Add / Edit category modal */}
        {form && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                    Nexora / Catalog
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  {editid ? "Edit Category" : "Add Category"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editid
                    ? "Update your category information."
                    : "Create a new category for your store."}
                </p>
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
      </main>
    </div>
  )
}

export default Category
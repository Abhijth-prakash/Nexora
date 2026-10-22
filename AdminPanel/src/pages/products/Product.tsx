import { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getProducts,
  addpage,
  minupage,
} from "../../redux/features/ProductSlice";
import { getallCategories } from "../../redux/features/categorySlice";
import ProductVisibility from "./ProductVisibility";
import ProductDelete from "./ProductDelete";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/Adminsidebar";

const Product = () => {
  // Hooks
  const dispatch = useAppDispatch();

  const { products, page, totalPages, lastQuery } = useAppSelector(
    (state) => state.productData
  );
  const { categories } = useAppSelector((state) => state.categoryData);

  const [form, setForm] = useState(false);
  const [visibleForm, setVisibleForm] = useState(false);
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState("");
  const [remove, setRemove] = useState(false);
  const [editId, setEditid] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  // Edit or add product
  const formHandle = () => {
    setForm(true);
  };

  const onClose = () => {
    setForm(false);
    setEditid("");
  };

  // Visibility handle
  const visibleHandle = (id: string, value: boolean) => {
    setVisibleForm(true);
    setVisible(value);
    setId(id);
  };

  const CloseVisble = () => {
    setVisibleForm(false);
    setId("");
  };

  // Delete handle
  const deletehanlde = (id: string) => {
    setId(id);
    setRemove(true);
  };

  const removeClose = () => {
    setRemove(false);
    setId("");
  };

  // Edit handle
  const editHandle = (id: string) => {
    setForm(true);
    setEditid(id);
  };

  useEffect(() => {
    const sameQuery =
      lastQuery?.page === page &&
      lastQuery?.search === search &&
      lastQuery?.filter === filter &&
      lastQuery?.sort === sort;

    if (!sameQuery) {
      dispatch(getProducts({ page, search, sort, filter }));
    }

    if (categories.length === 0) {
      dispatch(getallCategories());
    }
  }, [page, search, sort, filter]);

  const listItems = products?.map((item) => (
    <tr
      key={item._id}
      className="border-b border-slate-100 transition-colors hover:bg-orange-50/40"
    >
      {/* Product */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {item.images?.[0] ? (
            <img
              src={item.images[0]}
              alt={item.name}
              className="h-14 w-14 shrink-0 rounded-xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-medium text-slate-400">
              No image
            </div>
          )}

          <div className="min-w-0">
            <p className="font-semibold text-slate-800">{item.name}</p>
            <p className="mt-1 max-w-[240px] truncate text-xs text-slate-400">
              {item.description}
            </p>
          </div>
        </div>
      </td>

      {/* Brand */}
      <td className="px-5 py-4 text-sm font-medium text-slate-600">
        {item.brand || "—"}
      </td>

      {/* Category */}
      <td className="px-5 py-4">
        <span className="inline-flex rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold capitalize text-orange-700">
          {item.category?.name ?? "Uncategorized"}
        </span>
      </td>

      {/* Subcategory */}
      <td className="px-5 py-4 text-sm text-slate-600">
        {item.subCategory?.name ?? "—"}
      </td>

      {/* Stock */}
      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
        {item.stock}
      </td>

      {/* Visibility */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => visibleHandle(item._id, item.visible)}
            aria-label={
              item.visible ? "Turn visibility off" : "Turn visibility on"
            }
            aria-pressed={item.visible}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
              item.visible ? "bg-orange-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                item.visible ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>

          <span
            className={`text-[11px] font-bold ${
              item.visible ? "text-orange-600" : "text-slate-400"
            }`}
          >
            {item.visible ? "ON" : "OFF"}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/products/${item._id}`}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-orange-400 hover:text-orange-600"
          >
            View
          </Link>

          <button
            onClick={() => editHandle(item._id)}
            type="button"
            className="rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-100"
          >
            Edit
          </button>

          <button
            onClick={() => deletehanlde(item._id)}
            type="button"
            className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fc] text-slate-800">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        {/* Modals */}
        {form && <ProductForm onClose={onClose} editId={editId} />}

        {visibleForm && (
          <ProductVisibility
            CloseVisble={CloseVisble}
            visible={visible}
            id={id}
          />
        )}

        {remove && (
          <ProductDelete id={id} removeClose={removeClose} />
        )}

        <div className="mx-auto w-full max-w-[1700px] space-y-7">
          {/* Header */}
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Nexora / Inventory
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Products
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                Manage your catalog, categories, and product visibility.
              </p>
            </div>

            <button
              onClick={formHandle}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100 sm:self-auto"
            >
              <span className="text-lg leading-none">+</span>
              Add product
            </button>
          </div>

          {/* Search and filters */}
          <section className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-sm font-bold text-slate-800">
                Find products
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Search your inventory and refine results by category or price.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Search */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Search products
                </label>

                <div className="relative">
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
                    <path d="m21 21-4.3-4.3" />
                  </svg>

                  <input
                    type="text"
                    placeholder="Search by product name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />
                </div>
              </div>

              {/* Category filter */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Category
                </label>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                >
                  <option value="">All categories</option>

                  {categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sorting */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Sort by
                </label>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                >
                  <option value="">Relevance</option>
                  <option value="low">Price: Low to high</option>
                  <option value="high">Price: High to low</option>
                </select>
              </div>
            </div>
          </section>

          {/* Products table */}
          <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Product inventory
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review and manage your products
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Page {page}
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="bg-slate-50">
                  <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Brand</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Subcategory</th>
                    <th className="px-5 py-4">Stock</th>
                    <th className="px-5 py-4">Visibility</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {listItems}

                  {products?.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                        </div>

                        <p className="font-semibold text-slate-700">
                          No products found
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Try changing your search or category filter.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col justify-between gap-4 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
              <p className="text-sm text-slate-500">
                Page{" "}
                <span className="font-bold text-slate-800">{page}</span>

                {totalPages > 0 && (
                  <>
                    {" "}of{" "}
                    <span className="font-bold text-slate-800">
                      {totalPages}
                    </span>
                  </>
                )}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => dispatch(minupage())}
                  disabled={page === 1}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
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

                <button
                  onClick={() => dispatch(addpage())}
                  disabled={page === totalPages || totalPages === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
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
          </section>
        </div>
      </main>
    </div>
  );
};

export default Product;
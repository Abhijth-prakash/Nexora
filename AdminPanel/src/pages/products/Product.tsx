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

const Product = () => {

    //hooks
  const dispatch = useAppDispatch();

  const { products, page, totalPages,lastQuery } = useAppSelector((state) => state.productData);
  const { categories } = useAppSelector((state) => state.categoryData);


  const [form, setForm] = useState(false);
  const [visibleForm,setVisibleForm] = useState(false)
  const [visible,setVisible] = useState(false)
  const [id,setId] = useState("")
  const [remove,setRemove] = useState(false)
  const [editId,setEditid] =useState("")



  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");


  //edit or add product
  const formHandle = () => {
    setForm(true);
  };

  const onClose = () => {
    setForm(false);
    setEditid("")
  };

  //visible handle
  const visibleHandle = (id:string,value:boolean)=>{
      setVisibleForm(true)
      setVisible(value)
      setId(id)
  }

  const CloseVisble = ()=>{
    setVisibleForm(false)
    setId("")
  }


  //deleteHandle
  const deletehanlde = (id:string)=>{
    setId(id)
    setRemove(true)
  }

  const removeClose = ()=>{
    setRemove(false)
    setId("")
  }

  //edithandle
  const editHandle = (id:string)=>{
    setForm(true)
    setEditid(id)
  }



  useEffect(() => {
      const sameQuery =   
            lastQuery?.page === page &&
            lastQuery?.search === search &&
            lastQuery?.filter === filter &&
            lastQuery?.sort === sort


    if(!sameQuery){
       dispatch(getProducts({ page, search, sort, filter }));
    }

    if(!categories){
          dispatch(getallCategories());
    }
    
  }, [page, search, sort, filter]);

  const listItems = products?.map((item) => (
    <tr
      key={item._id}
      className="border-b border-[#f0eeec] transition-colors hover:bg-[#fffaf8]"
    >
      {/* Product */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {item.images?.[0] ? (
            <img
              src={item.images[0]}
              alt={item.name}
              className="h-12 w-12 shrink-0 rounded-lg border border-[#eee8e5] object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#eee8e5] bg-[#fdfaf9] text-[10px] text-[#aaa19c]">
              No image
            </div>
          )}

          <div className="min-w-0">
            <p className="font-semibold text-[#262322]">{item.name}</p>
            <p className="mt-1 max-w-[240px] truncate text-xs text-[#99918d]">
              {item.description}
            </p>
          </div>
        </div>
      </td>

      {/* Brand */}
      <td className="px-5 py-4 text-sm font-medium text-[#625b57]">
        {item.brand || "—"}
      </td>

      {/* Category */}
      <td className="px-5 py-4">
        <span className="inline-flex rounded-lg bg-[#fff1ed] px-3 py-1.5 text-xs font-semibold capitalize text-[#e95f49]">
          {item.category?.name ?? "Uncategorized"}
        </span>
      </td>

      {/* Subcategory */}
      <td className="px-5 py-4 text-sm text-[#625b57]">
        {item.subCategory?.name ?? "—"}
      </td>

      {/* Stock */}
      <td className="px-5 py-4 text-sm font-medium text-[#625b57]">
        {item.stock}
      </td>

      {/* Visibility toggle UI */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={()=>visibleHandle(item._id,item.visible)}
            aria-label={
              item.visible ? "Turn visibility off" : "Turn visibility on"
            }
            aria-pressed={item.visible}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
              item.visible ? "bg-[#ff624d]" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                item.visible ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>

          <span
            className={`text-xs font-semibold ${
              item.visible ? "text-[#e95f49]" : "text-gray-500"
            }`}
          >
            {item.visible ? "ON" : "OFF"}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <Link to={`/admin/products/${item._id}`}

            type="button"
            className="rounded-lg border border-[#e9e4e1] px-3 py-2 text-xs font-semibold text-[#625b57] transition hover:border-[#ff624d] hover:text-[#ff624d]"
          >
            View
          </Link>

          <button 
            onClick={()=>editHandle(item._id)}
            type="button"
            className="rounded-lg bg-[#fff1ed] px-3 py-2 text-xs font-semibold text-[#e95f49] transition hover:bg-[#ffe3dc]"
          >
            Edit
          </button>

          <button

            onClick={()=> deletehanlde(item._id)}
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
    <div className="min-h-screen w-full bg-[#faf8f7] p-4 sm:p-6 lg:p-8">
      {form && <ProductForm onClose={onClose} editId={editId}/>}

      {visibleForm&& <ProductVisibility CloseVisble={CloseVisble} visible={visible} id={id}></ProductVisibility>}

      {remove && <ProductDelete id={id} removeClose={removeClose} ></ProductDelete>}

      {/* Full-width page content */}
      <div className="w-full space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ff624d]">
              Nexora / Inventory
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#262322]">
              Products
            </h1>

            <p className="mt-2 text-sm text-[#89817d]">
              Manage your catalog, categories, and product visibility.
            </p>
          </div>

          <button
            onClick={formHandle}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#ff624d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#eb503c] focus:outline-none focus:ring-4 focus:ring-[#ff624d]/20 sm:self-auto"
          >
            <span className="text-lg leading-none">+</span>
            Add product
          </button>
        </div>

        {/* Search and filters */}
        <div className="w-full rounded-2xl border border-[#eee8e5] bg-white p-4 shadow-[0_4px_24px_rgba(38,35,34,0.03)] sm:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-[#625b57]">
                Search products
              </label>

              <input
                type="text"
                placeholder="Search by product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#e9e4e1] bg-[#fdfcfb] px-4 text-sm text-[#262322] outline-none transition placeholder:text-[#aaa19c] focus:border-[#ff624d] focus:bg-white focus:ring-4 focus:ring-[#ff624d]/10"
              />
            </div>

            {/* Category filter */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-[#625b57]">
                Category
              </label>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-11 w-full cursor-pointer rounded-xl border border-[#e9e4e1] bg-[#fdfcfb] px-4 text-sm text-[#625b57] outline-none transition focus:border-[#ff624d] focus:bg-white focus:ring-4 focus:ring-[#ff624d]/10"
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
              <label className="mb-2 block text-xs font-semibold text-[#625b57]">
                Sort by
              </label>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 w-full cursor-pointer rounded-xl border border-[#e9e4e1] bg-[#fdfcfb] px-4 text-sm text-[#625b57] outline-none transition focus:border-[#ff624d] focus:bg-white focus:ring-4 focus:ring-[#ff624d]/10"
              >
                <option value="">Relevance</option>
                <option value="low">Price: Low to high</option>
                <option value="high">Price: High to low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products table */}
        <div className="w-full overflow-hidden rounded-2xl border border-[#eee8e5] bg-white shadow-[0_4px_24px_rgba(38,35,34,0.03)]">
          <div className="flex items-center justify-between border-b border-[#f0eeec] px-5 py-4">
            <div>
              <h2 className="font-bold text-[#262322]">
                Product inventory
              </h2>

              <p className="mt-1 text-xs text-[#99918d]">
                Review and manage your products
              </p>
            </div>

            <span className="rounded-lg bg-[#fff1ed] px-3 py-1.5 text-xs font-semibold text-[#e95f49]">
              Page {page}
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-[#fdfaf9]">
                <tr className="text-[11px] font-bold uppercase tracking-wider text-[#99918d]">
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
                      <p className="font-semibold text-[#625b57]">
                        No products found
                      </p>

                      <p className="mt-1 text-sm text-[#99918d]">
                        Try changing your search or category filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col justify-between gap-4 border-t border-[#f0eeec] px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-sm text-[#89817d]">
              Page{" "}
              <span className="font-bold text-[#262322]">{page}</span>

              {totalPages > 0 && (
                <>
                  {" "}of{" "}
                  <span className="font-bold text-[#262322]">
                    {totalPages}
                  </span>
                </>
              )}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => dispatch(minupage())}
                disabled={page === 1}
                className="rounded-xl border border-[#e9e4e1] px-4 py-2.5 text-sm font-semibold text-[#625b57] transition hover:border-[#ff624d] hover:text-[#ff624d] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                onClick={() => dispatch(addpage())}
                disabled={page === totalPages || totalPages === 0}
                className="rounded-xl bg-[#ff624d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#eb503c] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
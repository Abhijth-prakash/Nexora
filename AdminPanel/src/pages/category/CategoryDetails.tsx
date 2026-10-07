import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import { getCategory } from "../../redux/features/categorySlice";
import Subcategory from "./Subcategory";
import CategoryForm from "./CategoryForm";

const CategoryDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const {
    category,
    subCategories,
    fetchByid,
    Catid,
  } = useAppSelector((state) => state.categoryData);

  const [sub, setSub] = useState(false);
  const [editid, setEditid] = useState('')
  const [form, setForm] = useState(false)


      const editHandle = () => {
        if(category){
        setEditid(category?._id)
        setForm(true)
        }
      
    }

    // add or edit close
    const onCLose = () => {
        setForm(false)
        setEditid('')
    }

  const subHandle = () => {
    setSub(true);
  };

  //subclose

  const onClose = () => {
    setSub(false);
  };

  const listItems = subCategories.map((item) => (
    <div
      key={item._id}
      className="grid grid-cols-[minmax(0,1fr)_120px_140px_80px] items-center border-b border-[#f0e4df] px-6 py-4 transition last:border-b-0 hover:bg-[#fffaf8]"
    >
      {/* Subcategory */}
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0ed] text-sm font-bold text-[#ff624d]">
          {item.name.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#171717]">
            {item.name}
          </p>

          <p className="mt-0.5 truncate text-xs text-gray-400">
            {item.slug}
          </p>
        </div>
      </div>

      {/* Product Count */}
      <div>
        <p className="text-sm font-semibold text-[#171717]">
          {item.productCount}
        </p>

        <p className="mt-0.5 text-xs text-gray-400">
          Products
        </p>
      </div>

      {/* Status */}
      <div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            item.isVisible
              ? "bg-green-50 text-green-600"
              : "bg-yellow-50 text-yellow-600"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              item.isVisible
                ? "bg-green-500"
                : "bg-yellow-500"
            }`}
          />

          {item.isVisible ? "Visible" : "Hidden"}
        </span>
      </div>

      {/* Action */}
      <div>
        <button className="text-xs font-semibold text-red-500 transition hover:text-red-700">
          Delete
        </button>
      </div>
    </div>
  ));

  useEffect(() => {
    if (!fetchByid || Catid !== id) {
      if (id) {
        dispatch(getCategory(id));
      }
    }
  }, [id, dispatch]);

  return (
    <div className="min-h-screen w-full bg-[#faf7f5] px-4 py-6 sm:px-6 lg:px-8">

        {form && <CategoryForm onClose={onCLose}  editid={editid} ></CategoryForm>}

      {sub && category && (
        <Subcategory
          onClose={onClose}
          category={category}
        />
      )}

      {/* Full Width Container */}
      <div className="w-full">

        {/* ================= HEADER ================= */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ff624d]" />

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#ff624d]">
                Category Management
              </p>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
              Category Details
            </h1>

            <p className="mt-1.5 text-sm text-gray-500">
              Manage category information and subcategories.
            </p>
          </div>

          <button  
            onClick={editHandle}
          className="inline-flex w-fit items-center justify-center rounded-xl bg-[#ff624d] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e95340] hover:shadow-md">
            Edit Category
          </button>
        </div>

        {/* ================= CATEGORY INFORMATION ================= */}
        <div className="mb-6 w-full overflow-hidden rounded-2xl border border-[#eee2dd] bg-white shadow-sm">

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-[#eee2dd] px-6 py-5">

            <div>
              <h2 className="text-lg font-bold text-[#171717]">
                Category Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Basic information about this category.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0ed] text-sm font-bold text-[#ff624d]">
              {category?.name?.charAt(0).toUpperCase()}
            </div>

          </div>

          {/* Category Details */}
          <div className="grid grid-cols-1 gap-8 px-6 py-7 sm:grid-cols-2 lg:grid-cols-4">

            {/* Name */}
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Category Name
              </p>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0ed] text-base font-bold text-[#ff624d]">
                  {category?.name?.charAt(0).toUpperCase()}
                </div>

                <p className="text-sm font-semibold text-[#171717]">
                  {category?.name}
                </p>

              </div>
            </div>

            {/* Description */}
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Description
              </p>

              <p className="max-w-xl text-sm leading-6 text-gray-700">
                {category?.description || "No description"}
              </p>
            </div>

            {/* Products */}
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Products
              </p>

              <p className="text-2xl font-bold text-[#171717]">
                {category?.productCount ?? 0}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Total products
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Status
              </p>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  category?.isVisible
                    ? "bg-green-50 text-green-600"
                    : "bg-yellow-50 text-yellow-600"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    category?.isVisible
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                />

                {category?.isVisible ? "Visible" : "Hidden"}
              </span>
            </div>

          </div>

          {/* Slug */}
          <div className="border-t border-[#eee2dd] bg-[#fffdfc] px-6 py-4">

            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Slug
            </p>

            <span className="inline-flex rounded-lg bg-[#f7f3f1] px-3 py-1.5 font-mono text-xs text-gray-600">
              {category?.slug}
            </span>

          </div>

        </div>

        {/* ================= SUBCATEGORIES ================= */}
        <div className="w-full overflow-hidden rounded-2xl border border-[#eee2dd] bg-white shadow-sm">

          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-[#eee2dd] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <h2 className="text-lg font-bold text-[#171717]">
                  Subcategories
                </h2>

                <span className="rounded-full bg-[#fff0ed] px-2.5 py-1 text-[11px] font-bold text-[#ff624d]">
                  {subCategories.length}
                </span>

              </div>

              <p className="mt-1 text-sm text-gray-500">
                Manage the subcategories belonging to this category.
              </p>

            </div>

            <button
              onClick={subHandle}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#ff624d] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e95340] hover:shadow-md"
            >
              <span className="text-lg leading-none">
                +
              </span>

              Add Subcategory
            </button>

          </div>

          {/* Table Header */}
          {subCategories.length > 0 && (
            <div className="grid grid-cols-[minmax(0,1fr)_120px_140px_80px] items-center border-b border-[#eee2dd] bg-[#fffaf8] px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">

              <span>
                Subcategory
              </span>

              <span>
                Products
              </span>

              <span>
                Status
              </span>

              <span>
                Action
              </span>

            </div>
          )}

          {/* Subcategory List */}
          {subCategories.length > 0 ? (

            <div>
              {listItems}
            </div>

          ) : (

            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-16 text-center">

              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0ed] text-3xl font-light text-[#ff624d]">
                +
              </div>

              <h3 className="text-sm font-bold text-[#171717]">
                No subcategories
              </h3>

              <p className="mt-1.5 max-w-sm text-sm leading-6 text-gray-500">
                This category doesn't have any subcategories yet.
              </p>

              <button
                onClick={subHandle}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#ff624d] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e95340] hover:shadow-md"
              >
                <span className="text-lg leading-none">
                  +
                </span>

                Add Subcategory
              </button>

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

export default CategoryDetails;
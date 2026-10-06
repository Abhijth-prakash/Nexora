import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";
import { getCategory } from "../../redux/features/categorySlice";

const CategoryDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const {
    category,
    subCategories,
    fetchByid,
    Catid,
  } = useAppSelector((state) => state.categoryData);

  const listItems = subCategories.map((item) => (
    <div
      key={item._id}
      className="grid grid-cols-[1fr_140px_160px_100px] items-center border-b border-[#f0e4df] px-6 py-4 last:border-b-0"
    >
      {/* Subcategory */}
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff0ed] text-sm font-semibold text-[#ff624d]">
          {item.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="text-sm font-semibold text-[#171717]">
            {item.name}
          </p>

          <p className="text-xs text-gray-400">
            {item.slug}
          </p>
        </div>
      </div>

      {/* Product Count */}
      <div>
        <p className="text-sm font-semibold text-[#171717]">
          {item.productCount}
        </p>

        <p className="text-xs text-gray-400">
          Products
        </p>
      </div>

      {/* Status */}
      <div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            item.isVisible
              ? "bg-green-50 text-green-600"
              : "bg-yellow-50 text-yellow-600"
          }`}
        >
          {item.isVisible ? "Visible" : "Hidden"}
        </span>
      </div>

      {/* Action */}
      <div>
        <button className="text-xs font-medium text-red-500 transition hover:text-red-700">
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
      <div className="w-full">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-[#ff624d]">
              Category Management
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
              Category Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage category information and subcategories.
            </p>
          </div>

          <button className="w-fit rounded-lg bg-[#ff624d] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e95340]">
            Edit Category
          </button>
        </div>

        {/* Category Information */}
        <div className="mb-6 w-full overflow-hidden rounded-xl border border-[#eee2dd] bg-white shadow-sm">

          {/* Card Header */}
          <div className="border-b border-[#eee2dd] px-6 py-5">
            <h2 className="text-lg font-semibold text-[#171717]">
              Category Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Basic information about this category.
            </p>
          </div>

          {/* Category Details */}
          <div className="grid grid-cols-1 gap-6 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4">

            {/* Name */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                Category Name
              </p>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff0ed] text-base font-bold text-[#ff624d]">
                  {category?.name?.charAt(0).toUpperCase()}
                </div>

                <p className="text-sm font-semibold text-[#171717]">
                  {category?.name}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                Description
              </p>

              <p className="text-sm text-gray-700">
                {category?.description || "No description"}
              </p>
            </div>

            {/* Products */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                Products
              </p>

              <p className="text-2xl font-bold text-[#171717]">
                {category?.productCount ?? 0}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                Status
              </p>

              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                  category?.isVisible
                    ? "bg-green-50 text-green-600"
                    : "bg-yellow-50 text-yellow-600"
                }`}
              >
                {category?.isVisible ? "Visible" : "Hidden"}
              </span>
            </div>
          </div>

          {/* Slug */}
          <div className="border-t border-[#eee2dd] px-6 py-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
              Slug
            </p>

            <p className="text-sm text-gray-600">
              {category?.slug}
            </p>
          </div>
        </div>

        {/* Subcategories */}
        <div className="w-full overflow-hidden rounded-xl border border-[#eee2dd] bg-white shadow-sm">

          {/* Header */}
          <div className="flex flex-col gap-3 border-b border-[#eee2dd] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#171717]">
                Subcategories
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the subcategories belonging to this category.
              </p>
            </div>

          </div>

          {/* Table Header */}
          {subCategories.length > 0 && (
            <div className="grid grid-cols-[1fr_140px_160px_100px] items-center border-b border-[#eee2dd] bg-[#fffaf8] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <span>Subcategory</span>
              <span>Products</span>
              <span>Status</span>
              <span>Action</span>
            </div>
          )}

          {/* Subcategory List */}
          {subCategories.length > 0 ? (
            <div>
              {listItems}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0ed] text-2xl text-[#ff624d]">
                +
              </div>

              <h3 className="text-sm font-semibold text-[#171717]">
                No subcategories
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                This category doesn't have any subcategories yet.
              </p>

              <button className="mt-5 rounded-lg bg-[#ff624d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e95340]">
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
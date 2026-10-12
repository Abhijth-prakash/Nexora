
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getallCategories,
  getCategory,
} from "../../redux/features/categorySlice";
import { useForm } from "react-hook-form";
import { productSchema, type ProductFormData } from "../../utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProduct } from "../../redux/features/ProductSlice";
import { toast } from "react-toastify";

export type props = {
  onClose: () => void;
};

const ProductForm = ({ onClose }: props) => {
  const dispatch = useAppDispatch();


  const { fetched, categories, subCategories,error } = useAppSelector(
    (state) => state.categoryData
  );

  const [category, setCategory] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [previmage, setPrevimage] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [formError, setFormError] = useState("");
  const [clothing,setClothing] = useState(false)

  // Image preview logic
  const fileHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setPrevimage((prev) => [...prev, result]);
        }
      };
    });

    e.target.value = "";
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(productSchema) });

  // Fetch categories
  useEffect(() => {
    if (!fetched) {
      dispatch(getallCategories());
    }
  }, [fetched, dispatch]);

  // Fetch subcategories for selected category
  useEffect(() => {
    setSubCategory("");

    if (category) {
      dispatch(getCategory(category));
    }
  }, [category, dispatch]);

  // Submit product
  const dataHandle = async (data: ProductFormData) => {
    try {
      if (!category) {
        setFormError("Please select a category");
        toast.error("Please select a category");
        return;
      }

      if (!subcategory) {
        setFormError("Please select a subcategory");
        toast.error("Please select a subcategory");
        return;
      }

      if (images.length === 0) {
        setFormError("Please upload at least one image");
        toast.error("Please upload at least one image");
        return;
      }

      if (images.length > 5) {
        setFormError("You can upload a maximum of 5 images");
        toast.error("You can upload a maximum of 5 images");
        return;
      }

      console.log(images.length);

      setFormError("");

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("brand", data.brand);
      formData.append("color", data.color ?? "");
      formData.append("stock", String(data.stock));
      formData.append("price", String(data.price));
      formData.append("rating", String(data.rating));
      formData.append("category", category);
      formData.append("subCategory", subcategory);
      formData.append("size", JSON.stringify(data.size));

      images.forEach((img) => {
        formData.append("images", img);
      });

      await dispatch(addProduct(formData)).unwrap()

      toast.success("Product added successfully!");
      dispatch(getallCategories())
      onClose();
    } catch (error: unknown) {
  toast.error(
    typeof error === "string"
      ? error
      : "Failed to add product. Please try again."
  );
}
  };

  const inputClass =
    "w-full rounded-md border border-[#E4E0DD] bg-white px-3 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#B5AAA4] focus:border-[#F87552] focus:ring-2 focus:ring-[#F87552]/15";

  const labelClass = "mb-1.5 block text-xs font-semibold text-[#111111]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/50 p-3 backdrop-blur-[2px] sm:p-5"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#E4E0DD] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Security banner */}
        <div className="shrink-0 bg-[#101010] px-3 py-2 text-center text-[9px] font-medium uppercase tracking-[0.12em] text-white/80 sm:tracking-[0.16em]">
          Nexora Admin Portal | Secure Store Management
        </div>

        {/* Fixed header */}
        <header className="flex shrink-0 items-center justify-between border-b border-[#E4E0DD] bg-white px-5 py-4 sm:px-8">
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-bold tracking-tight text-[#111111]">
                Nexora
              </h2>
              <span className="text-[10px] font-medium uppercase tracking-wider text-[#8A756B]">
                Admin
              </span>
            </div>
            <p className="mt-1 text-sm text-[#8A756B]">
              Add a new product to your store
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E4E0DD] text-2xl leading-none text-[#8A756B] transition hover:border-[#F87552] hover:bg-[#FFF1ED] hover:text-[#F87552]"
          >
            &times;
          </button>
        </header>

        {/* Scrollable form area */}
        <form
          onSubmit={handleSubmit(dataHandle)}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8"
        >
          <div className="space-y-6">
            {/* Category and subcategory */}
            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-[#111111]">
                  Product classification
                </h3>
                <p className="mt-1 text-xs text-[#8A756B]">
                  Choose where this product belongs.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Category</label>
              <select
  name="category"
  value={category}
  onChange={(e) => {
    const selectedCategoryId = e.target.value;
    setCategory(selectedCategoryId);

    const selectedCategory = categories.find(
      (item) => item._id === selectedCategoryId
    );

    setClothing(
      selectedCategory?.name.toLowerCase() === "clothing"
    );
  }}
  className={inputClass}
>
  <option value="">Select category</option>

  {categories.map((item) => (
    <option key={item._id} value={item._id}>
      {item.name}
    </option>
  ))}
</select>
                </div>



                <div>
                  <label className={labelClass}>Subcategory</label>
                  <select
                    name="subcategory"
                    value={subcategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    disabled={!category}
                    className={`${inputClass} disabled:cursor-not-allowed disabled:bg-[#F7F6F4] disabled:text-[#B5AAA4]`}
                  >
                    <option value="">Select subcategory</option>
                    {subCategories.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <div className="h-px bg-[#E4E0DD]" />

            {/* Basic information */}
            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-[#111111]">
                  Basic information
                </h3>
                <p className="mt-1 text-xs text-[#8A756B]">
                  Add the product details displayed to customers.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Product name</label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                    })}
                    placeholder="e.g. Classic Cotton T-Shirt"
                    className={inputClass}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    placeholder="Describe the product and its key features..."
                    rows={3}
                    className={`${inputClass} resize-y`}
                  />
                  {errors.description && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Color</label>
                    <input
                      type="text"
                      {...register("color")}
                      placeholder="e.g. Black"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Brand</label>
                    <input
                      type="text"
                      {...register("brand", {
                        required: "Brand is required",
                      })}
                      placeholder="Enter brand name"
                      className={inputClass}
                    />
                    {errors.brand && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.brand.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-[#E4E0DD]" />

            {/* Pricing and inventory */}
            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-[#111111]">
                  Pricing & inventory
                </h3>
                <p className="mt-1 text-xs text-[#8A756B]">
                  Set the product price, stock, and rating.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>Price (₹)</label>
                  <input
                    type="number"
                    {...register("price", {
                      required: "Price is required",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Price cannot be negative",
                      },
                    })}
                    placeholder="0.00"
                    className={inputClass}
                  />
                  {errors.price && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Stock quantity</label>
                  <input
                    type="number"
                    {...register("stock", {
                      required: "Stock is required",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Stock cannot be negative",
                      },
                    })}
                    placeholder="0"
                    className={inputClass}
                  />
                  {errors.stock && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.stock.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Rating (0–5)</label>
                  <input
                    type="number"
                    {...register("rating", {
                      valueAsNumber: true,
                      min: 0,
                      max: 5,
                    })}
                    placeholder="0"
                    min={0}
                    max={5}
                    step={0.1}
                    className={inputClass}
                  />
                </div>
              </div>

              {clothing && <div className="mt-4">
                <label className={labelClass}>Available sizes</label>
                <input
                  type="text"
                  {...register("size", {
                    setValueAs: (value: string) =>
                      value
                        .split(",")
                        .map((size: string) => size.trim())
                        .filter(Boolean),
                  })}
                  placeholder="S, M, L, XL"
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs text-[#8A756B]">
                  Separate each size with a comma.
                </p>
              </div>}
            </section>

            <div className="h-px bg-[#E4E0DD]" />

            {/* Product images */}
            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-[#111111]">
                  Product images
                </h3>
                <p className="mt-1 text-xs text-[#8A756B]">
                  Upload up to 5 images to showcase your product.
                </p>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#D8CEC8] bg-[#F7F6F4] px-4 py-6 text-center transition hover:border-[#F87552] hover:bg-[#FFF7F4]">
                <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#FCE5DF] text-[#F87552]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.7}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16V4m0 0L8 8m4-4 4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"
                    />
                  </svg>
                </span>

                <span className="text-sm font-semibold text-[#111111]">
                  Click to upload images
                </span>
                <span className="mt-1 text-xs text-[#8A756B]">
                  Image files only · Maximum 5 images
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={fileHandle}
                  className="sr-only"
                />
              </label>

              {/* Existing image preview logic preserved */}
              {previmage.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {previmage.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="h-20 w-20 rounded-md border border-[#E4E0DD] object-cover"
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Form error */}
            {formError && (
              <p className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </p>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-7 flex shrink-0 flex-col-reverse gap-3 border-t border-[#E4E0DD] bg-white pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] text-[#8A756B]">
              Nexora Admin · Secure product management
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-[#E4E0DD] px-5 py-2.5 text-sm font-medium text-[#5F514A] transition hover:bg-[#F7F6F4]"
              >
                Cancel
              </button>

              <input
                type="submit"
                value="Create Product"
                className="cursor-pointer rounded-md bg-[#F87552] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E96543] focus:outline-none focus:ring-2 focus:ring-[#F87552]/30 focus:ring-offset-2"
              />
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

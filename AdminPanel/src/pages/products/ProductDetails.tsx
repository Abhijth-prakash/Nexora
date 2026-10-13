import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductbyid } from "../../redux/features/ProductSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import VariantForm from "./VariantForm";
import VarientDelete from "./VarientDelete";

const STAR_PATH =
  "M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.191l4.07 2.485c.715.436 1.6-.207 1.405-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.651l-4.752-.382-1.831-4.4Z";

const StarRating = ({ rating }: { rating?: number }) => {
  const value = Math.max(0, Math.min(5, rating ?? 0));

  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));

        return (
          <span key={i} className="relative inline-block h-4 w-4 shrink-0">
            {/* empty star */}
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 max-w-none text-gray-300"
            >
              <path d={STAR_PATH} />
            </svg>

            {/* filled star, clipped to the fraction */}
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 max-w-none text-amber-400"
              >
                <path d={STAR_PATH} />
              </svg>
            </span>
          </span>
        );
      })}
      <span className="ml-1.5 text-xs font-medium text-gray-500">
        {value.toFixed(1)}
      </span>
    </div>
  );
};

const ProductDetails = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const { product,productId } = useAppSelector((state) => state.productData);
  const [form,setForm] = useState(false)
  const [category,setCategory] = useState("")
  const [remove,setRemove] = useState(false)
  const [variantId,setVariantId] = useState('')


  useEffect(() => {
    if (id) {
      if(productId!==id){
        dispatch(getProductbyid(id));
      }
      
    }
  }, [dispatch, id]);

  //formhandle
  const formhandle = ()=>{
    setForm(true)
    if(product?.category){
          setCategory(product?.category.name)
    }

  }

  const onClose = ()=>{
    setForm(false)
    setCategory("")
  }

  //deletehandle
  const deleteHandle = (id:string)=>{
      setRemove(true)
      setVariantId(id)
  }

  const Close = ()=>{
    setRemove(false)
    setVariantId("")
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center bg-gray-50">
        <p className="text-sm font-medium text-gray-500">
          Loading product details...
        </p>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen w-full bg-[#f8f9fb] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
      {remove && product._id && <VarientDelete variantId={variantId} Close={Close} id={product._id}></VarientDelete>}
      {form && product._id&& <VariantForm onClose={onClose} id={product._id} category={category} ></VariantForm>}
      <div className="w-full space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-[#ff624d]">
              Product Management / Details
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View product information and manage its variants.
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
              product.visible
                ? "bg-emerald-50 text-emerald-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                product.visible ? "bg-emerald-500" : "bg-gray-400"
              }`}
            />
            {product.visible ? "Published" : "Hidden"}
          </span>
        </div>

        {/* Product Overview */}
        <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
          {/* Product Images */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="font-bold text-gray-900">Product Images</h2>
              <p className="mt-1 text-xs text-gray-500">
                {product.images?.length ?? 0} images
              </p>
            </div>

            {product.images?.length ? (
              <div className="grid grid-cols-2 gap-3 p-5">
                {product.images.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className={`overflow-hidden rounded-xl border border-gray-100 bg-gray-50 ${
                      index === 0 ? "col-span-2" : ""
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className={`w-full object-contain ${
                        index === 0 ? "h-64 sm:h-80" : "h-36 sm:h-44"
                      }`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-gray-400">
                No product images available
              </div>
            )}
          </section>

          {/* Product Information */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="font-bold text-gray-900">
                Product Information
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Basic product details and classification.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-5 sm:grid-cols-2 2xl:grid-cols-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Product Name
                </p>
                <p className="mt-2 break-words text-sm font-semibold text-gray-900">
                  {product.name}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Brand
                </p>
                <p className="mt-2 break-words text-sm font-semibold text-gray-900">
                  {product.brand}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Color
                </p>
                <p className="mt-2 break-words text-sm font-semibold capitalize text-gray-900">
                  {product.color || "—"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Base Price
                </p>
                <p className="mt-2 text-xl font-bold text-[#ff624d]">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Stock
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {product.stock} units
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Category
                </p>
                <p className="mt-2 break-words text-sm font-semibold text-gray-900">
                  {product.category?.name ?? "—"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Subcategory
                </p>
                <p className="mt-2 break-words text-sm font-semibold text-gray-900">
                  {product.subCategory?.name ?? "—"}
                </p>
              </div>

              <div className="sm:col-span-2 2xl:col-span-3">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Description
                </p>
                <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-gray-600">
                  {product.description}
                </p>
              </div>

              <div className="sm:col-span-2 2xl:col-span-3">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Product Sizes
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {product.size?.length ? (
                    product.size.map((size) => (
                      <span
                        key={size}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                      >
                        {size}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">
                      No sizes specified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Product Variants */}
        <section className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Product Variants
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Individual color, size, pricing, and inventory options.
              </p>
            </div>

            <button
            onClick={()=> formhandle()}
              type="button"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#ff624d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ed503c]"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 5v14m-7-7h14"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Add Variant
            </button>
          </div>

          <div className="border-b border-gray-100 px-5 py-3">
            <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#ff624d]">
              {product.variants?.length ?? 0} variants
            </span>
          </div>

          {!product.variants?.length ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#ff624d]">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 5v14m-7-7h14"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                No variants available
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                This product currently has no additional variants.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {product.variants.map((variant, index) => (
                <article
                  key={variant._id ?? index}
                  className="min-w-0 overflow-hidden rounded-xl border border-gray-200 transition hover:border-gray-300 hover:shadow-sm"
                >
                  {/* Variant Image */}
                  <div className="relative flex h-48 items-center justify-center bg-gray-50">
                    {variant.images?.[0] ? (
                      <img
                        src={variant.images[0]}
                        alt={`${variant.color ?? "Product"} variant`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <svg
                        className="h-10 w-10 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}

                    <span className="absolute left-3 top-3 rounded-lg border border-gray-200 bg-white/95 px-2.5 py-1 text-xs font-semibold text-gray-600">
                      Variant {index + 1}
                    </span>
                  </div>

                  {/* Variant Details */}
                  <div className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400">
                          Variant price
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          ₹{variant.price.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          variant.stock > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {variant.stock > 0
                          ? `${variant.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="min-w-0 rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-400">Color</p>
                        <p className="mt-1 break-words text-sm font-medium capitalize text-gray-800">
                          {variant.color || "—"}
                        </p>
                      </div>

                      {(variant.size?.length ?? 0) > 0 ? (
                        <div className="min-w-0 rounded-lg bg-gray-50 p-3">
                          <p className="text-xs text-gray-400">Size</p>
                          <p className="mt-1 break-words text-sm font-medium text-gray-800">
                            {variant.size?.join(", ")}
                          </p>
                        </div>
                      ) : (
                        <div className="min-w-0 rounded-lg bg-gray-50 p-3">
                          <p className="text-xs text-gray-400">Rating</p>
                          <div className="mt-1">
                            <StarRating rating={variant.rating} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Available images</span>
                      <span className="font-semibold text-gray-700">
                        {variant.images?.length ?? 0}
                      </span>
                    </div>

                   <button
  type="button"
  onClick={() => {
    if (variant._id) {
      deleteHandle(variant._id)
    }
  }}
  className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
>
  Delete Variant
</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from "react-toastify"
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getProductbyID } from '../../redux/features/productSlice'
import { addToCart, setGuestItems } from '../../redux/features/cartSlice'
import type { BaseProduct } from '../../utils/baseTypes'
import { addToGuestCart } from '../../utils/guestCart'

type Variant = NonNullable<BaseProduct['variants']>[number]

const Product = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const { product } = useAppSelector(state => state.productData)
  const { logged } = useAppSelector(state => state.userData)
  const navigate = useNavigate()

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [size, setSize] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [tab, setTab] = useState<'description' | 'specifications' | 'reviews'>('description')
  const [quantity, setQuantiy] = useState(1)
  
  

  useEffect(() => {
    if (id) {
      dispatch(getProductbyID(id))
    }
  }, [])

  if (!product) {
    return (
      <main className="w-full px-4 py-6 sm:px-6 lg:px-16" aria-busy="true">
        <div className="grid grid-cols-1 gap-6 animate-pulse lg:grid-cols-2 lg:gap-8">
          {/* Gallery skeleton */}
          <div className="flex min-w-0 flex-col-reverse gap-4 rounded-lg border border-gray-200 bg-white p-3 sm:flex-row sm:p-4">
            <div className="h-[300px] min-w-0 flex-1 rounded-lg bg-gray-200 sm:h-[420px]" />

            <div className="flex flex-row gap-3 overflow-hidden sm:flex-col">
              {[1, 2, 3, 4].map(item => (
                <div
                  key={item}
                  className="h-14 w-14 shrink-0 rounded bg-gray-200 sm:h-16 sm:w-16"
                />
              ))}
            </div>
          </div>

          {/* Product details skeleton */}
          <div className="min-w-0 space-y-6">
            <div className="space-y-3">
              <div className="h-7 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/4 rounded bg-gray-200" />
              <div className="h-3 w-1/3 rounded bg-gray-200" />
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="h-8 w-1/3 rounded bg-gray-200" />
              <div className="h-3 w-1/4 rounded bg-gray-200" />
            </div>

            <div className="flex flex-wrap gap-3">
              {[1, 2, 3].map(item => (
                <div
                  key={item}
                  className="h-16 w-24 rounded-lg bg-gray-200"
                />
              ))}
            </div>

            <div className="space-y-3">
              <div className="h-4 w-16 rounded bg-gray-200" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map(item => (
                  <div
                    key={item}
                    className="h-10 w-12 rounded-lg bg-gray-200"
                  />
                ))}
              </div>
            </div>

            <div className="h-10 w-32 rounded-lg bg-gray-200" />

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="h-12 flex-1 rounded-lg bg-gray-200" />
              <div className="h-12 flex-1 rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="mt-8 space-y-5 rounded-lg border border-gray-200 bg-white p-4 animate-pulse sm:p-6">
          <div className="h-5 w-64 max-w-full rounded bg-gray-200" />
          <div className="h-3 w-full rounded bg-gray-200" />
          <div className="h-3 w-4/5 rounded bg-gray-200" />
        </div>
      </main>
    )
  }

  const variants = product.variants ?? []

  const price = selectedVariant ? selectedVariant.price : product.price
  const stock = selectedVariant ? selectedVariant.stock : product.stock
  const images = selectedVariant?.images?.length ? selectedVariant.images : product.images ?? []
  const sizes = selectedVariant?.size?.length ? selectedVariant.size : product.size ?? []
  const colorLabel = selectedVariant ? selectedVariant.color : product.color

  const sizeOk = sizes.length === 0 || !!size
  const outOfStock = stock <= 0
  const canBuy = sizeOk && !outOfStock

  const selectVariant = (variant: Variant | null) => {
    setSelectedVariant(variant)
    setSize(null)
    setActiveImage(0)
    setQuantiy(1)
  }

const cartHandle = async () => {
  if (!canBuy) return

  
  if (!logged) {
    const items = addToGuestCart({
      productId: product._id,
      variantId: selectedVariant?._id ?? null,
      size: sizes.length > 0 ? size : null,
      quantity,
      name: product.name,
      image: images[0],
      price,
      brand: product.brand,
      stock,
    })

    dispatch(setGuestItems(items))
    setQuantiy(1)
    toast.success('Added to bag')

    return
  }

  
  try {
    await dispatch(
      addToCart({
        productId: product._id,
        variantId: selectedVariant?._id ?? null,
        size: sizes.length > 0 ? size : null,
        quantity,
      })
    ).unwrap()

    setQuantiy(1)
    toast.success('Added to bag')
  } catch (err) {
    toast.error(typeof err === 'string' ? err : 'Could not add to bag')
  }
}



  return (
    <main className="w-full px-4 py-6 sm:px-6 lg:px-16">
      {/* Product gallery and details */}
      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">

        {/* Gallery */}
        <div className="flex min-w-0 flex-col-reverse gap-3 rounded-lg border border-gray-200 bg-white p-3 sm:flex-row sm:gap-4 sm:p-4">
          <div className="flex min-w-0 flex-1 items-center justify-center overflow-hidden rounded-lg bg-white">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="h-[300px] w-full object-contain sm:h-[420px]"
            />
          </div>

          <div className="flex flex-row gap-3 overflow-x-auto sm:flex-col sm:overflow-x-visible">
            {images.map((img, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveImage(index)}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded border sm:h-16 sm:w-16 ${
                  activeImage === index ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="min-w-0 space-y-5">
          <div>
            <h1 className="break-words text-2xl font-semibold text-gray-900">
              {product.name}
            </h1>
            <p className="mt-1 text-xs text-gray-500">{product.brand}</p>
            <p className="mt-2 text-xs text-red-500">
              ★ {product.rating} ({product.numReviews} Reviews)
            </p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <span className="text-2xl font-bold text-red-500">₹{price}</span>
            <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes</p>
          </div>

          {/* Variants */}
          {variants.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800">
                Options <span className="font-normal text-gray-500">: {colorLabel || 'Default'}</span>
              </p>

              <div className="flex flex-wrap gap-3">
                {/* Original product */}
                <button
                  type="button"
                  onClick={() => selectVariant(null)}
                  className={`flex max-w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${
                    selectedVariant === null ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  {product.images?.[0] && (
                    <img src={product.images[0]} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
                  )}

                  <span>
                    <span className="block text-gray-800">{product.color || 'Default'}</span>
                    <span className="block text-xs text-gray-500">₹{product.price}</span>
                  </span>
                </button>

                {/* Each variant */}
                {variants.map((v, index) => (
                  <button
                    key={v._id}
                    type="button"
                    onClick={() => selectVariant(v)}
                    className={`flex max-w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${
                      selectedVariant?._id === v._id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    {v.images?.[0] && (
                      <img src={v.images[0]} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
                    )}

                    <span>
                      <span className="block text-gray-800">{v.color || `Variant ${index + 1}`}</span>
                      <span className="block text-xs text-gray-500">₹{v.price}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800">Size</p>

              <div className="flex flex-wrap gap-2">
                {sizes.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`h-10 min-w-10 rounded-lg border px-3 text-sm ${
                      size === s
                        ? 'border-red-500 bg-red-50 text-red-500'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!sizeOk && <p className="text-xs text-gray-500">Select a size to continue</p>}
          {outOfStock && <p className="text-sm text-red-500">Out of stock</p>}

          {/* Quantity */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-800">Quantity</p>

            <div className="inline-flex items-center rounded-lg border border-gray-300">
              <button
                type="button"
                onClick={() => setQuantiy(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className="h-10 w-10 text-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40"
              >
                −
              </button>

              <span className="w-12 text-center text-sm font-medium text-gray-900">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantiy(prev => Math.min(stock, prev + 1))}
                disabled={quantity >= stock}
                className="h-10 w-10 text-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={cartHandle}
              type="button"
              disabled={!canBuy}
              className="flex-1 rounded-lg bg-red-500 px-4 py-3 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to Bag
            </button>

            <button
              type="button"
              disabled={!canBuy}
              className="flex-1 rounded-lg border border-red-500 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="flex gap-4 overflow-x-auto border-b border-gray-200 px-4 sm:gap-6 sm:px-6">
          {(['description', 'specifications', 'reviews'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 py-3 text-sm capitalize ${
                tab === t ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="break-words p-4 text-sm text-gray-600 sm:p-6">
          {tab === 'description' && <p>{product.description}</p>}
          {tab === 'specifications' && <p>No specifications added yet.</p>}
          {tab === 'reviews' && <p>No reviews yet.</p>}
        </div>
      </div>
    </main>
  )
}

export default Product

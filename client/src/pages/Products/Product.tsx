import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getProductbyID } from '../../redux/features/productSlice'
import Navbar from '../../components/Navbar'

const Product = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const { product } = useAppSelector(state => state.productData)

  const [selected, setSelected] = useState(0) // 0 = normal product, 1+ = variants
  const [size, setSize] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [tab, setTab] = useState<'description' | 'specifications' | 'reviews'>('description')

  useEffect(() => {
    if (id) {
      dispatch(getProductbyID(id))
    }
  }, [])

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
      </div>
    )
  }

  // option 0 is the normal product, the rest are its variants
  const options = [
    {
      label: product.color || 'Default',
      price: product.price,
      stock: product.stock,
      images: product.images ?? [],
      sizes: product.size ?? [],
    },
    ...(product.variants ?? []).map((v, i) => ({
      label: v.color || `Variant ${i + 1}`,
      price: v.price,
      stock: v.stock,
      images: v.images?.length ? v.images : product.images ?? [],
      sizes: v.size?.length ? v.size : product.size ?? [],
    })),
  ]

  const current = options[selected] ?? options[0]
  const sizeOk = current.sizes.length === 0 || !!size
  const outOfStock = current.stock <= 0
  const canBuy = sizeOk && !outOfStock

  const selectOption = (index: number) => {
    setSelected(index)
    setSize(null)
    setActiveImage(0)
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Navbar />

      <main className="w-full px-6 py-6 lg:px-16">
      

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* gallery */}
          <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex-1">
              <img
                src={current.images[activeImage]}
                alt={product.name}
                className="h-[420px] w-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-3">
              {current.images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`h-16 w-16 overflow-hidden rounded border ${
                    activeImage === index ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* details */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
              <p className="mt-1 text-xs text-gray-500">{product.brand}</p>
              <p className="mt-2 text-xs text-red-500">
                ★ {product.rating} ({product.numReviews} Reviews)
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <span className="text-2xl font-bold text-red-500">₹{current.price}</span>
              <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes</p>
            </div>

            {/* options: normal + variants */}
            {options.length > 1 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">
                  Options <span className="font-normal text-gray-500">: {current.label}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {options.map((opt, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectOption(index)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${
                        selected === index
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                    >
                      {opt.images[0] && (
                        <img src={opt.images[0]} alt="" className="h-10 w-10 rounded object-cover" />
                      )}
                      <span>
                        <span className="block text-gray-800">{opt.label}</span>
                        <span className="block text-xs text-gray-500">₹{opt.price}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* sizes */}
            {current.sizes.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">Size</p>
                <div className="flex flex-wrap gap-2">
                  {current.sizes.map(s => (
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

            {/* actions */}
            <div className="flex gap-3">
              <button
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

        {/* tabs */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-white">
          <div className="flex gap-6 border-b border-gray-200 px-6">
            {(['description', 'specifications', 'reviews'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`py-3 text-sm capitalize ${
                  tab === t ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="p-6 text-sm text-gray-600">
            {tab === 'description' && <p>{product.description}</p>}
            {tab === 'specifications' && <p>No specifications added yet.</p>}
            {tab === 'reviews' && <p>No reviews yet.</p>}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Product
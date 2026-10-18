import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { addpage, getProducts, minupage } from '../../redux/features/productSlice'
import Navbar from '../../components/Navbar'
import CategorySidebar from '../../components/CategorySidebar'
import BrandFilter from '../../components/BrandFilter'
import PriceRangeFilter from '../../components/PriceRangeFilter'

const LIMIT = 12

const ProductList = () => {
    const {slug} = useParams()
    const dispatch = useAppDispatch()
    const {products,page,brand,category,subCategory,categoryTree,loading} = useAppSelector(state=> state.productData)
    const [sort, setSort] = useState('')

    // becomes true after the first request finishes, so "No products found" doesn't flash before loading
    const [fetched, setFetched] = useState(false)

    const [priceRange, setPriceRange] = useState({
      minPrice: 0,
      maxPrice: 10000,
    })

    // 0 / 0 means no price filter
    const [appliedPrice, setAppliedPrice] = useState({
      minPrice: 0,
      maxPrice: 0,
    })

    useEffect(() => {
      const minprice = appliedPrice.minPrice
      const maxprice = appliedPrice.maxPrice
      if (slug) {
        dispatch(getProducts({ limit: LIMIT, slug, page, subCategory, category, brand, minprice, maxprice, sort }))
          .finally(() => setFetched(true))
      }
    }, [slug, page, category, subCategory, brand, sort, appliedPrice])


    const handlePriceChange = ({
      minPrice,
      maxPrice,
    }: {
      minPrice: number
      maxPrice: number
    }) => {
      setPriceRange({ minPrice, maxPrice })
    }

    const handleApplyPrice = () => {
      setAppliedPrice(priceRange)
    }

    const handleResetPrice = () => {
      setPriceRange({
        minPrice: 0,
        maxPrice: 10000,
      })
      setAppliedPrice({
        minPrice: 0,
        maxPrice: 0,
      })
    }

    const currentCategory = categoryTree.find(c => c._id === slug)
    const title = currentCategory?.name ?? 'Products'

    const isEmpty = fetched && !loading && products.length === 0
    const isLoadingFirst = !fetched || (loading && products.length === 0)
    const isLastPage = products.length < LIMIT

    const renderStars = (rating: number) => {
      const filled = Math.round(rating)
      return (
        <span className="text-xs tracking-tight text-red-500">
          {'★'.repeat(filled)}
          <span className="text-gray-300">{'★'.repeat(5 - filled)}</span>
        </span>
      )
    }

    const productList = products.map(item => (
      <li key={item._id}>
        <Link
          to={`/product/${item._id}`}
          className="group relative block overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
        >
          <button
            type="button"
            onClick={e => e.preventDefault()}
            aria-label="Add to wishlist"
            className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-sm text-gray-500 hover:text-red-500"
          >
            ♡
          </button>

          <div className="m-2 flex h-56 items-center justify-center overflow-hidden rounded-md bg-gray-100">
            <img
              src={item.images[0]}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="space-y-1 px-3 pb-3 pt-1">
            <h3 className="truncate text-xs font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm font-semibold text-red-600">₹{item.price}</p>
            <div className="flex items-center gap-1">
              {renderStars(item.rating)}
              <span className="text-[10px] text-gray-400">({item.numReviews})</span>
            </div>
          </div>
        </Link>
      </li>
    ))

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Navbar></Navbar>

      <div className="w-full px-6 py-6 lg:px-16">

        {/* breadcrumb */}
        <p className="mb-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-red-600">Home</Link>
          {' / '}
          <span className="text-red-600">{title}</span>
        </p>

        {/* heading + sort */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="mt-1 text-xs text-gray-500">
              {isEmpty ? 'No results' : `Showing ${products.length} results on page ${page}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-xs text-gray-500">Sort by:</label>
            <select
              id="sort"
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-red-500"
            >
              <option value="">Default</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="new">Newest</option>
            </select>
          </div>
        </div>

        <div className="flex w-full gap-6">

          {/* sidebar */}
          <aside className="w-64 shrink-0 space-y-4 xl:w-72">
            <CategorySidebar></CategorySidebar>

            <div className="space-y-5 rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-gray-900">Filters</h2>

              <PriceRangeFilter
                minPrice={priceRange.minPrice}
                maxPrice={priceRange.maxPrice}
                onChange={handlePriceChange}
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleApplyPrice}
                  className="flex-1 rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                >
                  Apply
                </button>

                <button
                  type="button"
                  onClick={handleResetPrice}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                >
                  Reset
                </button>
              </div>

              <BrandFilter></BrandFilter>
            </div>
          </aside>

          {/* products */}
          <main className="min-w-0 flex-1">
            {isLoadingFirst ? (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <li key={i} className="h-72 animate-pulse rounded-lg border border-gray-200 bg-white" />
                ))}
              </ul>
            ) : isEmpty ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-8 w-8 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.2-5.2m0 0A7.5 7.5 0 1 0 5.2 5.2a7.5 7.5 0 0 0 10.6 10.6Z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">No products found</h2>
                <p className="mt-1 max-w-xs text-sm text-gray-500">
                  We couldn't find anything that matches your filters. Try changing the category, brand or price range.
                </p>

                <div className="mt-5 flex gap-3">
                  {page > 1 && (
                    <button
                      type="button"
                      onClick={()=>dispatch(minupage())}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      ← Previous page
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetPrice}
                    className="rounded-md bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700"
                  >
                    Reset price
                  </button>
                </div>
              </div>
            ) : (
              <>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {productList}
                </ul>

                {/* pagination */}
                <div className="mt-8 flex items-center justify-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={()=>dispatch(minupage())}
                    disabled={page===1}
                    className="text-gray-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Previous
                  </button>

                  <span className="flex h-7 w-7 items-center justify-center rounded bg-red-700 font-medium text-white">
                    {page}
                  </span>

                  <button
                    type="button"
                    onClick={()=>dispatch(addpage())}
                    disabled={isLastPage}
                    className="text-gray-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ProductList
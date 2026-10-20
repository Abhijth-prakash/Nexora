import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { getCategoryTree, setCategory, setSubCategory } from '../redux/features/productSlice'

const CategorySidebar = () => {
  const dispatch = useAppDispatch()
  const { categoryTree, subCategory } = useAppSelector(state => state.productData)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(getCategoryTree())
  }, [dispatch])

  // only set after the user clicks a category
  const active = categoryTree.find(c => c._id === activeId)

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-3 px-1 text-sm font-semibold text-gray-900">Categories</h2>

      <ul className="space-y-1">
        {categoryTree.map(c => {
          const isActive = active?._id === c._id

          return (
            <li key={c._id}>
              <button
                type="button"
                onClick={() => {
                  setActiveId(c._id)
                  dispatch(setCategory(c._id))
                }}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors ${
                  isActive
                    ? 'bg-red-50 font-semibold text-red-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="truncate">{c.name}</span>
                <span
                  className={`ml-2 text-gray-400 transition-transform ${
                    isActive ? 'rotate-90 text-red-500' : ''
                  }`}
                >
                  ›
                </span>
              </button>

              {/* subcategories of the active category */}
              {isActive && c.subCategories.length > 0 && (
                <ul className="mb-1 ml-3 mt-1 space-y-0.5 border-l border-gray-200 pl-3">
                  {c.subCategories.map(s => (
                    <li key={s._id}>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(setCategory(c._id))
                          dispatch(setSubCategory(s._id))
                        }}
                        className={`w-full rounded px-2 py-1.5 text-left text-xs transition-colors ${
                          subCategory === s._id
                            ? 'font-semibold text-red-600'
                            : 'text-gray-600 hover:text-red-600'
                        }`}
                      >
                        {s.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default CategorySidebar
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { getCategoryTree } from '../redux/features/productSlice'

const CategorySidebar = () => {
  const dispatch = useAppDispatch()
  const { categoryTree } = useAppSelector(state => state.productData)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(getCategoryTree())
  }, [dispatch])

  const active = categoryTree.find(c => c._id === activeId) ?? categoryTree[0]

  return (
    <div className="flex gap-4">
      <aside className="w-64 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-3 px-2 font-semibold text-gray-900">Categories</h2>
        <ul className="space-y-1">
          {categoryTree.map(c => (
            <li key={c._id} onMouseEnter={() => setActiveId(c._id)}>
              <Link
                to={`/products/${c.slug}`}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                  active?._id === c._id
                    ? 'bg-red-50 font-semibold text-red-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {c.name}
                <span className="text-gray-400">›</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {active && active.subCategories.length > 0 && (
        <div className="min-w-56 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{active.name}</h3>
          <ul className="space-y-2">
            {active.subCategories.map(s => (
              <li key={s._id}>
                <Link to={`/products/${active.slug}/${s.slug}`} className="text-sm text-gray-600 hover:text-red-600">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CategorySidebar
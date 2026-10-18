import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { setBrand } from '../redux/features/productSlice'

const BrandFilter = () => {
  const dispatch = useAppDispatch()
  const { brands, brand } = useAppSelector(state => state.productData)

  const handleChange = (item: string, checked: boolean) => {
    const next = checked
      ? [...brand, item]
      : brand.filter(b => b !== item)

    dispatch(setBrand(next))
  }

  return (
    <div>
      <h3 className="mb-3 font-semibold text-gray-900">Brand</h3>

      <ul className="max-h-56 space-y-3 overflow-y-auto pr-2">
        {brands.map(item => (
          <li key={item}>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                value={item}
                checked={brand.includes(item)}
                onChange={e => handleChange(item, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              {item}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BrandFilter
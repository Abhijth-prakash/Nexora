
interface PriceRange {
  minPrice: number;
  maxPrice: number;
}

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onChange: (range: PriceRange) => void;
}

const MIN_PRICE = 0;
const MAX_PRICE = 10000;
const STEP = 100;

export default function PriceRangeFilter({
  minPrice,
  maxPrice,
  onChange,
}: PriceRangeFilterProps) {
  const formatPrice = (price: number) =>
    `₹${price.toLocaleString("en-IN")}`;

  const handleMinChange = (value: number) => {
    const nextMin = Math.min(value, maxPrice);

    onChange({
      minPrice: nextMin,
      maxPrice,
    });
  };

  const handleMaxChange = (value: number) => {
    const nextMax = Math.max(value, minPrice);

    onChange({
      minPrice,
      maxPrice: nextMax,
    });
  };

  const reset = () => {
    onChange({
      minPrice: 0,
      maxPrice: 0,
    });
  };

  return (
    <section className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Price
        </h3>

        <button
          type="button"
          onClick={reset}
          className="text-sm font-medium text-gray-500 hover:text-red-700"
        >
          Reset
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="min-price"
            className="mb-2 block text-sm text-gray-600"
          >
            Minimum price
          </label>

          <input
            id="min-price"
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={STEP}
            value={minPrice}
            onChange={(event) =>
              handleMinChange(Number(event.target.value))
            }
            className="w-full cursor-pointer accent-red-700"
          />

          <p className="mt-1 text-sm font-semibold text-gray-900">
            {formatPrice(minPrice)}
          </p>
        </div>

        <div>
          <label
            htmlFor="max-price"
            className="mb-2 block text-sm text-gray-600"
          >
            Maximum price
          </label>

          <input
            id="max-price"
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={STEP}
            value={maxPrice}
            onChange={(event) =>
              handleMaxChange(Number(event.target.value))
            }
            className="w-full cursor-pointer accent-red-700"
          />

          <p className="mt-1 text-sm font-semibold text-gray-900">
            {formatPrice(maxPrice)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 p-3">
        <span className="text-sm text-gray-500">
          Selected range
        </span>

        <span className="text-sm font-semibold text-gray-900">
          {formatPrice(minPrice)} – {formatPrice(maxPrice)}
        </span>
      </div>
    </section>
  );
}

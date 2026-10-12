import { toast } from 'react-toastify'
import { useAppDispatch } from '../../redux/hooks'
import { deleteProduct, getProducts } from '../../redux/features/ProductSlice'

export type props = {
    id: string
    removeClose: () => void
}

const ProductDelete = ({ id, removeClose }: props) => {
    const dispatch = useAppDispatch()

    const Handle = async () => {
        try {
            await dispatch(deleteProduct(id)).unwrap()
            toast.success('Product deleted successfully')
            removeClose()

            const page = 1
            const search = ''
            const filter = ''
            const sort = ''

            dispatch(getProducts({ page, search, filter, sort }))
        } catch (error) {
            toast.error('Failed to delete product')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50">
                        <svg
                            className="h-6 w-6 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.8}
                                d="M12 9v3m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z"
                            />
                        </svg>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Delete product
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Please confirm your action
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <p className="text-sm leading-6 text-gray-600">
                        Are you sure you want to delete this product? This
                        action may not be reversible.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50/70 px-6 py-4">
                    <button
                        type="button"
                        onClick={removeClose}
                        className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={Handle}
                        className="rounded-xl bg-[#ff624d] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ed503c] focus:outline-none focus:ring-2 focus:ring-[#ff624d]/40 focus:ring-offset-2"
                    >
                        Yes, delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductDelete

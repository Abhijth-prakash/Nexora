import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ReviewSchema } from '../utils/Validation'
import { useAppDispatch } from '../redux/hooks'
import { createReview } from '../redux/features/productSlice'
import { toast } from 'react-toastify'

export type reviewInput = z.input<typeof ReviewSchema>
export type reviewForm = z.output<typeof ReviewSchema>

export type CreateReviewPayload = {
    productId: string
    variantId?: string | null
    rating: number
    review?: string | null
}

export type props = {
    productId: string
    variantId?: string | null
    close: () => void
}

const RATING_LABELS: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very good',
    5: 'Excellent',
}

const ReviewForm = ({ productId, variantId = null, close }: props) => {
    const dispatch = useAppDispatch()
    const [hovered, setHovered] = useState(0)

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<reviewInput, unknown, reviewForm>({
        resolver: zodResolver(ReviewSchema),
        defaultValues: { rating: '' } as Partial<reviewInput>,
    })

    const dataHandle = async (data: reviewForm) => {
        const payload: CreateReviewPayload = {
            productId,
            variantId,
            rating: Number(data.rating),
            review: data.review || null,
        }

        try {
            await dispatch(createReview(payload)).unwrap()
            toast.success('Review added successfully')
            reset()
            setHovered(0)
            close()
        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Failed to add review')
        }
    }

    const inputBase =
        'w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2'
    const inputOk = 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
    const inputErr = 'border-red-500 focus:border-red-500 focus:ring-red-200'

    return (
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Write a review</h2>
                <button
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={handleSubmit(dataHandle)} className="space-y-4" noValidate>
                {/* Star rating */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Rating <span className="text-red-500">*</span>
                    </label>

                    <Controller
                        name="rating"
                        control={control}
                        render={({ field }) => {
                            const selected = Number(field.value) || 0
                            const active = hovered || selected

                            return (
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex items-center gap-1"
                                        role="radiogroup"
                                        aria-label="Rating"
                                        onMouseLeave={() => setHovered(0)}
                                    >
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                role="radio"
                                                aria-checked={selected === star}
                                                aria-label={`${star} star${star > 1 ? 's' : ''}`}
                                                onMouseEnter={() => setHovered(star)}
                                                onClick={() => field.onChange(String(star))}
                                                className={`text-3xl leading-none transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                                                    star <= active ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>

                                    {active > 0 && (
                                        <span className="text-sm text-gray-500">
                                            {RATING_LABELS[active]}
                                        </span>
                                    )}
                                </div>
                            )
                        }}
                    />

                    {errors.rating && (
                        <p className="mt-1 text-xs text-red-600">{errors.rating.message}</p>
                    )}
                </div>

                {/* Review text */}
                <div>
                    <label htmlFor="review" className="mb-1 block text-sm font-medium text-gray-700">
                        Review
                    </label>
                    <textarea
                        id="review"
                        rows={4}
                        placeholder="Share your experience with this product"
                        className={`${inputBase} resize-none ${errors.review ? inputErr : inputOk}`}
                        {...register('review')}
                    />
                    {errors.review && (
                        <p className="mt-1 text-xs text-red-600">{errors.review.message}</p>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={close}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit review'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ReviewForm
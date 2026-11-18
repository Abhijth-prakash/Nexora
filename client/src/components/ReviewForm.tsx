import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ReviewSchema } from '../utils/Validation'

export type reviewInput = z.input<typeof ReviewSchema>
export type reviewForm = z.output<typeof ReviewSchema>

export type props = {
    close: () => void
}

const ReviewForm = ({ close }: props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<reviewInput, unknown, reviewForm>({
        resolver: zodResolver(ReviewSchema),
    })

    const dataHandle = (data: reviewForm) => {
        console.log(data) // rating is a number here
    }

    return (
        <div>
            <form onSubmit={handleSubmit(dataHandle)}>
                <input type="text" placeholder="review" {...register('review')} />
                {errors.review && <p>{errors.review.message}</p>}

                <input type="text" placeholder="rating" {...register('rating')} />
                {errors.rating && <p>{errors.rating.message}</p>}

                <input type="submit" />
            </form>

            <button onClick={close}>close</button>
        </div>
    )
}

export default ReviewForm
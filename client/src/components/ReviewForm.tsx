import React from 'react'
import { useForm } from 'react-hook-form'

export type reviewForm = {
    review : string
    rating : string
}

export type props = {
    close : ()=> void
}

const ReviewForm = ({close}:props) => {
    const { register, handleSubmit } = useForm<reviewForm>()

    const dataHandle = (data:reviewForm)=>{
        console.log(data)
    }

  return (
    <div>

        <form onSubmit={handleSubmit(dataHandle)}>
            <input type="text" placeholder='review' {...register('review')} />
            <input type="text" placeholder='rating' {...register('rating')} />
            <input type="submit" />
        </form>
      
    <button onClick={close}>close</button>

    </div>
  )
}

export default ReviewForm

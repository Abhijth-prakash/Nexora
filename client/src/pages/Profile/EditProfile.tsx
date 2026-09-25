import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { editProfile, UserProfile } from "../../redux/features/userSlice"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProfileSchema, type ProfileData } from "../../utils/Validation"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"


const EditProfile = () => {
    const dispatch = useAppDispatch()
    const {user,isStale} = useAppSelector(state=> state.userData)
    const navigate = useNavigate()
    useEffect(()=>{
        if(isStale){
             dispatch(UserProfile())
        }
       
    },[dispatch])


    const {
        register,
        handleSubmit,
        reset,
        formState:{errors, isSubmitting}
    } = useForm<ProfileData>({
        resolver:zodResolver(ProfileSchema)
    })

    // fill the form with the existing values once the profile is loaded
    useEffect(()=>{
        if(user){
            reset({ name: user.name, email: user.email })
        }
    },[user, reset])

    const dataHandle = async (data:ProfileData)=>{
            try{
                await dispatch(editProfile(data)).unwrap()
                navigate('/myprofile')

            }catch(error){
                console.log('failed to update profile',error)
            }
    }
  return (
    <div className="min-h-screen bg-[#f4f4f5]">
        <Navbar></Navbar>

        <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
            {/* Hero header */}
            <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#ff5a1f] via-[#ff6f2f] to-[#ff9a4d] px-6 py-7 shadow-lg shadow-orange-200/60 sm:px-8 sm:py-8">
                <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-24 right-32 h-44 w-44 rounded-full bg-white/10" />

                <div className="relative flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold text-white backdrop-blur">
                        {user?.name?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            Edit profile
                        </h1>
                        <p className="mt-1 text-sm text-orange-50">
                            Update your name and email address.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form card */}
            <form
                onSubmit={handleSubmit(dataHandle)}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
                <div className="flex flex-col gap-5">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-gray-700">
                            Full name
                        </label>
                        <div className="relative">
                            <svg
                                viewBox="0 0 24 24"
                                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <input
                                id="name"
                                {...register('name')}
                                type="text"
                                placeholder="Your full name"
                                className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                                    errors.name
                                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                        : "border-gray-200 hover:border-orange-200 focus:border-[#ff5a1f] focus:ring-orange-100"
                                }`}
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1.5 text-xs font-medium text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">
                            Email address
                        </label>
                        <div className="relative">
                            <svg
                                viewBox="0 0 24 24"
                                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <path d="m3 7 9 6 9-6" />
                            </svg>
                            <input
                                id="email"
                                {...register('email')}
                                type="email"
                                placeholder="you@example.com"
                                className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                                    errors.email
                                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                        : "border-gray-200 hover:border-orange-200 focus:border-[#ff5a1f] focus:ring-orange-100"
                                }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1.5 text-xs font-medium text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/myprofile')}
                        className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-xl bg-[#ff5a1f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-[#e94e16] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {isSubmitting ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default EditProfile
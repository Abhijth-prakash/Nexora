import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  ChangepassValidation,
  type ChangePassData
} from "../../utils/Validation"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { changePassword } from "../../redux/features/userSlice"
import { useNavigate } from "react-router-dom"

const ChangePass = () => {

  const dispatch = useAppDispatch()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ChangepassValidation)
  })

  const { error } = useAppSelector(state => state.userData)
  const navigate = useNavigate()

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const dataHandle = async (data: ChangePassData) => {
    try {
      const { currentpassword, newpassword } = data

      const passwords = {
        currentpassword,
        newpassword,
      }

      await dispatch(changePassword(passwords)).unwrap()
      navigate('/auth/login')
    } catch (error) {
      console.log("failed to changepassword", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 sm:p-8">

          {/* Header */}
          <div className="mb-8 text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10V7a4 4 0 018 0v3"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Change Password
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Update your password to keep your account secure.
            </p>

          </div>

          {/* Backend Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(dataHandle)}
            className="space-y-5"
          >

            {/* Current Password */}
            <div>

              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Current Password
              </label>

              <div className="relative">

                <input
                  {...register('currentpassword')}
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  className={`w-full rounded-lg border px-3 py-3 pr-11 text-sm outline-none transition focus:ring-2 ${
                    errors.currentpassword
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showCurrentPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.58 10.58a2 2 0 002.84 2.84"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 5.09A10.76 10.76 0 0112 4.88c5.05 0 8.5 5.12 8.5 5.12a16.4 16.4 0 01-3.12 3.66"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.61 6.61C3.91 8.43 2.5 10 2.5 10s3.45 5.12 8.5 5.12c.92 0 1.78-.14 2.58-.38"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.5 12s3.45-5.12 9.5-5.12S21.5 12 21.5 12 18.05 17.12 12 17.12 2.5 12 2.5 12z"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                      />
                    </svg>
                  )}
                </button>

              </div>

              {errors.currentpassword && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.currentpassword.message}
                </p>
              )}

            </div>

            {/* New Password */}
            <div>

              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                New Password
              </label>

              <div className="relative">

                <input
                  {...register('newpassword')}
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className={`w-full rounded-lg border px-3 py-3 pr-11 text-sm outline-none transition focus:ring-2 ${
                    errors.newpassword
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(!showNewPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.58 10.58a2 2 0 002.84 2.84"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 5.09A10.76 10.76 0 0112 4.88c5.05 0 8.5 5.12 8.5 5.12a16.4 16.4 0 01-3.12 3.66"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.61 6.61C3.91 8.43 2.5 10 2.5 10s3.45 5.12 8.5 5.12c.92 0 1.78-.14 2.58-.38"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.5 12s3.45-5.12 9.5-5.12S21.5 12 21.5 12 18.05 17.12 12 17.12 2.5 12 2.5 12z"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                      />
                    </svg>
                  )}
                </button>

              </div>

              {errors.newpassword && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.newpassword.message}
                </p>
              )}

            </div>

            {/* Confirm Password */}
            <div>

              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  {...register('confirmpassword')}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className={`w-full rounded-lg border px-3 py-3 pr-11 text-sm outline-none transition focus:ring-2 ${
                    errors.confirmpassword
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.58 10.58a2 2 0 002.84 2.84"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 5.09A10.76 10.76 0 0112 4.88c5.05 0 8.5 5.12 8.5 5.12a16.4 16.4 0 01-3.12 3.66"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.61 6.61C3.91 8.43 2.5 10 2.5 10s3.45 5.12 8.5 5.12c.92 0 1.78-.14 2.58-.38"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.5 12s3.45-5.12 9.5-5.12S21.5 12 21.5 12 18.05 17.12 12 17.12 2.5 12 2.5 12z"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                      />
                    </svg>
                  )}
                </button>

              </div>

              {errors.confirmpassword && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.confirmpassword.message}
                </p>
              )}

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Change Password
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default ChangePass
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
import Navbar from "../../components/Navbar"

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
    <div className="min-h-screen bg-white">
      <Navbar></Navbar>

      <div className="grid min-h-[calc(100vh-72px)] grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">

        {/* LEFT — brand panel */}
        <div className="relative hidden overflow-hidden bg-[#111111] px-12 py-16 lg:flex lg:flex-col lg:justify-between">

          <div
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #ff5a1f 0%, transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #ff5a1f 0%, transparent 70%)" }}
          />

          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff5a1f]">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10V7a4 4 0 018 0v3" />
              </svg>
            </div>

            <h1 className="mt-10 max-w-sm text-[2.5rem] font-semibold leading-[1.1] tracking-tight text-white">
              A strong password is your first line of defense.
            </h1>

            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/50">
              You're updating the password for your account. Once saved, you'll
              need to sign back in everywhere you're logged in.
            </p>
          </div>

          <div className="relative space-y-5 border-t border-white/10 pt-8">
            {[
              "Use at least 8 characters, mixing letters and numbers",
              "Avoid reusing passwords from other sites",
              "Never share your password, even with support",
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5a1f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm leading-relaxed text-white/60">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="flex items-center justify-center px-6 py-14 sm:px-10">
          <div className="w-full max-w-[420px]">

            <div className="mb-9 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1eb] text-[#ff5a1f]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <rect x="5" y="10" width="14" height="10" rx="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10V7a4 4 0 018 0v3" />
                </svg>
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5a1f]">
              Security
            </p>
            <h2 className="mt-2 text-[1.75rem] font-bold tracking-tight text-gray-900">
              Change your password
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter your current password, then choose a new one.
            </p>

            {error && (
              <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit(dataHandle)}
              className="mt-8 space-y-5"
            >

              {/* Current Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Current password
                </label>

                <div className="relative">
                  <input
                    {...register('currentpassword')}
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    className={`w-full rounded-xl border bg-gray-50/60 px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                      errors.currentpassword
                        ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                        : "border-gray-200 focus:border-[#ff5a1f] focus:ring-[#fff1eb]"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                  >
                    {showCurrentPassword ? (
                      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58a2 2 0 002.84 2.84" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 5.09A10.76 10.76 0 0112 4.88c5.05 0 8.5 5.12 8.5 5.12a16.4 16.4 0 01-3.12 3.66" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.61 6.61C3.91 8.43 2.5 10 2.5 10s3.45 5.12 8.5 5.12c.92 0 1.78-.14 2.58-.38" />
                      </svg>
                    ) : (
                      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.45-5.12 9.5-5.12S21.5 12 21.5 12 18.05 17.12 12 17.12 2.5 12 2.5 12z" />
                        <circle cx="12" cy="12" r="2.5" />
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
                  New password
                </label>

                <div className="relative">
                  <input
                    {...register('newpassword')}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className={`w-full rounded-xl border bg-gray-50/60 px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                      errors.newpassword
                        ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                        : "border-gray-200 focus:border-[#ff5a1f] focus:ring-[#fff1eb]"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58a2 2 0 002.84 2.84" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 5.09A10.76 10.76 0 0112 4.88c5.05 0 8.5 5.12 8.5 5.12a16.4 16.4 0 01-3.12 3.66" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.61 6.61C3.91 8.43 2.5 10 2.5 10s3.45 5.12 8.5 5.12c.92 0 1.78-.14 2.58-.38" />
                      </svg>
                    ) : (
                      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.45-5.12 9.5-5.12S21.5 12 21.5 12 18.05 17.12 12 17.12 2.5 12 2.5 12z" />
                        <circle cx="12" cy="12" r="2.5" />
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
                  Confirm new password
                </label>

                <div className="relative">
                  <input
                    {...register('confirmpassword')}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className={`w-full rounded-xl border bg-gray-50/60 px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                      errors.confirmpassword
                        ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                        : "border-gray-200 focus:border-[#ff5a1f] focus:ring-[#fff1eb]"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58a2 2 0 002.84 2.84" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 5.09A10.76 10.76 0 0112 4.88c5.05 0 8.5 5.12 8.5 5.12a16.4 16.4 0 01-3.12 3.66" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.61 6.61C3.91 8.43 2.5 10 2.5 10s3.45 5.12 8.5 5.12c.92 0 1.78-.14 2.58-.38" />
                      </svg>
                    ) : (
                      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.45-5.12 9.5-5.12S21.5 12 21.5 12 18.05 17.12 12 17.12 2.5 12 2.5 12z" />
                        <circle cx="12" cy="12" r="2.5" />
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
                className="mt-2 w-full rounded-xl bg-[#ff5a1f] py-3.5 text-sm font-semibold text-white shadow-sm shadow-[#ff5a1f]/20 transition hover:bg-[#e64f19]"
              >
                Change password
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePass
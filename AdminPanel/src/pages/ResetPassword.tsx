import { useState } from "react"
import { useForm } from "react-hook-form"
import { passwordSchema, type passwordData } from "../utils/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { useNavigate, useSearchParams } from "react-router-dom"
import { resetPass } from "../redux/features/adminSlice"


const ResetPassword = () => {

    const [eye,setEye] = useState(false)

    const {register,handleSubmit ,formState:{errors}} = useForm({
        resolver:zodResolver(passwordSchema)
    })

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const {error} = useAppSelector(state=>state.AdminData)
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const dataHandle = async (data:passwordData) =>{
        try{
            const {confirmpassword,password} = data
            const adminData = {
                token,password
            }

            await dispatch(resetPass(adminData)).unwrap()
            navigate('/')
        }catch(error){
            console.log("password reset failed",error )
        }


    }
  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* Security Bar */}
      <div className="flex h-8 shrink-0 items-center justify-center bg-black">
        <p className="text-[11px] font-medium tracking-[0.15em] text-white">
          NEXORO ADMIN PORTAL &nbsp;|&nbsp; SECURE STORE MANAGEMENT &nbsp;|&nbsp; AUTHORIZED ACCESS ONLY
        </p>
      </div>

      {/* Header */}
      <div className="flex h-16 shrink-0 items-center border-b border-gray-100 px-10">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Nexoro
          <span className="ml-2 align-middle text-[11px] font-medium text-gray-400">
            ADMIN
          </span>
        </h1>
      </div>

      {/* Body: split screen */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel — brand / security context */}
        <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-[#0c0f14] px-16 py-16 lg:flex">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full opacity-20 blur-3xl"
            style={{ background: "#ff634d" }}
          />

          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#ff634d]/15">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#ff634d]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 10V7a4 4 0 10-8 0v3m-2 0h12v10H6V10z"
                />
              </svg>
            </div>

            <h2 className="mt-10 max-w-sm text-3xl font-bold leading-tight text-white">
              Choose a new password for your admin account
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Use a password you haven't used before. Once it's changed,
              you'll be signed out of all other active sessions.
            </p>
          </div>

          <div className="relative space-y-4 border-t border-white/10 pt-8">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff634d]" />
              <p className="text-xs leading-5 text-gray-400">
                This reset link is single-use and will expire once you set a
                new password.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff634d]" />
              <p className="text-xs leading-5 text-gray-400">
                Didn't request this? Contact your store's security lead
                immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel — form */}
        <div className="flex flex-1 items-center justify-center overflow-y-auto bg-[#fafafa] px-6 py-12 lg:px-20">
          <div className="w-full max-w-[400px]">
            {/* Mobile-only icon (hidden on lg where left panel shows it) */}
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-[#ff634d]/10 lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#ff634d]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 10V7a4 4 0 10-8 0v3m-2 0h12v10H6V10z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Reset password
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Enter and confirm a new password for your admin account.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit(dataHandle)} className="mt-8">
              {/* New password */}
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-semibold text-gray-700"
              >
                New password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 10V7a4 4 0 10-8 0v3m-2 0h12v10H6V10z"
                    />
                  </svg>
                </span>

                <input
                  {...register("password")}
                  id="password"
                  type={eye ? "text" : "password"}
                  placeholder="Enter new password"
                  className={`h-11 w-full rounded-md border ${
                    errors.password ? "border-red-400" : "border-gray-200"
                  } bg-white pl-10 pr-10 text-sm text-gray-700 outline-none transition-all placeholder:text-gray-300 focus:border-[#ff634d] focus:ring-2 focus:ring-[#ff634d]/15`}
                />

                <button
                  type="button"
                  onClick={() => setEye((prev) => !prev)}
                  aria-label={eye ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 transition-colors hover:text-gray-500"
                >
                  {eye ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}

              {/* Confirm password */}
              <label
                htmlFor="confirmpassword"
                className="mb-2 mt-5 block text-xs font-semibold text-gray-700"
              >
                Confirm password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 10V7a4 4 0 10-8 0v3m-2 0h12v10H6V10z"
                    />
                  </svg>
                </span>

                <input
                  {...register("confirmpassword")}
                  id="confirmpassword"
                  type={eye ? "text" : "password"}
                  placeholder="Re-enter new password"
                  className={`h-11 w-full rounded-md border ${
                    errors.confirmpassword
                      ? "border-red-400"
                      : "border-gray-200"
                  } bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition-all placeholder:text-gray-300 focus:border-[#ff634d] focus:ring-2 focus:ring-[#ff634d]/15`}
                />
              </div>
              {errors.confirmpassword && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.confirmpassword.message}
                </p>
              )}

              {error && (
                <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-500">
                  {error}
                </p>
              )}

              <input
                type="submit"
                value="Reset password"
                className="mt-6 h-11 w-full cursor-pointer rounded-md bg-[#ff634d] text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e84d38] hover:shadow-lg hover:shadow-[#ff634d]/20 active:translate-y-0"
              />
            </form>

            <p className="mt-10 text-center text-[11px] text-gray-400">
              Authorized administrators only &nbsp;•&nbsp; Secure connection
              &nbsp;•&nbsp; © 2026 Nexoro
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
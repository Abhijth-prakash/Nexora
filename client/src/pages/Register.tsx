
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../utils/Validation'
import type { RegisterData } from '../utils/Validation'
import { registerUser } from '../redux/features/userSlice'
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  })

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { error } = useAppSelector(state => state.userData)

  const [showPassword, setShowPassword] = useState(false)

  const dataHandle = async (data: RegisterData) => {
    try {
      const { confirmpassword, ...registerData } = data
      await dispatch(registerUser(registerData)).unwrap()

      navigate("/auth/verify", {
        state: {
          email: registerData.email,
        },
      })
    } catch (error) {
      console.log("Registration failed", error)
    }
  }

  return (
    <div
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FDFBF8]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >

      {/* ================= LEFT SIDE ================= */}
      <div className="relative hidden lg:flex bg-[#14110F] text-[#F5F2EC] px-12 xl:px-20 py-12 flex-col justify-between overflow-hidden min-h-screen">

        {/* Decorative elements */}
        <div className="absolute top-[8%] -right-28 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-[#C1583C] to-[#7A3323] opacity-90" />

        <div className="absolute top-[8%] -right-28 w-[420px] h-[420px] rounded-full border border-[#F5F2EC]/10 scale-[1.35]" />

        <div className="absolute bottom-[-18%] left-[-12%] w-[320px] h-[320px] rounded-full border border-[#F5F2EC]/[0.08]" />

        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <h1
            className="text-2xl tracking-[0.28em] font-medium"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            NEXORA
          </h1>

          <p className="mt-2 text-[10px] tracking-[0.35em] text-[#BDB5A8]">
            MODERN STYLE, EVERYDAY LUXURY
          </p>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-lg my-14">
          <p
            className="text-sm text-[#E8785A] mb-5 italic"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Welcome to Nexora
          </p>

          <h2
            className="text-5xl xl:text-7xl font-light leading-[0.95] tracking-tight"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Create your
            <br />
            <span className="italic font-normal">
              own style
            </span>
          </h2>

          <p className="mt-8 text-[15px] leading-7 text-[#BDB5A8] max-w-sm">
            Join thousands of shoppers discovering premium products made
            for modern living.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex items-center gap-8 border-t border-[#F5F2EC]/[0.08] pt-7">

          <div>
            <p
              className="text-2xl font-light"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              50K+
            </p>

            <p className="mt-1.5 text-[10px] tracking-wider text-[#8A8177]">
              Happy customers
            </p>
          </div>

          <div className="h-9 w-px bg-[#F5F2EC]/[0.08]" />

          <div>
            <p
              className="text-2xl font-light"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              4.9/5
            </p>

            <p className="mt-1.5 text-[10px] tracking-wider text-[#8A8177]">
              Customer rating
            </p>
          </div>

          <div className="h-9 w-px bg-[#F5F2EC]/[0.08]" />

          <div>
            <p
              className="text-2xl font-light"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              24/7
            </p>

            <p className="mt-1.5 text-[10px] tracking-wider text-[#8A8177]">
              Support
            </p>
          </div>

        </div>
      </div>


      {/* ================= RIGHT SIDE ================= */}
      <div className="min-h-screen flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16 xl:px-24 bg-[#FDFBF8]">

        <div className="w-full max-w-[460px]">

          {/* Login link */}
          <div className="flex justify-end mb-10">
            <p className="text-[13px] text-[#8B8377]">
              Already have an account?{" "}

              <Link
                to="/auth/login"
                className="text-[#C1583C] font-semibold hover:text-[#8B3E2A] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>


          {/* Heading */}
          <div className="mb-10">

            <p
              className="text-sm italic text-[#C1583C] mb-2"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Nexora
            </p>

            <h2
              className="text-4xl sm:text-5xl font-light text-[#14110F] leading-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Create your account
            </h2>

            <p className="mt-3 text-sm text-[#8B8377]">
              Start your Nexora journey today
            </p>

          </div>


          {/* Form */}
          <form
            onSubmit={handleSubmit(dataHandle)}
            className="space-y-7"
          >

            {/* ================= NAME ================= */}
            <div>
              <label className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-[#4D4943] mb-2.5">
                Full Name
              </label>

              <input
                type="text"
                {...register('name')}
                placeholder="Enter your full name"
                className="
                  w-full h-12
                  px-0
                  bg-transparent
                  border-0
                  border-b
                  border-[#D8D0C3]
                  text-[15px]
                  text-[#14110F]
                  placeholder:text-[#B5AD9F]
                  outline-none
                  transition-all duration-300
                  focus:border-[#C1583C]
                  focus:placeholder:text-transparent
                "
              />

              {errors.name && (
                <p className="mt-2 text-xs text-[#B3453A]">
                  {errors.name.message}
                </p>
              )}
            </div>


            {/* ================= EMAIL ================= */}
            <div>
              <label className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-[#4D4943] mb-2.5">
                Email Address
              </label>

              <input
                type="email"
                {...register('email')}
                placeholder="Enter your email address"
                className="
                  w-full h-12
                  px-0
                  bg-transparent
                  border-0
                  border-b
                  border-[#D8D0C3]
                  text-[15px]
                  text-[#14110F]
                  placeholder:text-[#B5AD9F]
                  outline-none
                  transition-all duration-300
                  focus:border-[#C1583C]
                  focus:placeholder:text-transparent
                "
              />

              {errors.email && (
                <p className="mt-2 text-xs text-[#B3453A]">
                  {errors.email.message}
                </p>
              )}
            </div>


            {/* ================= PASSWORD ================= */}
            <div>
              <label className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-[#4D4943] mb-2.5">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  placeholder="Create a password"
                  className="
                    w-full h-12
                    px-0 pr-14
                    bg-transparent
                    border-0
                    border-b
                    border-[#D8D0C3]
                    text-[15px]
                    text-[#14110F]
                    placeholder:text-[#B5AD9F]
                    outline-none
                    transition-all duration-300
                    focus:border-[#C1583C]
                    focus:placeholder:text-transparent
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="
                    absolute right-0 top-1/2 -translate-y-1/2
                    text-[11px]
                    font-semibold
                    tracking-wide
                    uppercase
                    text-[#8B8377]
                    hover:text-[#C1583C]
                    transition-colors
                  "
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

              {errors.password && (
                <p className="mt-2 text-xs text-[#B3453A]">
                  {errors.password.message}
                </p>
              )}
            </div>


            {/* ================= CONFIRM PASSWORD ================= */}
            <div>
              <label className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-[#4D4943] mb-2.5">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  {...register('confirmpassword')}
                  placeholder="Confirm your password"
                  className="
                    w-full h-12
                    px-0 pr-14
                    bg-transparent
                    border-0
                    border-b
                    border-[#D8D0C3]
                    text-[15px]
                    text-[#14110F]
                    placeholder:text-[#B5AD9F]
                    outline-none
                    transition-all duration-300
                    focus:border-[#C1583C]
                    focus:placeholder:text-transparent
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="
                    absolute right-0 top-1/2 -translate-y-1/2
                    text-[11px]
                    font-semibold
                    tracking-wide
                    uppercase
                    text-[#8B8377]
                    hover:text-[#C1583C]
                    transition-colors
                  "
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

              {errors.confirmpassword && (
                <p className="mt-2 text-xs text-[#B3453A]">
                  {errors.confirmpassword.message}
                </p>
              )}
            </div>


            {/* ================= TERMS ================= */}
            <div className="flex items-start gap-3 pt-1">

              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 rounded border-[#D8D0C3] accent-[#C1583C] cursor-pointer"
              />

              <label
                htmlFor="terms"
                className="text-[13px] leading-5 text-[#8B8377]"
              >
                I agree to the{" "}

                <span className="text-[#C1583C] font-medium cursor-pointer hover:text-[#8B3E2A]">
                  Terms & Conditions
                </span>

                {" "}and{" "}

                <span className="text-[#C1583C] font-medium cursor-pointer hover:text-[#8B3E2A]">
                  Privacy Policy
                </span>
              </label>

            </div>


            {/* ================= SUBMIT ================= */}
            <input
              type="submit"
              value="Create Account"
              className="
                w-full
                h-13
                mt-3
                bg-[#14110F]
                text-[#FAF9F6]
                text-[13px]
                tracking-[0.12em]
                uppercase
                font-semibold
                cursor-pointer
                transition-all duration-300
                hover:bg-[#C1583C]
                hover:shadow-lg
                active:scale-[0.99]
              "
            />

          </form>


          {/* ================= ERROR ================= */}
          {error && (
            <div className="mt-5 px-4 py-3 rounded-sm bg-[#B3453A]/5 border border-[#B3453A]/20">
              <p className="text-center text-sm text-[#B3453A]">
                {error}
              </p>
            </div>
          )}


          {/* ================= DIVIDER ================= */}
          <div className="flex items-center gap-4 mt-9">

            <div className="flex-1 h-px bg-[#E0D9CE]" />

            <p className="text-[10px] font-medium tracking-[0.14em] text-[#8B8377] whitespace-nowrap">
              OR SIGN UP WITH
            </p>

            <div className="flex-1 h-px bg-[#E0D9CE]" />

          </div>


          {/* ================= GOOGLE ================= */}
          <div className="mt-5">

            <a
              href="http://localhost:8888/api/auth/google"
              className="
                w-full
                h-12
                flex
                items-center
                justify-center
                gap-3
                border
                border-[#D8D0C3]
                bg-white/40
                text-[13px]
                font-semibold
                text-[#4D4943]
                transition-all duration-300
                hover:border-[#14110F]
                hover:bg-white
                hover:shadow-sm
              "
            >
              <span className="text-base font-bold">G</span>
              Continue with Google
            </a>

          </div>


          {/* ================= SECURITY ================= */}
          <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-[#E0D9CE]">

            <span className="text-xs">
              🔒
            </span>

            <p className="text-[10px] font-medium tracking-[0.12em] text-[#8B8377]">
              YOUR INFORMATION IS SECURE AND ENCRYPTED
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Register

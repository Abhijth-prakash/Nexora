import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../utils/Validation'
import type { RegisterData } from '../utils/Validation'
import { registerUser } from '../redux/features/userSlice'
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
  const {register,handleSubmit,formState:{errors}} = useForm<RegisterData>({
    resolver:zodResolver(registerSchema)
  })

  const dispatch = useAppDispatch()
  const navigate =useNavigate()
  const {error} = useAppSelector(state=> state.userData)

  // UI-only state for the password visibility toggle — does not touch form logic
  const [showPassword, setShowPassword] = useState(false)

  const dataHandle = async (data: RegisterData) => {
    try {
      const { confirmpassword, ...registerData } = data;
      await dispatch(registerUser(registerData)).unwrap();
      navigate("/auth/verify", {
        state: {
          email: registerData.email,
        },
      })
    } catch (error) {
      console.log("Registration failed", error);
    }
  };

  return (
    <div
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >

      {/*
        Fonts: Fraunces (serif, display moments) + Inter (sans, UI/body).
        Add this to your index.html <head> so it isn't re-fetched on every render:
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;1,9..144,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      */}
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;1,9..144,400&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

        {/* LEFT SIDE — full height, full bleed, no card wrapper */}
        <div className="relative bg-[#14110F] text-[#F5F2EC] px-8 py-12 md:px-14 lg:px-20 flex flex-col justify-between overflow-hidden min-h-[320px] lg:min-h-screen">

          {/* Layered decorative circles */}
          <div className="absolute top-[8%] -right-24 w-[380px] h-[380px] rounded-full bg-gradient-to-br from-[#C1583C] to-[#7A3323] opacity-90" />
          <div className="absolute top-[8%] -right-24 w-[380px] h-[380px] rounded-full border border-[#F5F2EC]/10 scale-[1.35]" />
          <div className="absolute bottom-[-18%] left-[-12%] w-[280px] h-[280px] rounded-full border border-[#F5F2EC]/[0.08]" />

          {/* Subtle grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

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

          <div className="relative z-10 max-w-md my-14">
            <p className="text-[13px] text-[#E8785A] mb-4 italic" style={{ fontFamily: "'Fraunces', serif" }}>
              Welcome to Nexora
            </p>

            <h2
              className="text-[2.75rem] md:text-6xl lg:text-[4.5rem] font-light leading-[0.98] tracking-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Create your
              <br />
              <span className="italic font-normal">own style</span>
            </h2>

            <p className="mt-8 text-[15px] leading-7 text-[#BDB5A8] max-w-sm">
              Join thousands of shoppers discovering premium products made
              for modern living.
            </p>
          </div>

          <div className="relative z-10 flex gap-8 border-t border-[#F5F2EC]/[0.08] pt-7">

            <div>
              <p className="text-2xl font-light" style={{ fontFamily: "'Fraunces', serif" }}>50K+</p>
              <p className="mt-1.5 text-[10px] tracking-wider text-[#8A8177]">
                Happy customers
              </p>
            </div>

            <div className="w-px bg-[#F5F2EC]/[0.08]" />

            <div>
              <p className="text-2xl font-light" style={{ fontFamily: "'Fraunces', serif" }}>4.9/5</p>
              <p className="mt-1.5 text-[10px] tracking-wider text-[#8A8177]">
                Customer rating
              </p>
            </div>

            <div className="w-px bg-[#F5F2EC]/[0.08]" />

            <div>
              <p className="text-2xl font-light" style={{ fontFamily: "'Fraunces', serif" }}>24/7</p>
              <p className="mt-1.5 text-[10px] tracking-wider text-[#8A8177]">
                Support
              </p>
            </div>

          </div>
        </div>


        {/* RIGHT SIDE — full height, full bleed */}
        <div className="bg-[#FDFBF8] px-8 py-10 md:px-14 lg:px-20 flex items-center min-h-screen">

          <div className="w-full max-w-md mx-auto">

            {/* Top link */}
            <div className="flex justify-end mb-6">
              <p className="text-[13px] text-[#8B8377]">
                Already have an account?{" "}
                <Link to="/auth/login" className="text-[#C1583C] font-medium hover:text-[#8B3E2A] transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Heading */}
            <div className="mb-9">
              <p className="text-[13px] italic text-[#C1583C] mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
                Nexora
              </p>

              <h2
                className="text-4xl md:text-[2.75rem] font-light text-[#14110F] leading-tight"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Create your account
              </h2>

              <p className="mt-3 text-sm text-[#8B8377]">
                Start your Nexora journey today
              </p>
            </div>


            <form
              onSubmit={handleSubmit(dataHandle)}
              className="space-y-6"
            >

              {/* Name */}
              <div className="group">
                <label className="block text-[11px] tracking-[0.15em] uppercase text-[#4D4943] mb-2.5">
                  Full Name
                </label>

                <input
                  type="text"
                  {...register('name')}
                  placeholder="Enter your full name"
                  className="w-full h-11 px-0.5 bg-transparent border-0 border-b border-[#D8D0C3] text-[15px] text-[#14110F] placeholder:text-[#B5AD9F] outline-none transition-colors duration-300 focus:border-[#C1583C]"
                />

                {errors.name && (
                  <p className="mt-1.5 text-xs text-[#B3453A]">
                    {errors.name.message}
                  </p>
                )}
              </div>


              {/* Email */}
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase text-[#4D4943] mb-2.5">
                  Email Address
                </label>

                <input
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email address"
                  className="w-full h-11 px-0.5 bg-transparent border-0 border-b border-[#D8D0C3] text-[15px] text-[#14110F] placeholder:text-[#B5AD9F] outline-none transition-colors duration-300 focus:border-[#C1583C]"
                />

                {errors.email && (
                  <p className="mt-1.5 text-xs text-[#B3453A]">
                    {errors.email.message}
                  </p>
                )}
              </div>


              {/* Password */}
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase text-[#4D4943] mb-2.5">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    placeholder="Create a password"
                    className="w-full h-11 px-0.5 pr-12 bg-transparent border-0 border-b border-[#D8D0C3] text-[15px] text-[#14110F] placeholder:text-[#B5AD9F] outline-none transition-colors duration-300 focus:border-[#C1583C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 text-[11px] tracking-wide text-[#8B8377] hover:text-[#14110F] transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs text-[#B3453A]">
                    {errors.password.message}
                  </p>
                )}
              </div>


              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase text-[#4D4943] mb-2.5">
                  Confirm Password
                </label>

                <input
                  type="password"
                  {...register('confirmpassword')}
                  placeholder="Confirm your password"
                  className="w-full h-11 px-0.5 bg-transparent border-0 border-b border-[#D8D0C3] text-[15px] text-[#14110F] placeholder:text-[#B5AD9F] outline-none transition-colors duration-300 focus:border-[#C1583C]"
                />

                {errors.confirmpassword && (
                  <p className="mt-1.5 text-xs text-[#B3453A]">
                    {errors.confirmpassword.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-0.5 h-3.5 w-3.5 accent-[#C1583C]"
                />
                <label htmlFor="terms" className="text-[13px] leading-5 text-[#8B8377]">
                  I agree to the{" "}
                  <span className="text-[#C1583C] font-medium cursor-pointer hover:text-[#8B3E2A]">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-[#C1583C] font-medium cursor-pointer hover:text-[#8B3E2A]">
                    Privacy Policy
                  </span>
                </label>
              </div>


              {/* Submit */}
              <input
                type="submit"
                value="Create Account"
                className="w-full h-12 mt-2 bg-[#14110F] text-[#FAF9F6] text-[13px] tracking-[0.1em] font-medium cursor-pointer transition-all duration-300 hover:bg-[#C1583C]"
              />

            </form>


            {/* Error */}
            {error && (
              <p className="mt-4 text-center text-sm text-[#B3453A]">
                {error}
              </p>
            )}



            {/* Divider */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex-1 h-px bg-[#E0D9CE]" />
              <p className="text-[10px] tracking-wider text-[#8B8377]">OR SIGN UP WITH</p>
              <div className="flex-1 h-px bg-[#E0D9CE]" />
            </div>

            {/* Social button */}
            <div className="mt-4">
              <a
                href="http://localhost:8888/api/auth/google"
                className="w-full h-11 flex items-center justify-center border border-[#D8D0C3] text-[13px] font-medium text-[#4D4943] hover:border-[#14110F] transition-colors duration-300"
              >
                Google
              </a>
            </div>

            {/* Secure message */}
            <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-[#E0D9CE]">
              <span className="text-xs">🔒</span>

              <p className="text-[10px] tracking-wider text-[#8B8377]">
                YOUR INFORMATION IS SECURE AND ENCRYPTED
              </p>
            </div>

          </div>
        </div>

    </div>
  )
}

export default Register
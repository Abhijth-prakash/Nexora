import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { LoginSchema } from "../utils/Validation"
import type { LoginData } from "../utils/Validation"
import { useNavigate, Link } from "react-router-dom"
import { useAppDispatch } from "../redux/hooks"
import { Loginuser } from "../redux/features/userSlice"



const Login = () => {
  const {register,handleSubmit,formState: { errors }} = useForm<LoginData>({
    resolver:zodResolver(LoginSchema)
  })
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [showPassword, setShowPassword] = useState(false)

  const datahandle = async(data:LoginData)=>{
    try{

      await dispatch(Loginuser(data))
      navigate('/')

    }catch(error){
      console.log(error)
    }

  }

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

      {/* LEFT SIDE — full height, full bleed, photo + decorative blob */}
      <div className="relative bg-[#14110F] text-[#F5F2EC] px-8 py-12 md:px-14 lg:px-20 flex flex-col justify-between overflow-hidden min-h-[420px] lg:min-h-screen">

        {/* Decorative terracotta blob behind the photo */}
        <div className="absolute bottom-[-10%] right-[6%] w-[420px] h-[420px] rounded-full bg-gradient-to-br from-[#C1583C] to-[#7A3323] opacity-90" />

        {/* Photo — replace the src with your own model/lifestyle image */}
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80"
          alt="Nexora model"
          className="absolute bottom-0 right-[2%] h-[92%] w-auto object-contain object-bottom z-10 select-none pointer-events-none"
        />

        <div className="relative z-20">
          <h1
            className="text-2xl tracking-[0.28em] font-medium"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            NEXORA
          </h1>
        </div>

        <div className="relative z-20 max-w-md mb-4">
          <p
            className="text-[13px] text-[#E8785A] mb-4 tracking-[0.15em] uppercase font-medium"
          >
            Welcome back
          </p>

          <h2
            className="text-4xl md:text-5xl lg:text-[3.25rem] font-light leading-[1.05] tracking-tight"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Your style.
            <br />
            Your world.
          </h2>

          <p className="mt-6 text-[15px] leading-7 text-[#BDB5A8] max-w-xs">
            Sign in to discover your latest favorite orders and personalized
            recommendations.
          </p>
        </div>
      </div>


      {/* RIGHT SIDE — full height, full bleed */}
      <div className="bg-[#FDFBF8] px-8 py-10 md:px-14 lg:px-20 flex items-center min-h-screen">

        <div className="w-full max-w-md mx-auto">

          {/* Heading */}
          <div className="mb-8 text-center">
            <h2
              className="text-3xl md:text-4xl font-light text-[#14110F] leading-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Welcome back
            </h2>

            <p className="mt-3 text-sm text-[#8B8377]">
              Sign in to your Nexora account
            </p>
          </div>

          {/* Google sign-in */}
          <a
            href="http://localhost:8888/api/auth/google"
            className="w-full h-11 flex items-center justify-center gap-2 border border-[#D8D0C3] text-[13px] font-medium text-[#4D4943] hover:border-[#14110F] transition-colors duration-300"
          >
            Continue with Google
          </a>

          {/* Divider */}
          <div className="flex items-center gap-4 mt-7 mb-7">
            <div className="flex-1 h-px bg-[#E0D9CE]" />
            <p className="text-[10px] tracking-wider text-[#8B8377]">OR</p>
            <div className="flex-1 h-px bg-[#E0D9CE]" />
          </div>

          <form onSubmit={handleSubmit(datahandle)} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-[11px] tracking-[0.15em] uppercase text-[#4D4943] mb-2.5">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email address"
                {...register('email')}
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
                  placeholder="Enter your password"
                  {...register('password')}
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

            {/* Remember me / Forgot password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-[13px] text-[#8B8377]">
                <input type="checkbox" className="h-3.5 w-3.5 accent-[#C1583C]" />
                Remember me
              </label>

              <Link
                to="/auth/forgot-password"
                className="text-[13px] text-[#C1583C] font-medium hover:text-[#8B3E2A] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <input
              type="submit"
              value="Sign In"
              className="w-full h-12 mt-1 bg-[#C1583C] text-[#FAF9F6] text-[13px] tracking-[0.1em] font-medium cursor-pointer transition-all duration-300 hover:bg-[#14110F]"
            />

          </form>

          {/* Create account link */}
          <p className="mt-6 text-center text-sm text-[#8B8377]">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="text-[#C1583C] font-medium hover:text-[#8B3E2A] transition-colors"
            >
              Create an account →
            </Link>
          </p>

          {/* Secure message */}
          <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-[#E0D9CE]">
            <span className="text-xs">🔒</span>
            <p className="text-[10px] tracking-wider text-[#8B8377]">
              SECURE &amp; ENCRYPTED CHECKOUT
            </p>
          </div>

          <p className="mt-3 text-center text-[10px] text-[#B5AD9F]">
            By signing in, you agree to Nexora's{" "}
            <span className="text-[#8B8377] underline cursor-pointer">Terms</span>{" "}
            and{" "}
            <span className="text-[#8B8377] underline cursor-pointer">Privacy Policy</span>.
          </p>

          <p className="mt-4 text-center text-[10px] text-[#B5AD9F]">
            © 2026 Nexora
          </p>

        </div>
      </div>

    </div>
  )
}

export default Login
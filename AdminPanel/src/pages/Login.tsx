import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginSchema, type LoginData } from "../utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { login } from "../redux/features/adminSlice";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { error } = useAppSelector((state) => state.AdminData);

  const [showPassword, setShowPassword] = useState(false);

  const dataHandle = async (data: LoginData) => {
    try {
      await dispatch(login(data)).unwrap();

      navigate("/dashboard");
    } catch (error) {
      console.log("login failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] flex flex-col">
      {/* Top Security Bar */}
      <div className="w-full bg-black text-white text-[9px] tracking-[0.15em] text-center py-2">
        NEXORO ADMIN PORTAL&nbsp; | &nbsp;SECURE STORE MANAGEMENT&nbsp; | &nbsp;
        AUTHORIZED ACCESS ONLY
      </div>

      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center px-8 lg:px-16">
        <div className="text-xl font-bold tracking-tight text-gray-900">
          Nexoro
          <span className="text-[9px] font-normal text-gray-400 ml-1">
            ADMIN
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex">
        {/* LEFT SIDE */}
        <section className="hidden lg:flex w-1/2 bg-[#f7f7f6] px-16 xl:px-24 py-16 flex-col justify-center">
          <div className="max-w-xl">

            {/* Label */}
            <p className="text-[#ff634d] text-xs font-semibold tracking-wide mb-3">
              NEXORO ADMIN
            </p>

            {/* Heading */}
            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.05] text-gray-950">
              Manage Your Store
              <br />
              With Confidence
            </h1>

            <p className="mt-5 text-sm leading-6 text-gray-500 max-w-md">
              Access your dashboard to manage products, orders, customers and
              everything in between.
            </p>

            {/* Dashboard Preview */}
            <div className="mt-10 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full max-w-[520px]">

              <div className="h-10 bg-black flex items-center px-4 justify-between">
                <span className="text-[9px] text-white font-medium">
                  Nexoro Admin Dashboard
                </span>

                <span className="w-2 h-2 bg-[#ff634d] rounded-full" />
              </div>

              <div className="flex min-h-[170px]">

                {/* Sidebar */}
                <div className="w-24 border-r border-gray-100 p-3">
                  <p className="text-[7px] font-bold mb-3">
                    Dashboard
                  </p>

                  <div className="bg-[#ff634d] text-white rounded px-2 py-1 text-[7px] mb-2">
                    Overview
                  </div>

                  {["Products", "Orders", "Customers", "Coupons"].map(
                    (item) => (
                      <div
                        key={item}
                        className="text-[7px] text-gray-400 px-2 py-1.5"
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>

                {/* Dashboard Content */}
                <div className="flex-1 p-4">

                  <p className="text-[8px] font-bold text-gray-800">
                    Overview
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-3">

                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-[6px] text-gray-400">
                        Revenue
                      </p>

                      <p className="text-[10px] font-bold">
                        $24,890
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-[6px] text-gray-400">
                        Orders
                      </p>

                      <p className="text-[10px] font-bold">
                        1,284
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-[6px] text-gray-400">
                        Customers
                      </p>

                      <p className="text-[10px] font-bold">
                        8,492
                      </p>
                    </div>

                  </div>

                  {/* Chart */}
                  <div className="mt-5">

                    <p className="text-[7px] font-semibold">
                      Sales Performance
                    </p>

                    <div className="relative h-14 mt-2 border-b border-gray-100">

                      <svg
                        viewBox="0 0 400 70"
                        className="absolute inset-0 w-full h-full"
                        fill="none"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 55 C30 45 40 50 65 42 S100 35 120 43 S160 55 180 38 S220 20 245 32 S280 50 305 25 S350 45 375 18 S395 15 400 10"
                          stroke="#ff634d"
                          strokeWidth="2"
                        />
                      </svg>

                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Features */}
            <div className="flex gap-10 mt-8">

              <div className="flex items-center gap-3">

                <div className="w-7 h-7 rounded-full bg-[#ffded8] flex items-center justify-center">
                  <span className="text-[#ff634d] text-xs">
                    ✓
                  </span>
                </div>

                <div>
                  <p className="text-[9px] font-bold text-gray-800">
                    Secure Access
                  </p>

                  <p className="text-[8px] text-gray-400">
                    Protected admin authentication
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-7 h-7 rounded-full bg-[#ffded8] flex items-center justify-center">
                  <span className="text-[#ff634d] text-xs">
                    ✓
                  </span>
                </div>

                <div>
                  <p className="text-[9px] font-bold text-gray-800">
                    Full Control
                  </p>

                  <p className="text-[8px] text-gray-400">
                    Manage your store from one place
                  </p>
                </div>

              </div>

            </div>

            <p className="mt-12 text-[8px] text-gray-400">
              © 2026 Nexoro. All rights reserved.
            </p>

          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            {/* Login Card */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">

              {/* Orange Top Border */}
              <div className="h-1 bg-[#ff634d]" />

              <div className="px-8 sm:px-12 py-10">

                {/* Lock Icon */}
                <div className="flex justify-center">

                  <div className="w-12 h-12 rounded-full bg-[#ffebe7] flex items-center justify-center">

                    <svg
                      className="w-6 h-6 text-[#ff634d]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      viewBox="0 0 24 24"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="11"
                        rx="2"
                      />

                      <path d="M8 10V7a4 4 0 018 0v3" />
                    </svg>

                  </div>
                </div>

                {/* Heading */}
                <div className="text-center mt-3">

                  <h2 className="text-2xl font-bold text-gray-900">
                    Admin Login
                  </h2>

                  <p className="text-xs text-gray-400 mt-1">
                    Sign in to access your Nexoro dashboard
                  </p>

                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit(dataHandle)}
                  className="mt-8 space-y-5"
                >

                  {/* Email */}
                  <div>

                    <label className="block text-[10px] font-semibold text-gray-800 mb-2">
                      Email Address
                    </label>

                    <div className="relative">

                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="1.7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 6.75A1.75 1.75 0 014.75 5h14.5A1.75 1.75 0 0121 6.75v10.5A1.75 1.75 0 0119.25 19H4.75A1.75 1.75 0 013 17.25V6.75z"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 7l8 6 8-6"
                        />
                      </svg>

                      <input
                        {...register("email")}
                        type="email"
                        placeholder="Enter your email address"
                        className={`w-full h-11 pl-9 pr-3 border rounded-md outline-none text-xs text-gray-700 placeholder:text-gray-300 transition ${
                          errors.email
                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                            : "border-gray-200 focus:border-[#ff634d] focus:ring-2 focus:ring-[#ffebe7]"
                        }`}
                      />

                    </div>

                    {errors.email && (
                      <p className="mt-1.5 text-[10px] text-red-500">
                        {errors.email.message}
                      </p>
                    )}

                  </div>

                  {/* Password */}
                  <div>

                    <label className="block text-[10px] font-semibold text-gray-800 mb-2">
                      Password
                    </label>

                    <div className="relative">

                      {/* Lock Icon */}
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="1.7"
                      >
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="11"
                          rx="2"
                        />

                        <path d="M8 10V7a4 4 0 018 0v3" />
                      </svg>

                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={`w-full h-11 pl-9 pr-10 border rounded-md outline-none text-xs text-gray-700 placeholder:text-gray-300 transition ${
                          errors.password
                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                            : "border-gray-200 focus:border-[#ff634d] focus:ring-2 focus:ring-[#ffebe7]"
                        }`}
                      />

                      {/* Eye Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff634d] hover:scale-110 transition-all duration-200"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          /* Eye Off */
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.98C2.73 10.36 2 12 2 12s3.6 7 10 7c1.61 0 3.05-.38 4.33-.93"
                            />

                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.23 6.23C7.81 5.46 9.67 5 12 5c6.4 0 10 7 10 7s-.73 1.64-1.98 3.02"
                            />

                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 3l18 18"
                            />

                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.88 9.88a3 3 0 104.24 4.24"
                            />
                          </svg>
                        ) : (
                          /* Eye */
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.46 12S5.73 5 12 5s9.54 7 9.54 7S18.27 19 12 19s-9.54-7-9.54-7z"
                            />

                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>

                    </div>

                    {errors.password && (
                      <p className="mt-1.5 text-[10px] text-red-500">
                        {errors.password.message}
                      </p>
                    )}

                  </div>

                  {/* Remember + Forgot */}
                  <div className="flex items-center justify-between">

                    <label className="flex items-center gap-2 text-[9px] text-gray-400">
                      <input
                        type="checkbox"
                        className="accent-[#ff634d]"
                      />
                      Remember me
                    </label>

                    {/* Forgot Password Link */}
                    <Link
                      to="/forgetpassword"
                      className="text-[9px] font-semibold text-[#ff634d] transition-all duration-200 hover:text-[#e84d38] hover:underline hover:underline-offset-4"
                    >
                      Forgot Password?
                    </Link>

                  </div>

                  {/* Redux Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-100 rounded-md px-3 py-2">
                      <p className="text-[10px] text-red-500 text-center">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    className="w-full h-11 bg-[#ff634d] hover:bg-[#e84d38] hover:shadow-lg hover:shadow-[#ff634d]/20 hover:-translate-y-0.5 active:translate-y-0 text-white text-xs font-semibold rounded-md transition-all duration-200"
                  >
                    Sign In →
                  </button>

                </form>

                {/* Bottom */}
                <div className="border-t border-gray-100 mt-7 pt-5 text-center">
                  <p className="text-[8px] text-gray-400">
                    Authorized administrators only&nbsp; • &nbsp;Secure
                    connection
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
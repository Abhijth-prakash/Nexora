import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EmailSchema, type Email } from "../utils/validation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Forgetpass } from "../redux/features/adminSlice";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EmailSchema),
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error } = useAppSelector((state) => state.AdminData);

  const dataHandle = async (data: Email) => {
    try {
      await dispatch(Forgetpass(data)).unwrap();
      navigate("/resetpassword");
    } catch (error) {
      console.log("email failed to send", error);
    }
  };

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
          {/* subtle grid texture */}
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
              Account recovery for store administrators
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Every reset link is single-use and expires after 15 minutes.
              Requests are logged and reviewed as part of Nexoro's access
              controls.
            </p>
          </div>

          <div className="relative space-y-4 border-t border-white/10 pt-8">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff634d]" />
              <p className="text-xs leading-5 text-gray-400">
                Only email addresses tied to an active admin account will
                receive a reset link.
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
              Forgot password?
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Enter your registered admin email address and we&apos;ll send
              you a link to reset your password.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit(dataHandle)} className="mt-8">
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-semibold text-gray-700"
              >
                Email address
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
                      d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>

                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="you@nexoro.com"
                  className={`h-11 w-full rounded-md border ${
                    errors.email ? "border-red-400" : "border-gray-200"
                  } bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition-all placeholder:text-gray-300 focus:border-[#ff634d] focus:ring-2 focus:ring-[#ff634d]/15`}
                />
              </div>

              {errors.email && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}

              {error && (
                <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-500">
                  {error}
                </p>
              )}

              <input
                type="submit"
                value="Send reset link"
                className="mt-6 h-11 w-full cursor-pointer rounded-md bg-[#ff634d] text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e84d38] hover:shadow-lg hover:shadow-[#ff634d]/20 active:translate-y-0"
              />
            </form>

            <div className="mt-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="whitespace-nowrap text-xs text-gray-400">
                Remember your password?
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-4 block w-full text-center text-xs font-semibold text-[#ff634d] transition-colors hover:text-[#e84d38]"
            >
              ← Back to admin login
            </button>

            <p className="mt-10 text-center text-[11px] text-gray-400">
              Authorized administrators only &nbsp;•&nbsp; Secure connection
              &nbsp;•&nbsp; © 2026 Nexoro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
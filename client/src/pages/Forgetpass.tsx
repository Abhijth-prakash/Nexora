import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgetpassSchema } from "../utils/Validation";
import type { forgetpassDAta } from "../utils/Validation";
import { useAppDispatch } from "../redux/hooks";
import { forgetpassword } from "../redux/features/userSlice";
import { useNavigate } from "react-router-dom";

const Forgetpass = () => {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(forgetpassSchema),
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const datahandle = async (data: forgetpassDAta) => {
    try {
      await dispatch(forgetpassword(data));
      navigate("/auth/resetpass");
    } catch (error) {
      console.log("reset email failed to sent", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-100 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        <div className="rounded-2xl bg-white px-6 py-8 sm:px-10 sm:py-9 shadow-sm">

          {/* Header */}
          <div className="flex flex-col items-center text-center">

            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Nexora
            </h1>

            <div className="mt-2 h-0.5 w-8 bg-orange-500 rounded-full" />

            {/* Lock Icon */}
            <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
              <svg
                className="h-6 w-6 text-orange-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="10" width="16" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                <line x1="12" y1="14" x2="12" y2="16" />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-bold text-neutral-900">
              Forgot Password?
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-400">
              No worries. Enter your email and we'll send you
              <br className="hidden sm:block" />
              a link to reset your password.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(datahandle)}
            className="mt-7"
          >

            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold text-neutral-800"
            >
              Email Address
            </label>

            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />

            <input
              type="submit"
              value="Send Reset Link"
              className="mt-5 w-full cursor-pointer rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:bg-orange-700"
            />

          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">

            <p className="text-sm text-neutral-400">
              Remember your password?
            </p>

            <a
              href="/auth/login"
              className="mt-1 inline-block text-sm font-semibold text-orange-500 transition hover:text-orange-600"
            >
              ← Back to Sign In
            </a>

          </div>

          {/* Security Message */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-neutral-400">

            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>

            <span>
              Your account information is secure
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Forgetpass;


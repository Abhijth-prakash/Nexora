import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  passwordSchema,
  type passwordData,
} from "../utils/Validation";
import { useAppDispatch } from "../redux/hooks";
import { resetPass } from "../redux/features/userSlice";
import { useNavigate, useSearchParams } from "react-router-dom";

const Resetpass = () => {
  const dispatch = useAppDispatch();

  const { register, handleSubmit,formState: { errors } } = useForm({
    resolver: zodResolver(passwordSchema),
  });
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  //handle
const handleData = async (data: passwordData) => {
  try {
    const { confirmpassword, password } = data;

    const resetData = {
      token,
      password,
    };

    await dispatch(resetPass(resetData)).unwrap();

    navigate("/auth/login");

  } catch (error) {
    console.log("password dosent reset", error);
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

            <div className="mt-2 h-0.5 w-8 rounded-full bg-orange-500" />

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
              Reset Password
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-400">
              Create a new password for your Nexora account.
              <br className="hidden sm:block" />
              Make sure it's strong and secure.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(handleData)}
            className="mt-7"
          >

            {/* Password */}
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold text-neutral-800"
            >
              New Password
            </label>

            <div className="relative">
              <input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Enter your new password"
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:ring-2 ${
                  errors.password
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-neutral-200 focus:border-orange-400 focus:ring-orange-100"
                }`}
              />
            </div>

            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}

            {/* Confirm Password */}
            <label
              htmlFor="confirmpassword"
              className="mb-1.5 mt-4 block text-sm font-semibold text-neutral-800"
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                {...register("confirmpassword")}
                id="confirmpassword"
                type="password"
                placeholder="Confirm your new password"
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:ring-2 ${
                  errors.confirmpassword
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-neutral-200 focus:border-orange-400 focus:ring-orange-100"
                }`}
              />
            </div>

            {errors.confirmpassword && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.confirmpassword.message}
              </p>
            )}

            {/* Submit */}
            <input
              type="submit"
              value="Reset Password"
              className="mt-6 w-full cursor-pointer rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:bg-orange-700"
            />

          </form>

          {/* Security Message */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-neutral-400">

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
              Your password is securely encrypted
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Resetpass;


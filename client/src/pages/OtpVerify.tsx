import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { OtpValidate } from "../utils/Validation"

import { veirifyingOtp } from "../redux/features/userSlice"
import { useAppDispatch } from "../redux/hooks"
import { useNavigate } from "react-router-dom"

type OtpForm = {
  otp: string
}

const OtpVerify = () => {
  const [otp, setOtp] = useState("")
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpForm>({
    resolver: zodResolver(OtpValidate),
    mode: "onSubmit",
  })

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const digit = value.slice(-1)

    const otpArray = otp.split("")
    otpArray[index] = digit

    const newOtp = otpArray.join("").slice(0, 6)

    setOtp(newOtp)
    setValue("otp", newOtp)

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const otpArray = otp.split("")
        otpArray[index] = ""

        const newOtp = otpArray.join("")

        setOtp(newOtp)
        setValue("otp", newOtp)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const dataHandle = async (data: OtpForm) => {
    try{

    await dispatch(veirifyingOtp(data))
    navigate('/home')

    }catch(error){
      console.log(error,"verification failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">

        <h1 className="text-2xl font-bold text-center text-gray-800">
          Verify OTP
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          Enter the 6-digit OTP sent to your email
        </p>

        <form
          className="mt-8"
          onSubmit={handleSubmit(dataHandle)}
        >
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                maxLength={1}
                inputMode="numeric"
                value={otp[index] || ""}
                onChange={(e) =>
                  handleOtpChange(index, e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`h-12 w-12 rounded-lg border text-center text-xl font-semibold outline-none ${
                  errors.otp
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
            ))}
          </div>

          {errors.otp && (
            <p className="mt-3 text-center text-sm text-red-500">
              {errors.otp.message}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the OTP?
          </p>

          <button
            type="button"
            className="mt-2 font-medium text-blue-600 hover:text-blue-700"
          >
            Resend OTP
          </button>
        </div>

      </div>
    </div>
  )
}

export default OtpVerify
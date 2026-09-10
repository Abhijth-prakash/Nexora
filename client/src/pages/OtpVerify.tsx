const OtpVerify = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Verify OTP
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          Enter the 6-digit OTP sent to your email
        </p>

        <form className="mt-8">
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <input
                key={index}
                type="text"
                className="h-12 w-12 rounded-lg border border-gray-300 text-center text-xl font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            ))}
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
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
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen w-full bg-[#f7f6f5] flex flex-col">
      {/* Minimal header */}
      <header className="bg-white border-b border-[#ececec]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <Link to="/" className="text-2xl font-bold text-[#0a0a0a]">
            Nexora
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-md w-full">
          {/* 404 number */}
          <p className="text-[120px] sm:text-[160px] font-extrabold leading-none text-[#ff624d] select-none">
            404
          </p>

          {/* Heading */}
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-[#0a0a0a]">
            Page Not Found
          </h1>

          {/* Message */}
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            The page you're looking for doesn't exist or may have been moved.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto rounded-md bg-[#ff624d] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#ed5744]"
            >
              Go Home
            </Link>

            <Link
              to="/"
              className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;

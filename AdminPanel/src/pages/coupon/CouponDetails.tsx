import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getCouponById } from "../../redux/features/CouponSlice";

const CouponDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { Coupon, loading, error } = useAppSelector(
    (state) => state.couponData
  );

  useEffect(() => {
    if (id) {
      dispatch(getCouponById(id));
    }
  }, [dispatch, id]);

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount?: number | null) => {
    if (amount == null) return "Not specified";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const discountLabel = () => {
    if (!Coupon) return "";

    return Coupon.discountType === "percentage"
      ? `${Coupon.discountValue}% OFF`
      : `${formatCurrency(Coupon.discountValue)} OFF`;
  };

  if (loading && !Coupon) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f8f9fc]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
          <p className="text-sm font-medium text-slate-500">
            Loading coupon details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !Coupon) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f8f9fc] px-5">
        <div className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <svg
              className="h-7 w-7 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3m0 4h.01M10.3 3.86 1.82 18.14A2 2 0 0 0 3.53 21h16.94a2 2 0 0 0 1.71-2.86L13.71 3.86a2 2 0 0 0-3.41 0Z"
              />
            </svg>
          </div>

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load coupon
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {typeof error === "string"
              ? error
              : "Something went wrong while fetching the coupon details."}
          </p>

          <Link
            to="/admin/coupon"
            className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Back to Coupons
          </Link>
        </div>
      </div>
    );
  }

  if (!Coupon) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f8f9fc] px-5">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Coupon not found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            The requested coupon could not be found.
          </p>

          <Link
            to="/admin/coupon"
            className="mt-5 inline-flex rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Back to Coupons
          </Link>
        </div>
      </div>
    );
  }

  const categories = Coupon.applicableCategories ?? [];
  const isExpired = new Date(Coupon.expiryDate).getTime() < Date.now();
  const usageLimitReached =
    Coupon.usageLimit != null &&
    Coupon.usedCount >= Coupon.usageLimit;

  return (
    <div className="min-h-screen w-full bg-[#f8f9fc] text-slate-800">
      {/* Header */}
      <header className="w-full border-b border-slate-200 bg-white">
        <div className="flex w-full flex-col gap-4 px-4 py-5 sm:px-6 lg:px-10 lg:py-7">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link
              to="/admin"
              className="transition hover:text-orange-500"
            >
              Administration
            </Link>

            <span>/</span>

            <Link
              to="/admin/coupon"
              className="transition hover:text-orange-500"
            >
              Coupons
            </Link>

            <span>/</span>

            <span className="font-medium text-slate-800">
              Details
            </span>
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="break-all text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {Coupon.code}
                </h1>

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    Coupon.isActive && !isExpired && !usageLimitReached
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      Coupon.isActive && !isExpired && !usageLimitReached
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                    }`}
                  />
                  {isExpired
                    ? "Expired"
                    : usageLimitReached
                      ? "Usage Limit Reached"
                      : Coupon.isActive
                        ? "Active"
                        : "Inactive"}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                View and manage the complete details of this coupon.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/coupon"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m15 18-6-6 6-6"
                  />
                </svg>
                Back to Coupons
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Full-width Main Content */}
      <main className="w-full px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        {/* Overview */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {/* Discount Card */}
          <div className="relative overflow-hidden rounded-2xl bg-orange-500 p-6 text-white shadow-sm">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 right-16 h-28 w-28 rounded-full bg-white/10" />

            <div className="relative">
              <p className="text-sm font-medium text-orange-50">
                Coupon Discount
              </p>

              <h2 className="mt-4 text-3xl font-bold">
                {discountLabel()}
              </h2>

              <p className="mt-2 text-sm text-orange-50">
                {Coupon.discountType === "percentage"
                  ? "Percentage discount"
                  : "Fixed amount discount"}
              </p>
            </div>
          </div>

          {/* Minimum Order */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">
                Minimum Order
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6"
                  />
                  <circle cx="10" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>
              </div>
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              {formatCurrency(Coupon.minOrderAmount)}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Required cart value
            </p>
          </div>

          {/* Usage */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">
                Total Usage
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 19V5m0 14h16M8 15v-4m4 4V7m4 8v-6"
                  />
                </svg>
              </div>
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              {Coupon.usedCount}
              <span className="ml-1 text-base font-medium text-slate-400">
                / {Coupon.usageLimit ?? "∞"}
              </span>
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Times redeemed
            </p>
          </div>

          {/* Per User Limit */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">
                Per User Limit
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <circle cx="12" cy="8" r="4" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 21v-2a7 7 0 0 1 14 0v2"
                  />
                </svg>
              </div>
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              {Coupon.perUserLimit}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Uses allowed per customer
            </p>
          </div>
        </section>

        {/* Details Grid */}
        <section className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Main Details */}
          <div className="space-y-6 xl:col-span-2">
            {/* Coupon Information */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Coupon Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Basic information and discount configuration
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Coupon Code</p>
                  <p className="mt-2 break-all font-bold tracking-wide text-slate-900">
                    {Coupon.code}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Discount Type</p>
                  <p className="mt-2 font-semibold capitalize text-slate-900">
                    {Coupon.discountType}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-sm text-slate-500">Description</p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
                    {Coupon.description || "No description provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Discount Value
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {discountLabel()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Maximum Discount
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {Coupon.discountType === "percentage"
                      ? Coupon.maxDiscount != null
                        ? formatCurrency(Coupon.maxDiscount)
                        : "No maximum"
                      : "Not applicable"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Minimum Order Amount
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {formatCurrency(Coupon.minOrderAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Total Usage Limit
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {Coupon.usageLimit ?? "Unlimited"}
                  </p>
                </div>
              </div>
            </div>

            {/* Applicable Categories */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Applicable Categories
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Categories where this coupon can be used
                </p>
              </div>

              <div className="p-6">
                {categories.length === 0 ? (
                  <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m5 12 4 4L19 6"
                      />
                    </svg>

                    <div>
                      <p className="font-semibold text-emerald-800">
                        All Categories
                      </p>
                      <p className="mt-1 text-sm text-emerald-700">
                        This coupon applies to all product categories.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {categories.map((categoryId) => (
                      <span
                        key={categoryId}
                        className="inline-flex max-w-full items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-700"
                      >
                        <svg
                          className="h-4 w-4 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 5.5A1.5 1.5 0 0 1 5.5 4h4L20 14.5 14.5 20 4 9.5v-4Z"
                          />
                          <circle cx="7.5" cy="7.5" r=".75" />
                        </svg>
                        <span className="break-all">{categoryId}</span>
                      </span>
                    ))}
                  </div>
                )}

                {categories.length > 0 && (
                  <p className="mt-4 text-xs leading-5 text-slate-500">
                    Category identifiers are shown because the coupon response
                    contains category IDs rather than category names.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Validity and Status */}
          <aside className="space-y-6">
            {/* Validity */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Validity Period
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Coupon expiry information
                </p>
              </div>

              <div className="space-y-5 p-6">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 3v4M8 3v4M3 10h18"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-slate-500">
                      Expiry Date
                    </p>
                    <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                      {formatDate(Coupon.expiryDate)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isExpired
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 7v5l3 2"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Expiry Status
                    </p>
                    <p
                      className={`mt-1 text-sm font-semibold ${
                        isExpired ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      {isExpired ? "Expired" : "Not expired"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Coupon Status
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Current availability
                </p>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-600">
                    Activation
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      Coupon.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {Coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-600">
                    Expiration
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isExpired
                        ? "bg-red-50 text-red-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {isExpired ? "Expired" : "Valid"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-600">
                    Usage
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      usageLimitReached
                        ? "bg-amber-50 text-amber-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {usageLimitReached ? "Limit reached" : "Available"}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs leading-5 text-slate-500">
                    A coupon is usable only when it is active, has not expired,
                    and has remaining usage capacity. Other checkout eligibility
                    rules may also apply.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default CouponDetails;

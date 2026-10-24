
import React, { useEffect, useState } from "react";
import CouponForm from "./CouponForm";
import {
  addpage,
  getCoupons,
  minusPage,
} from "../../redux/features/CouponSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import AdminSidebar from "../../components/Adminsidebar";

const Coupon = () => {
  const [form, setForm] = useState(false);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const dispatch = useAppDispatch();

  const onCLose = () => setForm(false);

  const {
    page,
    totalPages,
    Coupons,
    totalCoupons,
    loading,
    error,
  } = useAppSelector((state) => state.couponData);

  const limit = 5;

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getCoupons({ page, search, filter, limit }));
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, page, search, filter]);

  const activeCoupons =
    Coupons?.filter((coupon) => coupon.isActive).length ?? 0;

  const inactiveCoupons =
    (Coupons?.length ?? 0) - activeCoupons;

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fc] text-slate-800">
      <AdminSidebar />

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        {/* Header */}
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Administration
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Coupon Management
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Create, edit and manage promotional coupons for your store.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setForm(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-100"
          >
            <span className="text-lg leading-none">+</span>
            Add Coupon
          </button>
        </header>

        {form && <CouponForm onCLose={onCLose} />}

        {/* Summary cards */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Coupons
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {totalCoupons}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Coupons in your store
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Active Coupons
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-600">
              {activeCoupons}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Active on this page
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Inactive Coupons
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-700">
              {inactiveCoupons}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Inactive on this page
            </p>
          </div>
        </section>

        {/* Search and filter */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Find coupons
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Search by coupon code or filter by status.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>

              <input
                type="text"
                placeholder="Search coupon code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div className="relative sm:w-64">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              >
                <option value="">All coupons</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("");
              }}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </section>

        {/* Coupon table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                All Coupons
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage coupon details and availability.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              {totalCoupons} coupons
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="hidden grid-cols-[1.5fr_1fr_1.2fr_1.3fr_0.6fr_0.9fr_0.8fr_1.2fr] gap-4 border-b border-slate-100 bg-slate-50/80 px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 xl:grid">
              <div>Coupon Code</div>
              <div>Discount</div>
              <div>Min. Order</div>
              <div>Valid Until</div>
              <div>Used</div>
              <div>Status</div>
              <div>Active</div>
              <div>Actions</div>
            </div>

            <div className="flex min-h-[260px] flex-col">
              {loading ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-20">
                  <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-orange-100 border-t-orange-500" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700">
                      Loading coupons
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Please wait while coupons are fetched.
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-1 items-center justify-center px-5 py-16 text-center">
                  <p className="text-sm font-medium text-red-600">{error}</p>
                </div>
              ) : Coupons?.length ? (
                Coupons.map((coupon) => {
                  const expired =
                    new Date(coupon.expiryDate).getTime() < Date.now();

                  return (
                    <div
                      key={coupon._id}
                      className="grid grid-cols-1 gap-4 border-b border-slate-100 px-5 py-5 transition-colors last:border-b-0 hover:bg-slate-50/80 sm:px-6 xl:grid-cols-[1.5fr_1fr_1.2fr_1.3fr_0.6fr_0.9fr_0.8fr_1.2fr] xl:items-center xl:gap-4"
                    >
                      <div className="min-w-0">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 xl:hidden">
                          Coupon Code
                        </p>
                        <p className="break-words text-sm font-bold text-slate-900">
                          {coupon.code}
                        </p>
                      </div>

                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 xl:hidden">
                          Discount
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}% OFF`
                            : `₹${coupon.discountValue} OFF`}
                        </p>
                      </div>

                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 xl:hidden">
                          Minimum Order
                        </p>
                        <p className="text-sm text-slate-600">
                          ₹{coupon.minOrderAmount.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 xl:hidden">
                          Valid Until
                        </p>
                        <p className="text-sm text-slate-600">
                          {new Date(coupon.expiryDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 xl:hidden">
                          Used
                        </p>
                        <p className="text-sm text-slate-600">
                          {coupon.usedCount}
                        </p>
                      </div>

                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 xl:hidden">
                          Status
                        </p>
                        <span
                          className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                            expired
                              ? "bg-amber-50 text-amber-700"
                              : coupon.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              expired
                                ? "bg-amber-500"
                                : coupon.isActive
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                            }`}
                          />
                          {expired
                            ? "Expired"
                            : coupon.isActive
                              ? "Active"
                              : "Inactive"}
                        </span>
                      </div>

                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 xl:hidden">
                          Active
                        </p>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={coupon.isActive}
                          aria-label={`Toggle ${coupon.code} status`}
                          onClick={() => {
                            // Connect your active-toggle thunk here.
                          }}
                          className={`relative h-6 w-11 rounded-full transition ${
                            coupon.isActive ? "bg-orange-500" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                              coupon.isActive ? "left-6" : "left-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 xl:hidden">
                          Actions
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              // Connect your edit form here.
                            }}
                            className="rounded-lg border border-orange-100 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              // Connect your delete thunk here.
                            }}
                            className="rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4V8z" />
                      <path d="M13 7v10" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-slate-800">
                    No coupons found
                  </h3>
                  <p className="mt-1 max-w-sm text-sm text-slate-500">
                    Try changing your search or filter to see available coupons.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="border-t border-slate-100 bg-slate-50/60">
            <div className="h-1 w-full bg-slate-100">
              <div
                className="h-full bg-orange-500 transition-all duration-300"
                style={{
                  width: totalPages
                    ? `${(page / totalPages) * 100}%`
                    : "0%",
                }}
              />
            </div>

            <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {Coupons?.length ? (page - 1) * limit + 1 : 0}–
                  {(page - 1) * limit + (Coupons?.length ?? 0)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800">
                  {totalCoupons}
                </span>{" "}
                coupons
              </p>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <button
                  disabled={page <= 1 || loading}
                  onClick={() => dispatch(minusPage())}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Previous
                </button>

                <span className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white">
                  {page}
                  <span className="ml-1 text-orange-100">
                    / {totalPages || 1}
                  </span>
                </span>

                <button
                  disabled={page >= totalPages || loading || totalPages === 0}
                  onClick={() => dispatch(addpage())}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Coupon;

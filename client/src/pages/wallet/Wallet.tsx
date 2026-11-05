import { useEffect, useState } from "react";
import { getWallet } from "../../redux/features/walletSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { WalletTransaction } from "../../utils/baseTypes";
import ProfileSidebar from "../../components/layouts/Profilesidebar";


const LIMIT = 8;

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const label = (t: WalletTransaction) => {
  const ref = t.order ? ` #${t.order.slice(-6).toUpperCase()}` : "";
  return t.reason === "refund" ? `Refund · Order${ref}` : `Order${ref}`;
};

const Wallet = () => {
  const dispatch = useAppDispatch();
  const { wallet, loading, error, isStale } = useAppSelector((s) => s.walletData);
  const [page, setPage] = useState(1);

  // fetch when the page changes
  useEffect(() => {
    dispatch(getWallet({ page, limit: LIMIT }));
  }, [page, dispatch]);

  // refetch when something (e.g. a cancel) marks the wallet stale
  useEffect(() => {
    if (isStale && wallet) dispatch(getWallet({ page, limit: LIMIT }));
  }, [isStale]); // eslint-disable-line react-hooks/exhaustive-deps

  const txns = wallet?.transactions ?? [];
  const pg = wallet?.pagination;

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-[#111111]">
      <div className="w-full px-3 py-4 sm:px-4 lg:px-5">
        <div className="grid min-h-[calc(100vh-105px)] w-full grid-cols-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">

          {/* SIDEBAR */}

          <ProfileSidebar />

          {/* MAIN CONTENT */}

          <main className="min-w-0 w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex h-full min-h-[calc(100vh-105px)] flex-col p-6 sm:p-7 lg:p-9">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    My Wallet
                  </h1>

                  <p className="mt-1 text-sm text-gray-400">
                    Manage your wallet balance and view your recent transactions.
                  </p>
                </div>

                <div className="hidden h-14 w-14 items-center justify-center rounded-xl bg-[#fff1eb] text-[#ff5a1f] sm:flex">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5v-9z"
                    />
                    <path strokeLinecap="round" d="M16 13h2" />
                  </svg>
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-5 py-4">
                  <p className="text-sm font-semibold text-red-700">
                    Something went wrong
                  </p>

                  <p className="mt-1 text-xs text-red-500">{error}</p>
                </div>
              )}

              {/* BALANCE CARD */}

              <div className="relative mt-5 flex flex-col gap-6 overflow-hidden rounded-2xl bg-neutral-950 p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#ff5a1f]/20 blur-2xl" />

                <div className="relative">
                  <p className="text-sm text-neutral-400">
                    Available Balance
                  </p>

                  <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                    {loading && !wallet ? "..." : formatINR(wallet?.balance ?? 0)}
                  </p>
                </div>

                <button
                  disabled
                  title="Coming soon"
                  className="relative w-fit rounded-xl bg-[#ff5a1f] px-8 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
                >
                  Add Money
                </button>
              </div>

              {/* STATS */}

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: "Total Added", value: formatINR(wallet?.totalAdded ?? 0) },
                  { label: "Total Spent", value: formatINR(wallet?.totalSpent ?? 0) },
                  { label: "Transactions", value: String(pg?.total ?? 0) },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {s.label}
                    </p>

                    <p className="mt-2 break-words text-2xl font-bold text-gray-900">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* TRANSACTIONS */}

              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Transactions
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Your latest wallet activity.
                </p>

                <div
                  className={`mt-4 overflow-hidden rounded-2xl border border-gray-200 ${
                    loading ? "opacity-60" : ""
                  }`}
                >
                  <div className="grid grid-cols-[1fr_7rem_6rem] gap-4 bg-gray-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    <span>Transaction</span>
                    <span>Date</span>
                    <span className="text-right">Amount</span>
                  </div>

                  {txns.length === 0 ? (
                    <p className="border-t border-gray-100 py-14 text-center text-sm text-gray-400">
                      No transactions yet.
                    </p>
                  ) : (
                    txns.map((t) => {
                      const credit = t.type === "credit";
                      return (
                        <div
                          key={t._id}
                          className="grid grid-cols-[1fr_7rem_6rem] items-center gap-4 border-t border-gray-100 px-5 py-4 transition hover:bg-gray-50"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                credit
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {credit ? "+" : "−"}
                            </span>

                            <span className="truncate text-sm font-semibold text-gray-900">
                              {label(t)}
                            </span>
                          </div>

                          <span className="text-sm text-gray-400">
                            {formatDate(t.createdAt)}
                          </span>

                          <span
                            className={`text-right text-sm font-semibold ${
                              credit ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {credit ? "+" : "−"} {formatINR(t.amount)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* PAGINATION */}

              {pg && pg.totalPages > 1 && (
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
                  <span className="text-sm text-gray-400">
                    Page {pg.page} of {pg.totalPages}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page <= 1 || loading}
                      className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-[#ff5a1f] hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!pg.hasMore || loading}
                      className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-[#ff5a1f] hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
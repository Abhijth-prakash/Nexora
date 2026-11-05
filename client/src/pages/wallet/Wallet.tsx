import { useEffect, useState } from "react";
import { getWallet } from "../../redux/features/walletSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { WalletTransaction } from "../../utils/baseTypes";

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
    <div className="min-h-[70vh] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-10">
        <h1 className="text-2xl font-bold">My Wallet</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Manage your wallet balance and view your recent transactions.
        </p>

        {/* Balance card */}
        <div className="mt-8 flex items-center justify-between rounded-xl bg-neutral-950 p-8 text-white">
          <div>
            <p className="text-sm text-neutral-400">Available Balance</p>
            <p className="mt-2 text-4xl font-bold sm:text-5xl">
              {loading && !wallet ? "..." : formatINR(wallet?.balance ?? 0)}
            </p>
          </div>
          <button
            disabled
            title="Coming soon"
            className="rounded-lg bg-orange-500 px-8 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            Add Money
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Total Added", value: formatINR(wallet?.totalAdded ?? 0) },
            { label: "Total Spent", value: formatINR(wallet?.totalSpent ?? 0) },
            { label: "Transactions", value: String(pg?.total ?? 0) },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-neutral-100 p-6">
              <p className="text-sm text-neutral-500">{s.label}</p>
              <p className="mt-2 text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <h2 className="mt-10 text-lg font-bold">Recent Transactions</h2>

        <div
          className={`mt-4 border-t border-neutral-200 ${
            loading ? "opacity-60" : ""
          }`}
        >
          <div className="grid grid-cols-[1fr_7rem_6rem] gap-4 py-3 text-xs text-neutral-500">
            <span>Transaction</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
          </div>

          {txns.length === 0 ? (
            <p className="border-t border-neutral-200 py-12 text-center text-sm text-neutral-500">
              No transactions yet.
            </p>
          ) : (
            txns.map((t) => {
              const credit = t.type === "credit";
              return (
                <div
                  key={t._id}
                  className="grid grid-cols-[1fr_7rem_6rem] items-center gap-4 border-t border-neutral-200 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                        credit
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {credit ? "+" : "−"}
                    </span>
                    <span className="text-sm font-semibold">{label(t)}</span>
                  </div>
                  <span className="text-sm text-neutral-500">
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

        {/* Pagination */}
        {pg && pg.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4">
            <span className="text-sm text-neutral-500">
              Page {pg.page} of {pg.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1 || loading}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pg.hasMore || loading}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
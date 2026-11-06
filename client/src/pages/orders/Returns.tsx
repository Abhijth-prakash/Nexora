import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getUserReturns } from "../../redux/features/orderSlice";
import {
  Package,
  CalendarDays,
  Undo2,
  XCircle,
  ArrowUpRight,
  RefreshCw,
  MessageSquareText,
} from "lucide-react";
import ProfileSidebar from "../../components/layouts/Profilesidebar";
import { UserProfile } from "../../redux/features/userSlice";

/* eslint-disable @typescript-eslint/no-explicit-any */

const Returns = () => {
  const dispatch = useAppDispatch();
  const { returns, loading, ordererrors } = useAppSelector(
    (state) => state.orderData
  );

    const {  isStale } = useAppSelector(
    (state) => state.userData
  );

  useEffect(() => {
    dispatch(getUserReturns());
  }, [dispatch]);

   useEffect(() => {
        if (isStale) {
          dispatch(UserProfile());
        }
      }, [dispatch, isStale]);

  const formatDate = (date?: string | null) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const getOrderId = (ret: any): string =>
    typeof ret?.order === "string" ? ret.order : ret?.order?._id ?? "";

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-emerald-50 text-emerald-700 ring-emerald-100";
      case "rejected":
        return "bg-red-50 text-red-700 ring-red-100";
      case "pending":
      case "requested":
        return "bg-amber-50 text-amber-700 ring-amber-100";
      default:
        return "bg-gray-50 text-gray-600 ring-gray-200";
    }
  };

  const list = returns || [];

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-[#111111]">
      <div className="w-full px-3 py-4 sm:px-4 lg:px-5">
        <div className="grid min-h-[calc(100vh-105px)] w-full grid-cols-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <ProfileSidebar />

          <main className="min-w-0 w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex h-full min-h-[calc(100vh-105px)] flex-col p-6 sm:p-7 lg:p-9">
              {/* HEADER */}
              <div className="flex flex-col justify-between gap-5 border-b border-gray-100 pb-6 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a1f]" />
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      Your account / Returns
                    </p>
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    My Returns<span className="text-[#ff5a1f]">.</span>
                  </h1>

                  <p className="mt-1 text-sm text-gray-400">
                    Track the items you've sent back.
                  </p>
                </div>

                <div className="flex w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-[#fff8f5] px-5 py-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1eb] text-[#ff5a1f]">
                    <Undo2 size={19} />
                  </div>
                  <div>
                    <p className="text-xl font-bold leading-none text-gray-900">
                      {list.length.toLocaleString("en-IN")}
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-gray-400">
                      Total returns
                    </p>
                  </div>
                </div>
              </div>

              {/* LOADING */}
              {loading && (
                <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white py-24">
                  <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-orange-100 border-t-[#ff5a1f]" />
                  <p className="text-sm text-gray-400">Loading returns...</p>
                </div>
              )}

              {/* ERROR */}
              {!loading && ordererrors && (
                <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <XCircle size={25} />
                  </div>
                  <h2 className="mt-5 text-lg font-bold text-gray-900">
                    Couldn't load your returns
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                    {ordererrors}
                  </p>
                  <button
                    onClick={() => dispatch(getUserReturns())}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff5a1f]"
                  >
                    <RefreshCw size={15} />
                    Try again
                  </button>
                </div>
              )}

              {/* EMPTY */}
              {!loading && !ordererrors && list.length === 0 && (
                <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-24 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#fff1eb]">
                    <Undo2 size={34} className="text-[#ff5a1f]" />
                  </div>
                  <h2 className="mt-6 text-xl font-bold text-gray-900">
                    No returns yet
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
                    When you request a return, it will show up here.
                  </p>
                  <Link
                    to="/users/orders"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff5a1f]"
                  >
                    View all orders
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              )}

              {/* LIST */}
              {!loading && !ordererrors && list.length > 0 && (
                <div className="mt-6 space-y-4">
                  {list.map((ret: any) => (
                    <Link
                      key={ret._id}
                      to={`/users/orders/returns/${ret._id}`}
                      className="group block w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-left transition-all duration-300 hover:border-[#ffb18f] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]"
                    >
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff5f0] text-[#ff5a1f] transition-colors group-hover:bg-[#ff5a1f] group-hover:text-white">
                              <Package size={22} />
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                                Return reference
                              </p>
                              <h3 className="mt-1 text-sm font-bold tracking-wide text-gray-900">
                                #{ret._id.slice(-8).toUpperCase()}
                              </h3>
                            </div>
                          </div>

                          {ret.status && (
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-bold capitalize ring-1 ring-inset ${getStatusStyle(
                                ret.status
                              )}`}
                            >
                              {String(ret.status).replace(/_/g, " ")}
                            </span>
                          )}
                        </div>

                        <div className="my-5 grid grid-cols-2 gap-5 border-y border-gray-100 py-5 sm:grid-cols-3">
                          <div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <CalendarDays size={14} />
                              <span className="text-[10px] font-semibold uppercase tracking-wider">
                                Requested on
                              </span>
                            </div>
                            <p className="mt-2 text-sm font-semibold text-gray-800">
                              {formatDate(ret.createdAt)}
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <Package size={14} />
                              <span className="text-[10px] font-semibold uppercase tracking-wider">
                                Order
                              </span>
                            </div>
                            <p className="mt-2 text-sm font-semibold text-gray-800">
                              {getOrderId(ret)
                                ? `#${getOrderId(ret).slice(-8).toUpperCase()}`
                                : "—"}
                            </p>
                          </div>

                          <div className="col-span-2 sm:col-span-1">
                            <div className="flex items-center gap-2 text-gray-400">
                              <MessageSquareText size={14} />
                              <span className="text-[10px] font-semibold uppercase tracking-wider">
                                Reason
                              </span>
                            </div>
                            <p className="mt-2 truncate text-sm font-semibold capitalize text-gray-800">
                              {ret.reasonForreturning || "—"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <p className="line-clamp-1 text-sm text-gray-400">
                            {ret.description || "No additional details"}
                          </p>

                          <div className="flex shrink-0 items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600 transition-all group-hover:bg-[#fff1eb] group-hover:text-[#ff5a1f]">
                            View details
                            <ArrowUpRight
                              size={15}
                              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="h-1 w-0 bg-[#ff5a1f] transition-all duration-300 group-hover:w-full" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Returns;
import { useEffect, useMemo, useState } from "react";
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
  Wallet,
  Check,
} from "lucide-react";
import ProfileSidebar from "../../components/layouts/Profilesidebar";
import { UserProfile } from "../../redux/features/userSlice";

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ---------- constants ---------- */

// Same grouping as the return details page
const STEPS = [
  { key: "requested", label: "Requested", statuses: ["requested", "pending"] },
  { key: "approved", label: "Approved", statuses: ["approved"] },
  {
    key: "pickedUp",
    label: "Picked up",
    statuses: ["picked_up", "pickup_completed", "in_transit"],
  },
  { key: "received", label: "Received", statuses: ["received"] },
  {
    key: "refunded",
    label: "Refunded",
    statuses: ["refunded", "completed", "returned"],
  },
];

const FILTERS = [
  { key: "all", label: "All", statuses: [] as string[] },
  {
    key: "active",
    label: "In progress",
    statuses: [
      "requested",
      "pending",
      "approved",
      "picked_up",
      "pickup_completed",
      "in_transit",
      "received",
    ],
  },
  {
    key: "refunded",
    label: "Refunded",
    statuses: ["refunded", "completed", "returned"],
  },
  { key: "closed", label: "Rejected / cancelled", statuses: ["rejected", "cancelled"] },
];

/* ---------- helpers ---------- */

const formatDate = (date?: string | null) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const formatPrice = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const asObject = (value: any) =>
  value && typeof value === "object" ? value : null;

const getOrderId = (ret: any): string =>
  typeof ret?.order === "string" ? ret.order : ret?.order?._id ?? "";

// Checks every place an image could live (order snapshot, product, variant)
const getItemImage = (item: any): string | null => {
  const product = asObject(item?.product);
  const variant = asObject(item?.variantId);

  const img =
    item?.image ??
    item?.images?.[0] ??
    product?.images?.[0] ??
    product?.image ??
    variant?.images?.[0] ??
    variant?.image ??
    null;

  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url ?? img.secure_url ?? img.src ?? img.path ?? null;
};

const getStatusStyle = (status?: string) => {
  switch (status) {
    case "approved":
    case "completed":
    case "refunded":
    case "returned":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    case "rejected":
    case "cancelled":
      return "bg-red-50 text-red-700 ring-red-100";
    case "pending":
    case "requested":
      return "bg-amber-50 text-amber-700 ring-amber-100";
    default:
      return "bg-blue-50 text-blue-700 ring-blue-100";
  }
};

/* ---------- small components ---------- */

const Thumb = ({
  src,
  alt,
  extra,
}: {
  src: string | null;
  alt: string;
  extra: number;
}) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:h-32 sm:w-32">
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Package size={32} className="text-gray-300" />
        </div>
      )}

      {extra > 0 && (
        <span className="absolute bottom-1.5 right-1.5 rounded-full bg-gray-900/85 px-2 py-0.5 text-[10px] font-bold text-white">
          +{extra} more
        </span>
      )}
    </div>
  );
};

const ProgressBar = ({ status }: { status?: string }) => {
  const current = STEPS.findIndex((s) => s.statuses.includes(status ?? ""));

  return (
    <ol className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= current;
        const isLast = i === STEPS.length - 1;

        return (
          <li
            key={step.key}
            className={`flex items-center ${isLast ? "" : "flex-1"}`}
          >
            <div className="flex flex-col items-center">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  done
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-gray-200 bg-white"
                }`}
              >
                {done && <Check size={11} strokeWidth={3} />}
              </span>
              <span
                className={`mt-1.5 hidden text-[10px] font-semibold sm:block ${
                  done ? "text-gray-700" : "text-gray-300"
                }`}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <span
                className={`mx-1.5 mb-0 h-0.5 flex-1 rounded sm:mb-4 ${
                  i < current ? "bg-emerald-400" : "bg-gray-200"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};

const SkeletonCard = () => (
  <div className="flex animate-pulse gap-5 rounded-2xl border border-gray-100 bg-white p-5">
    <div className="h-28 w-28 shrink-0 rounded-xl bg-gray-100 sm:h-32 sm:w-32" />
    <div className="flex-1 space-y-3 py-1">
      <div className="h-4 w-1/3 rounded bg-gray-100" />
      <div className="h-3 w-1/4 rounded bg-gray-100" />
      <div className="h-3 w-2/3 rounded bg-gray-100" />
      <div className="h-3 w-1/2 rounded bg-gray-100" />
    </div>
  </div>
);

/* ---------- page ---------- */

const Returns = () => {
  const dispatch = useAppDispatch();
  const { returns, loading, ordererrors } = useAppSelector(
    (state) => state.orderData
  );
  const { isStale } = useAppSelector((state) => state.userData);

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getUserReturns());
  }, [dispatch]);

  useEffect(() => {
    if (isStale) {
      dispatch(UserProfile());
    }
  }, [dispatch, isStale]);

  const list: any[] = returns || [];

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    FILTERS.forEach((f) => {
      result[f.key] =
        f.key === "all"
          ? list.length
          : list.filter((r) => f.statuses.includes(r.status)).length;
    });
    return result;
  }, [list]);

  const visible = useMemo(() => {
    const active = FILTERS.find((f) => f.key === filter);
    if (!active || active.key === "all") return list;
    return list.filter((r) => active.statuses.includes(r.status));
  }, [list, filter]);

  const showList = !loading && !ordererrors && list.length > 0;

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

              {/* FILTERS */}
              {showList && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {FILTERS.map((f) => {
                    const active = filter === f.key;
                    return (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setFilter(f.key)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                          active
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-[#ffb18f] hover:text-[#ff5a1f]"
                        }`}
                      >
                        {f.label}
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                            active
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {counts[f.key]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* LOADING */}
              {loading && (
                <div className="mt-6 space-y-4">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
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

              {/* FILTER HAS NO MATCHES */}
              {showList && visible.length === 0 && (
                <div className="mt-6 rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
                  <p className="text-sm font-semibold text-gray-700">
                    No returns in this view
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className="mt-3 text-xs font-semibold text-[#ff5a1f] hover:underline"
                  >
                    Show all returns
                  </button>
                </div>
              )}

              {/* LIST */}
              {showList && visible.length > 0 && (
                <div className="mt-6 space-y-4">
                  {visible.map((ret: any) => {
                    const order = asObject(ret.order);
                    const items: any[] = order?.items ?? [];
                    const firstItem = items[0];
                    const product = asObject(firstItem?.product);
                    const variant = asObject(firstItem?.variantId);

                    const name =
                      product?.name ?? firstItem?.name ?? "Returned item";
                    const brand =
                      typeof product?.brand === "string"
                        ? product.brand
                        : product?.brand?.name ?? firstItem?.brand;
                    const variantLabel =
                      variant?.size ??
                      variant?.name ??
                      variant?.color ??
                      firstItem?.size;

                    const rejected =
                      ret.status === "rejected" || ret.status === "cancelled";
                    const reason = (ret.reasonForreturning || ret.reason || "")
                      .toString()
                      .replace(/_/g, " ");
                    const orderId = getOrderId(ret);

                    return (
                      <Link
                        key={ret._id}
                        to={`/users/orders/returns/${ret._id}`}
                        className="group block w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-left transition-all duration-300 hover:border-[#ffb18f] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]"
                      >
                        <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                          <Thumb
                            src={getItemImage(firstItem)}
                            alt={name}
                            extra={Math.max(items.length - 1, 0)}
                          />

                          <div className="flex min-w-0 flex-1 flex-col">
                            {/* top row */}
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                                  Return #{ret._id.slice(-8).toUpperCase()}
                                </p>
                                <h3 className="mt-1 truncate text-base font-bold text-gray-900">
                                  {name}
                                </h3>
                                {(brand || variantLabel) && (
                                  <p className="mt-0.5 truncate text-xs text-gray-500">
                                    {[brand, variantLabel && `Size: ${variantLabel}`]
                                      .filter(Boolean)
                                      .join(" • ")}
                                  </p>
                                )}
                              </div>

                              {ret.status && (
                                <span
                                  className={`inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-[11px] font-bold capitalize ring-1 ring-inset ${getStatusStyle(
                                    ret.status
                                  )}`}
                                >
                                  {String(ret.status).replace(/_/g, " ")}
                                </span>
                              )}
                            </div>

                            {/* meta */}
                            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:grid-cols-4">
                              <div>
                                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                  <CalendarDays size={12} /> Requested
                                </p>
                                <p className="mt-1 font-semibold text-gray-800">
                                  {formatDate(ret.createdAt)}
                                </p>
                              </div>

                              <div>
                                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                  <Package size={12} /> Order
                                </p>
                                <p className="mt-1 font-semibold text-gray-800">
                                  {orderId
                                    ? `#${orderId.slice(-8).toUpperCase()}`
                                    : "—"}
                                </p>
                              </div>

                              <div className="min-w-0">
                                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                  <MessageSquareText size={12} /> Reason
                                </p>
                                <p className="mt-1 truncate font-semibold capitalize text-gray-800">
                                  {reason || "—"}
                                </p>
                              </div>

                              <div>
                                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                  <Wallet size={12} /> Refund
                                </p>
                                <p className="mt-1 font-semibold text-gray-800">
                                  {ret.refund?.amount
                                    ? formatPrice(ret.refund.amount)
                                    : "—"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* progress / rejected note */}
                        <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4">
                          {rejected ? (
                            <div className="flex items-center gap-2 text-xs font-semibold text-red-600">
                              <XCircle size={15} />
                              <span className="capitalize">
                                Return {ret.status}
                              </span>
                              {ret.rejectionReason && (
                                <span className="truncate font-normal text-red-500">
                                  — {ret.rejectionReason}
                                </span>
                              )}
                            </div>
                          ) : (
                            <ProgressBar status={ret.status} />
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-4 px-5 py-3">
                          <p className="line-clamp-1 text-xs text-gray-400">
                            {ret.description || "No additional details"}
                          </p>

                          <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-gray-500 transition-colors group-hover:text-[#ff5a1f]">
                            View details
                            <ArrowUpRight
                              size={14}
                              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                          </span>
                        </div>

                        <div className="h-1 w-0 bg-[#ff5a1f] transition-all duration-300 group-hover:w-full" />
                      </Link>
                    );
                  })}
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
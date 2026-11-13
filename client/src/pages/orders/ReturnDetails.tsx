
import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getUserReturns } from "../../redux/features/orderSlice";
import {
  Package,
  CalendarDays,
  Undo2,
  XCircle,
  ArrowLeft,
  Check,
  MessageSquareText,
  User,
  MapPin,
  Mail,
  Phone,
  RefreshCw,
  FileText,
  Wallet,
  ShieldCheck,
  Clock3,
  ChevronRight,
} from "lucide-react";
import ProfileSidebar from "../../components/layouts/Profilesidebar";
import { UserProfile } from "../../redux/features/userSlice";

/* eslint-disable @typescript-eslint/no-explicit-any */

const STEPS = [
  {
    key: "requested",
    label: "Return requested",
    note: "Your return request has been submitted.",
    statuses: ["requested", "pending"],
  },
  {
    key: "approved",
    label: "Return approved",
    note: "Your return request has been approved.",
    statuses: ["approved"],
  },
  {
    key: "pickedUp",
    label: "Item picked up",
    note: "Your returned item has been collected.",
    statuses: ["picked_up", "pickup_completed", "in_transit"],
  },
  {
    key: "received",
    label: "Item received",
    note: "Your returned item has been received.",
    statuses: ["received"],
  },
  {
    key: "refunded",
    label: "Refund completed",
    note: "Your refund process has been completed.",
    statuses: ["refunded", "completed", "returned"],
  },
];

const formatPrice = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const ReturnDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { returns, loading, ordererrors } = useAppSelector(
    (state) => state.orderData
  );
   const {  isStale } = useAppSelector(
    (state) => state.userData
  );

//this is  get returns hook

  useEffect(() => {
    if (!returns || returns.length === 0) {
      dispatch(getUserReturns());
    }
  }, [dispatch, returns]);


      useEffect(() => {
        if (isStale) {
          dispatch(UserProfile());
        }
      }, [dispatch, isStale]);

  const ret: any = useMemo(
    () => (returns || []).find((r: any) => r._id === id),
    [returns, id]
  );

  const order: any =
    ret?.order && typeof ret.order === "object" ? ret.order : null;

  const user: any =
    ret?.user && typeof ret.user === "object"
      ? ret.user
      : order?.user && typeof order.user === "object"
      ? order.user
      : null;

  const address: any =
    order?.address && typeof order.address === "object"
      ? order.address
      : null;

  const firstItem: any = order?.items?.[0];

  const product: any =
    firstItem?.product && typeof firstItem.product === "object"
      ? firstItem.product
      : null;

  const variant: any =
    firstItem?.variantId && typeof firstItem.variantId === "object"
      ? firstItem.variantId
      : null;

  const formatDate = (date?: string | null) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getImage = (): string | null => {
    const img =
      product?.images?.[0] ??
      product?.image ??
      variant?.images?.[0] ??
      null;

    if (!img) return null;

    return typeof img === "string" ? img : img.url ?? null;
  };

  const isRejected = ret?.status === "rejected";
  const isCancelled = ret?.status === "cancelled";

  const currentStep = useMemo(() => {
    if (!ret) return -1;

    return STEPS.findIndex((step) =>
      step.statuses.includes(ret.status)
    );
  }, [ret]);

  const stepDate = (key: string): string | null => {
    switch (key) {
      case "requested":
        return formatDate(
          ret?.trackingDates?.requested ?? ret?.createdAt
        );

      case "refunded":
        return formatDate(
          ret?.trackingDates?.refunded ??
          ret?.refund?.refundedAt
        );

      default:
        return formatDate(ret?.trackingDates?.[key]);
    }
  };

  const addressLines = address
    ? [
        address.name || address.fullName,
        address.addressLine1 ||
          address.line1 ||
          address.street ||
          address.address,
        address.addressLine2 || address.line2 || address.landmark,
        [address.city, address.state].filter(Boolean).join(", "),
        [
          address.pincode || address.postalCode || address.zip,
          address.country,
        ]
          .filter(Boolean)
          .join(" - "),
      ].filter(Boolean)
    : [];

  const imageSrc = getImage();

  const statusColor =
    isRejected || isCancelled
      ? "bg-red-50 text-red-600 ring-red-100"
      : ret?.status === "refunded"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : "bg-orange-50 text-orange-700 ring-orange-100";

  const refundStatus = ret?.refund?.status || "pending";

  const refundStatusColor =
    refundStatus === "completed"
      ? "bg-emerald-50 text-emerald-700"
      : refundStatus === "failed"
      ? "bg-red-50 text-red-600"
      : "bg-amber-50 text-amber-700";

  if (loading && !ret) {
    return (
      <div className="min-h-screen bg-[#f7f7f8]">
        <div className="w-full px-3 py-4 sm:px-4 lg:px-5">
          <div className="grid min-h-[calc(100vh-105px)] grid-cols-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
            <ProfileSidebar />

            <main className="flex min-h-[500px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
              <div className="text-center">
                <RefreshCw
                  size={30}
                  className="mx-auto animate-spin text-[#ff5a1f]"
                />
                <p className="mt-3 text-sm font-medium text-gray-500">
                  Loading return details...
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (!ret) {
    return (
      <div className="min-h-screen bg-[#f7f7f8]">
        <div className="w-full px-3 py-4 sm:px-4 lg:px-5">
          <div className="grid min-h-[calc(100vh-105px)] grid-cols-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
            <ProfileSidebar />

            <main className="flex min-w-0 items-center justify-center rounded-2xl border border-gray-200 bg-white p-6">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  <Package size={30} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-gray-900">
                  Return not found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {ordererrors ||
                    "This return request doesn't exist or may have been removed."}
                </p>

                <Link
                  to="/users/orders/returns"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff5a1f]"
                >
                  <ArrowLeft size={15} />
                  Back to returns
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-gray-900">
      <div className="w-full px-3 py-4 sm:px-4 lg:px-5">
        <div className="grid min-h-[calc(100vh-105px)] w-full grid-cols-1 items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">

          <ProfileSidebar />

          <main className="min-w-0 w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 lg:p-9">

            {/* PAGE HEADER */}

            <div className="mb-8">
              <Link
                to="/users/orders/returns"
                className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-gray-400 transition hover:text-[#ff5a1f]"
              >
                <ArrowLeft size={15} />
                Back to returns
              </Link>

              <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#ff5a1f]">
                      <Undo2 size={23} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                        Order management
                      </p>

                      <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Return details
                        <span className="text-[#ff5a1f]">.</span>
                      </h1>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span>Return reference</span>
                    <span className="font-mono font-semibold text-gray-700">
                      #{ret._id.slice(-8).toUpperCase()}
                    </span>
                    <span>•</span>
                    <span>{formatDate(ret.createdAt)}</span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold capitalize ring-1 ring-inset ${statusColor}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {ret.status?.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* MAIN CONTENT */}

            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">

              {/* LEFT COLUMN */}

              <div className="min-w-0 space-y-6">

                {/* PRODUCT CARD */}

                {firstItem && (
                  <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-[#ff5a1f]">
                          <Package size={18} />
                        </div>

                        <div>
                          <h2 className="text-sm font-bold text-gray-900">
                            Returned product
                          </h2>
                          <p className="mt-0.5 text-[11px] text-gray-400">
                            Product details
                          </p>
                        </div>
                      </div>

                      <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-[10px] font-semibold text-gray-500">
                        {order?.items?.length || 1} item(s)
                      </span>
                    </div>

                    <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
                      <div className="flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:w-36">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={product?.name || "Product"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package size={35} className="text-gray-300" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-gray-900">
                          {product?.name || "Product"}
                        </h3>

                        {product?.brand && (
                          <p className="mt-1 text-xs text-gray-500">
                            {typeof product.brand === "string"
                              ? product.brand
                              : product.brand?.name}
                          </p>
                        )}

                        {product?.description && (
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-400">
                            {product.description}
                          </p>
                        )}

                        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                              Quantity
                            </p>
                            <p className="mt-1 text-sm font-bold text-gray-800">
                              {firstItem.quantity}
                            </p>
                          </div>

                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                              Unit price
                            </p>
                            <p className="mt-1 text-sm font-bold text-gray-800">
                              {formatPrice(firstItem.price)}
                            </p>
                          </div>

                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                              Item total
                            </p>
                            <p className="mt-1 text-sm font-bold text-gray-800">
                              {formatPrice(
                                firstItem.price * firstItem.quantity
                              )}
                            </p>
                          </div>

                          {variant && (
                            <div className="col-span-2 sm:col-span-3">
                              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                Variant
                              </p>
                              <p className="mt-1 text-sm font-semibold text-gray-800">
                                {variant.name ||
                                  variant.size ||
                                  variant.color ||
                                  "—"}
                              </p>
                            </div>
                          )}
                        </div>

                        {order?.items?.length > 1 && (
                          <p className="mt-4 text-xs text-gray-400">
                            +{order.items.length - 1} more item(s) in this order
                          </p>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* TRACKING */}

                <section className="overflow-hidden rounded-2xl border border-orange-100 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 bg-gradient-to-r from-orange-50/80 to-white px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#ff5a1f]">
                        <RefreshCw size={19} />
                      </div>

                      <div>
                        <h2 className="text-sm font-bold text-gray-900">
                          Return progress
                        </h2>
                        <p className="mt-0.5 text-[11px] text-gray-500">
                          Follow the status of your return
                        </p>
                      </div>
                    </div>

                    <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold capitalize ${statusColor}`}>
                      {ret.status?.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="p-5 sm:p-7">
                    {isRejected || isCancelled ? (
                      <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
                        <XCircle size={21} className="mt-0.5 shrink-0" />

                        <div>
                          <p className="text-sm font-bold capitalize">
                            Return {ret.status}
                          </p>

                          {ret.rejectionReason && (
                            <p className="mt-1 text-xs leading-5 text-red-600">
                              {ret.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <ol className="ml-1">
                        {STEPS.map((step, index) => {
                          const done = index <= currentStep;
                          const active = index === currentStep;
                          const date = done ? stepDate(step.key) : null;

                          return (
                            <li
                              key={step.key}
                              className="relative flex gap-4 pb-9 last:pb-0"
                            >
                              {index !== STEPS.length - 1 && (
                                <span
                                  className={`absolute left-[15px] top-9 h-[calc(100%-2.25rem)] w-0.5 ${
                                    index < currentStep
                                      ? "bg-emerald-400"
                                      : "bg-gray-200"
                                  }`}
                                />
                              )}

                              <div
                                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                                  done
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : "border-gray-200 bg-white text-gray-300"
                                } ${active ? "ring-4 ring-emerald-50" : ""}`}
                              >
                                {done ? (
                                  <Check size={16} />
                                ) : (
                                  <span className="h-2 w-2 rounded-full bg-gray-200" />
                                )}
                              </div>

                              <div className="min-w-0 flex-1 pt-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className={`text-sm font-bold ${
                                    done ? "text-gray-900" : "text-gray-400"
                                  }`}>
                                    {step.label}
                                  </p>

                                  {active && (
                                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#ff5a1f]">
                                      Current
                                    </span>
                                  )}
                                </div>

                                <p className={`mt-1 text-xs ${
                                  done ? "text-gray-500" : "text-gray-300"
                                }`}>
                                  {done ? step.note : "Waiting for update"}
                                </p>

                                {date && (
                                  <p className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
                                    <CalendarDays size={12} />
                                    {date}
                                  </p>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    )}
                  </div>
                </section>

                {/* RETURN INFORMATION */}

                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-[#ff5a1f]">
                      <MessageSquareText size={18} />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-gray-900">
                        Return information
                      </h2>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        Details submitted with your request
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
                    <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                        Return reason
                      </p>

                      <p className="mt-2 text-sm font-semibold capitalize text-gray-800">
                        {ret.reason?.replace(/_/g, " ") || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                        Requested on
                      </p>

                      <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
                        <CalendarDays size={14} className="text-gray-400" />
                        {formatDate(ret.createdAt)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 sm:col-span-2">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                        Description
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {ret.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                </section>

              </div>

              {/* RIGHT COLUMN */}

              <div className="space-y-5">

                {/* REFUND SUMMARY */}

                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Wallet size={19} />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-gray-900">
                        Refund summary
                      </h2>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        Your refund information
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Refund amount
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                      {formatPrice(ret.refund?.amount || 0)}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-xs font-medium text-gray-500">
                        Refund status
                      </span>

                      <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold capitalize ${refundStatusColor}`}>
                        {refundStatus}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Refund method
                      </span>
                      <span className="text-xs font-semibold capitalize text-gray-800">
                        {ret.refund?.method || "Wallet"}
                      </span>
                    </div>

                    {ret.refund?.refundedAt && (
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Refunded on
                        </span>
                        <span className="text-xs font-semibold text-gray-800">
                          {formatDate(ret.refund.refundedAt)}
                        </span>
                      </div>
                    )}

                    <div className="mt-5 flex items-start gap-2 rounded-xl bg-emerald-50/70 p-3">
                      <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                      <p className="text-[10px] leading-5 text-emerald-700">
                        Refunds are processed to your wallet according to the return status.
                      </p>
                    </div>
                  </div>
                </section>

                {/* CUSTOMER */}

                <section className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#ff5a1f]">
                      <User size={19} />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-gray-900">
                        Customer
                      </h2>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        Account information
                      </p>
                    </div>
                  </div>

                  {user ? (
                    <div className="mt-5 space-y-3">
                      <p className="text-sm font-bold text-gray-900">
                        {user.name || "—"}
                      </p>

                      {user.email && (
                        <p className="flex items-start gap-2 break-all text-xs leading-5 text-gray-500">
                          <Mail size={14} className="mt-0.5 shrink-0" />
                          {user.email}
                        </p>
                      )}

                      {user.phone && (
                        <p className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone size={14} className="shrink-0" />
                          {user.phone}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-5 text-xs text-gray-400">
                      No customer details available.
                    </p>
                  )}
                </section>

                {/* PICKUP ADDRESS */}

                <section className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#ff5a1f]">
                      <MapPin size={19} />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-gray-900">
                        Pickup address
                      </h2>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        Return pickup location
                      </p>
                    </div>
                  </div>

                  {addressLines.length > 0 ? (
                    <div className="mt-5 space-y-1.5 text-xs leading-5 text-gray-500">
                      {addressLines.map((line, index) => (
                        <p
                          key={index}
                          className={index === 0 ? "font-bold text-gray-900" : ""}
                        >
                          {line as string}
                        </p>
                      ))}

                      {address?.phone && (
                        <p className="flex items-center gap-2 border-t border-gray-100 pt-3">
                          <Phone size={13} />
                          {address.phone}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-5 text-xs text-gray-400">
                      No address details available.
                    </p>
                  )}
                </section>

                {/* ORDER REFERENCE */}

                <section className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#ff5a1f]">
                      <FileText size={19} />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-gray-900">
                        Order reference
                      </h2>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        Related order
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      Order ID
                    </p>

                    <p className="mt-2 break-all font-mono text-sm font-bold text-gray-800">
                      {order?._id
                        ? `#${order._id.slice(-8).toUpperCase()}`
                        : "N/A"}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      Return date
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-gray-700">
                      <CalendarDays size={14} className="text-gray-400" />
                      {formatDate(ret.createdAt)}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      Return reason
                    </p>

                    <p className="mt-2 text-xs font-semibold capitalize text-gray-700">
                      {ret.reason?.replace(/_/g, " ") || "N/A"}
                    </p>
                  </div>
                </section>

              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ReturnDetails;

import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import AdminSidebar from "../../components/Adminsidebar";
import {
  ArrowLeft,
  RefreshCw,
  Package,
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
  Wallet,
  User,
  FileText,
} from "lucide-react";

const RETURN_TRACK_STEPS = [
  {
    key: "requested",
    label: "Return requested",
    note: "The customer submitted a return request.",
  },
  {
    key: "approved",
    label: "Return approved",
    note: "The return request was approved.",
  },
  {
    key: "pickup_scheduled",
    label: "Pickup scheduled",
    note: "Pickup is being arranged for the returned item.",
  },
  {
    key: "picked_up",
    label: "Picked up",
    note: "The returned item has been collected.",
  },
  {
    key: "received",
    label: "Return received",
    note: "The returned item has been received and checked.",
  },
  {
    key: "refunded",
    label: "Refund completed",
    note: "The refund has been credited to the customer's wallet.",
  },
] as const;

const formatPrice = (value: number) =>
  `₹${value?.toLocaleString("en-IN") || 0}`;

const formatDate = (date?: string) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTrackDate = (date?: string) => {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const RetunDetails = () => {
  const { id } = useParams();

  const { returns, loading } = useAppSelector(
    (state) => state.orderData
  );

  // Find the selected return using the route ID
  const returnRequest = returns?.find(
    (item) => item._id === id
  );

  if (loading && !returnRequest) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
        <div className="text-center">
          <RefreshCw
            size={30}
            className="mx-auto animate-spin text-[#ff5a1f]"
          />
          <p className="mt-3 text-sm font-medium text-gray-500">
            Loading return details...
          </p>
        </div>
      </div>
    );
  }

  if (!returnRequest) {
    return (
      <div className="flex min-h-screen bg-[#f8f8f8]">
        <AdminSidebar />

        <main className="flex flex-1 items-center justify-center px-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <Package
              size={35}
              className="mx-auto text-[#ff5a1f]"
            />

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Return not found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              This return request doesn't exist or may have been removed.
            </p>

            <Link
              to="/admin/orders/returns"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff5a1f]"
            >
              <ArrowLeft size={15} />
              Back to returns
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const currentIndex = RETURN_TRACK_STEPS.findIndex(
    (step) => step.key === returnRequest.status
  );

  const isRejected = returnRequest.status === "rejected";
  const isCancelled = returnRequest.status === "cancelled";

  const trackingDates = returnRequest.trackingDates;

  const getStepDate = (key: string) => {
    switch (key) {
      case "requested":
        return trackingDates?.requested || returnRequest.createdAt;

      case "approved":
        return trackingDates?.approved;

      case "picked_up":
        return trackingDates?.pickedUp;

      case "received":
        return trackingDates?.received;

      case "refunded":
        return trackingDates?.refunded;

      default:
        return null;
    }
  };

  const statusColor =
    isRejected || isCancelled
      ? "bg-red-50 text-red-600"
      : returnRequest.status === "refunded"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-orange-50 text-orange-700";

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <AdminSidebar />

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div className="w-full">

          {/* HEADER */}
          <div className="mb-8">
            <Link
              to="/admin/orders/returns"
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 transition hover:text-[#ff5a1f]"
            >
              <ArrowLeft size={14} />
              All returns
            </Link>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Return Details
                  <span className="text-[#ff5a1f]">.</span>
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Return ID: #{returnRequest._id.slice(-8).toUpperCase()}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${statusColor}`}
              >
                {returnRequest.status.replaceAll("_", " ")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">

            {/* LEFT SECTION */}
            <div className="space-y-6">

              {/* RETURN INFORMATION */}
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#ff5a1f]">
                    <RefreshCw size={19} />
                  </span>

                  <div>
                    <h2 className="text-sm font-bold text-gray-900">
                      Return information
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Details submitted by the customer
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">

                  <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Return reason
                    </p>

                    <p className="mt-2 text-sm font-semibold capitalize text-gray-800">
                      {returnRequest.reason?.replaceAll("_", " ")}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Requested on
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <CalendarDays size={15} className="text-gray-400" />
                      {formatDate(returnRequest.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 sm:col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Description
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                      {returnRequest.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </section>

              {/* RETURN TRACKER */}
              <section className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">

                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#ff5a1f]">
                      <Package size={19} />
                    </span>

                    <div>
                      <h2 className="text-sm font-bold text-gray-900">
                        Return tracking
                      </h2>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Track the return and refund progress
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-[11px] font-bold capitalize ${statusColor}`}
                  >
                    {returnRequest.status.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <ol className="ml-1">
                    {RETURN_TRACK_STEPS.map((step, index) => {
                      const date = getStepDate(step.key);

                      const done =
                        index <= currentIndex || Boolean(date);

                      const lineDone = index < currentIndex;

                      return (
                        <li
                          key={step.key}
                          className="relative flex gap-4 pb-7 last:pb-0"
                        >
                          {index !== RETURN_TRACK_STEPS.length - 1 && (
                            <span
                              className={`absolute left-[7px] top-4 h-full w-0.5 ${
                                lineDone
                                  ? "bg-emerald-400"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}

                          <span
                            className={`relative z-10 mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                              done
                                ? "border-emerald-500 bg-emerald-500"
                                : "border-gray-300 bg-white"
                            }`}
                          />

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p
                                className={`text-sm font-semibold ${
                                  done
                                    ? "text-gray-900"
                                    : "text-gray-400"
                                }`}
                              >
                                {step.label}
                              </p>

                              {date && (
                                <span className="text-[11px] text-gray-400">
                                  {formatTrackDate(date)}
                                </span>
                              )}
                            </div>

                            <p
                              className={`mt-1 text-xs ${
                                done
                                  ? "text-gray-500"
                                  : "text-gray-300"
                              }`}
                            >
                              {done ? step.note : "Waiting"}
                            </p>
                          </div>
                        </li>
                      );
                    })}

                    {/* REJECTED / CANCELLED */}
                    {(isRejected || isCancelled) && (
                      <li className="flex gap-4">
                        <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-red-500 bg-red-500" />

                        <div>
                          <p className="text-sm font-semibold text-red-600">
                            Return {returnRequest.status}
                          </p>

                          {returnRequest.rejectionReason && (
                            <p className="mt-1 text-xs leading-5 text-gray-500">
                              {returnRequest.rejectionReason}
                            </p>
                          )}
                        </div>
                      </li>
                    )}
                  </ol>
                </div>
              </section>
            </div>

            {/* RIGHT SECTION */}
            <div className="space-y-6">

              {/* REFUND SUMMARY */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Wallet size={19} />
                  </span>

                  <div>
                    <h2 className="text-sm font-bold text-gray-900">
                      Refund summary
                    </h2>
                    <p className="text-xs text-gray-400">
                      Refund information
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-b border-gray-100 pb-4">
                  <p className="text-xs text-gray-400">
                    Refund amount
                  </p>

                  <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                    {formatPrice(returnRequest.refund?.amount || 0)}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-gray-500">
                    Refund status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1.5 text-[11px] font-bold capitalize ${
                      returnRequest.refund?.status === "completed"
                        ? "bg-emerald-50 text-emerald-700"
                        : returnRequest.refund?.status === "failed"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {returnRequest.refund?.status || "Pending"}
                  </span>
                </div>
              </section>

              {/* CUSTOMER */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#ff5a1f]">
                    <User size={19} />
                  </span>

                  <div>
                    <h2 className="text-sm font-bold text-gray-900">
                      Customer
                    </h2>
                    <p className="text-xs text-gray-400">
                      Customer information
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-semibold text-gray-900">
                    {typeof returnRequest.user === "object"
                      ? returnRequest.user?.name || "Customer"
                      : "Customer"}
                  </p>

                  {typeof returnRequest.user === "object" &&
                    returnRequest.user?.email && (
                      <p className="mt-1 break-all text-xs text-gray-500">
                        {returnRequest.user.email}
                      </p>
                    )}
                </div>
              </section>

              {/* ORDER REFERENCE */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#ff5a1f]">
                    <FileText size={19} />
                  </span>

                  <div>
                    <h2 className="text-sm font-bold text-gray-900">
                      Order reference
                    </h2>
                    <p className="text-xs text-gray-400">
                      Related order
                    </p>
                  </div>
                </div>

                <p className="mt-5 break-all font-mono text-sm font-semibold text-gray-800">
                  #
                  {typeof returnRequest.order === "object"
                    ? returnRequest.order?._id?.slice(-8).toUpperCase()
                    : returnRequest.order?.slice(-8).toUpperCase() || "N/A"}
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RetunDetails;
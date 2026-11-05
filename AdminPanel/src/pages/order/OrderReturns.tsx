
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getAllReturns, updateReturnStatus } from "../../redux/features/orderSlice";
import AdminSidebar from "../../components/Adminsidebar";
import {
  Search,
  ChevronDown,
  RotateCcw,
  Clock,
  CheckCircle2,
  Wallet,
  Package,
  CalendarDays,
  User,
} from "lucide-react";
import { toast } from "react-toastify";

const RETURN_STATUSES = [
  "requested",
  "approved",
  "pickup_scheduled",
  "picked_up",
  "received",
  "refunded",
  "rejected",
  "cancelled",
];

const statusLabel: Record<string, string> = {
  requested: "Requested",
  approved: "Approved",
  pickup_scheduled: "Pickup Scheduled",
  picked_up: "Picked Up",
  received: "Received",
  refunded: "Refunded",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const statusColor: Record<string, string> = {
  requested: "bg-amber-50 text-amber-600",
  approved: "bg-blue-50 text-blue-600",
  pickup_scheduled: "bg-indigo-50 text-indigo-600",
  picked_up: "bg-purple-50 text-purple-600",
  received: "bg-teal-50 text-teal-600",
  refunded: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-600",
  cancelled: "bg-gray-100 text-gray-600",
};

const OrderReturns = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { returns = [] } = useAppSelector(
    (state) => state.orderData
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [returnUpdatingId, setReturnUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReturns = async () => {
      setLoading(true);

      try {
        await dispatch(getAllReturns()).unwrap();
      } catch (error) {
        toast.error(
          typeof error === "string"
            ? error
            : "Failed to fetch return requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, [dispatch]);


  const handleReturnStatusChange = async (
    returnId: string,
    newStatus: string
  ) => {
    if (!returnId || !newStatus) {
      toast.error("Invalid return request");
      return;
    }

    let rejectionReason: string | undefined;

    if (newStatus === "rejected") {
      const reason = window.prompt("Enter the rejection reason:");
      if (reason === null) return;
      if (!reason.trim()) {
        toast.error("Rejection reason is required");
        return;
      }
      rejectionReason = reason.trim();
    }

    setReturnUpdatingId(returnId);

    try {
      await dispatch(
        updateReturnStatus({
          returnId,
          status: newStatus,
          rejectionReason,
        })
      ).unwrap();

      toast.success(`Return status updated to ${newStatus.replaceAll("_", " ")}`);
      await dispatch(getAllReturns()).unwrap();
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to update return status"
      );
    } finally {
      setReturnUpdatingId(null);
    }
  };

  const formatDate = (date: string) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  const formatStatus = (value: string) =>
    statusLabel[value] ||
    value?.replaceAll("_", " ") ||
    "Unknown";

  const filteredReturns = useMemo(() => {
    return returns.filter((item: any) => {
      const orderId =
        typeof item.order === "object"
          ? item.order?._id
          : item.order;

      const customer =
        typeof item.user === "object"
          ? item.user?.name
          : "";

      const searchValue = search.toLowerCase();

      const matchesSearch =
        orderId?.toLowerCase().includes(searchValue) ||
        customer?.toLowerCase().includes(searchValue) ||
        item._id?.toLowerCase().includes(searchValue);

      const matchesStatus =
        !status || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [returns, search, status]);

  const totalReturns = returns.length;

  const pendingReturns = returns.filter(
    (item: any) => item.status === "requested"
  ).length;

  const approvedReturns = returns.filter(
    (item: any) =>
      item.status === "approved" ||
      item.status === "pickup_scheduled" ||
      item.status === "picked_up"
  ).length;

  const completedReturns = returns.filter(
    (item: any) =>
      item.status === "received" ||
      item.status === "refunded"
  ).length;

  const statCards = [
    {
      label: "Total Returns",
      value: totalReturns,
      description: "All requests",
      icon: Package,
      iconStyle: "bg-gray-100 text-gray-700",
    },
    {
      label: "Pending Requests",
      value: pendingReturns,
      description: "Needs attention",
      icon: Clock,
      iconStyle: "bg-amber-50 text-amber-600",
    },
    {
      label: "In Progress",
      value: approvedReturns,
      description: "Accepted requests",
      icon: CheckCircle2,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      label: "Completed Returns",
      value: completedReturns,
      description: "Processed returns",
      icon: Wallet,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
  ];

  const selectBase =
    "h-12 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 text-sm font-semibold text-gray-900 outline-none transition focus:border-[#ff5a1f]";

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:px-10">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-black">
            Order Returns
          </h1>

          <p className="mt-1.5 text-sm text-[#8a7568]">
            View, track and manage customer return requests and refunds.
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-2xl border border-gray-200 bg-white px-5 py-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className={`rounded-xl p-2.5 ${card.iconStyle}`}>
                    <Icon size={19} />
                  </div>

                  <span className="text-xs text-[#8a7568]">
                    {card.description}
                  </span>
                </div>

                <p className="mt-3 text-3xl font-extrabold tracking-tight text-black">
                  {card.value.toLocaleString("en-IN")}
                </p>

                <p className="mt-1 text-sm text-[#8a7568]">
                  {card.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* FILTER BAR */}
        <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[2fr_1fr]">

          {/* SEARCH */}
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search return ID, order ID or customer..."
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#ff5a1f]"
            />
          </div>

          {/* STATUS FILTER */}
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={selectBase}
            >
              <option value="">All Return Status</option>

              {RETURN_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {statusLabel[item]}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-black">
                All Return Requests
              </h2>

              <p className="mt-1 text-xs text-[#8a7568]">
                Review and manage customer returns.
              </p>
            </div>

            <p className="text-xs text-[#8a7568]">
              {filteredReturns.length.toLocaleString("en-IN")} requests
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-orange-100 border-t-[#ff5a1f]" />

              <p className="text-sm text-gray-400">
                Loading return requests...
              </p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && filteredReturns.length === 0 && (
            <div className="py-20 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                <RotateCcw size={22} className="text-[#ff5a1f]" />
              </div>

              <p className="mt-4 text-sm font-semibold text-gray-800">
                No return requests found
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Try changing your search or status filter.
              </p>
            </div>
          )}

          {/* RETURNS TABLE */}
          {!loading && filteredReturns.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">

                <thead>
                  <tr className="bg-[#f6f4f2] text-xs font-bold uppercase tracking-wider text-[#8a7568]">
                    <th className="rounded-l-lg px-5 py-3.5">
                      Return / Order
                    </th>

                    <th className="px-3 py-3.5">
                      Customer
                    </th>

                    <th className="px-3 py-3.5">
                      Reason
                    </th>

                    <th className="px-3 py-3.5">
                      Refund Amount
                    </th>

                    <th className="px-3 py-3.5">
                      Date
                    </th>

                    <th className="px-3 py-3.5">Status</th>
                    <th className="rounded-r-lg px-3 py-3.5">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReturns.map((item: any) => {
                    const order =
                      typeof item.order === "object"
                        ? item.order
                        : null;

                    const user =
                      typeof item.user === "object"
                        ? item.user
                        : null;

                    const returnTransitions: Record<string, string[]> = {
                      requested: ["approved", "rejected"],
                      approved: ["pickup_scheduled", "picked_up"],
                      pickup_scheduled: ["picked_up"],
                      picked_up: ["received"],
                      received: [],
                      refunded: [],
                      rejected: [],
                      cancelled: [],
                    };
                    const nextReturnStatuses =
                      returnTransitions[item.status] || [];

                    return (
                      <tr
                        key={item._id}
                        onClick={() => navigate(`/admin/orders/returns/${item._id}`)}
                        className="cursor-pointer border-b border-gray-100 text-sm text-gray-800 last:border-0 transition hover:bg-orange-50/50"
                      >

                        {/* RETURN / ORDER */}
                        <td className="px-5 py-5">
                          <p className="text-sm font-extrabold text-black">
                            #{order?._id?.slice(-8).toUpperCase() || "N/A"}
                          </p>

                          <p className="mt-1 text-xs text-[#8a7568]">
                            Return ID: {item._id?.slice(-8) || "N/A"}
                          </p>
                        </td>

                        {/* CUSTOMER */}
                        <td className="px-3 py-5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                              <User size={15} className="text-gray-500" />
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {user?.name || "Customer"}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-400">
                                {user?.email || ""}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* REASON */}
                        <td className="px-3 py-5">
                          <p className="max-w-[160px] truncate text-sm font-medium text-gray-700">
                            {item.reason ||
                              item.reasonForreturning ||
                              "N/A"}
                          </p>

                          {item.description && (
                            <p className="mt-1 max-w-[160px] truncate text-xs text-gray-400">
                              {item.description}
                            </p>
                          )}
                        </td>

                        {/* REFUND */}
                        <td className="px-3 py-5">
                          <p className="text-sm font-extrabold text-black">
                            ₹
                            {(item.refund?.amount || 0).toLocaleString("en-IN")}
                          </p>

                          <p className="mt-1 text-xs text-[#8a7568]">
                            Wallet refund
                          </p>
                        </td>

                        {/* DATE */}
                        <td className="px-3 py-5">
                          <div className="flex items-center gap-2 text-sm text-[#8a7568]">
                            <CalendarDays
                              size={14}
                              className="text-gray-400"
                            />

                            {formatDate(item.createdAt)}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-3 py-5">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                              statusColor[item.status] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {formatStatus(item.status)}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-3 py-5">
                          <div className="relative w-44">
                            <select
                              onClick={(e) => e.stopPropagation()}
                              value={item.status}
                              disabled={
                                nextReturnStatuses.length === 0 ||
                                returnUpdatingId === item._id
                              }
                              onChange={(e) =>
                                handleReturnStatusChange(item._id, e.target.value)
                              }
                              className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-9 text-sm font-semibold text-gray-700 outline-none transition hover:border-[#ff5a1f] focus:border-[#ff5a1f] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                            >
                              <option value={item.status}>
                                {returnUpdatingId === item._id
                                  ? "Updating..."
                                  : nextReturnStatuses.length === 0
                                    ? "No further actions"
                                    : "Update return status"}
                              </option>
                              {nextReturnStatuses.map((nextStatus) => (
                                <option key={nextStatus} value={nextStatus}>
                                  {statusLabel[nextStatus]}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={13}
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* FOOTER */}
          {!loading && filteredReturns.length > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="text-[11px] text-[#8a7568]">
                Showing {filteredReturns.length} of {totalReturns} return requests
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderReturns;

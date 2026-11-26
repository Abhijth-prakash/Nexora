import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { getOrders } from "../../redux/features/orderSlice";
import AdminSidebar from "../../components/Adminsidebar";
import type { Baseorder } from "../../utils/BaseType";
import { Download, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";

type OrderStatus = Baseorder["orderStatus"];

/* ------------------------------ helpers ------------------------------ */

const DAY = 24 * 60 * 60 * 1000;

const RANGES = [
  { key: "7", label: "7 days", days: 7 },
  { key: "30", label: "30 days", days: 30 },
  { key: "90", label: "90 days", days: 90 },
  { key: "365", label: "12 months", days: 365 },
  { key: "all", label: "All time", days: 0 },
] as const;

const NON_REVENUE: OrderStatus[] = ["cancelled", "payment_pending"];

const orderDateOf = (o: Baseorder) => new Date(o.orderDate || o.createdAt);

const isRevenue = (o: Baseorder) =>
  !NON_REVENUE.includes(o.orderStatus) && o.paymentStatus !== "failed";

const refundOf = (o: Baseorder) => o.refundedAmount ?? 0;
const grossOf = (o: Baseorder) => o.totalAmount ?? 0;
const netOf = (o: Baseorder) => Math.max(grossOf(o) - refundOf(o), 0);

const inr = (n: number) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;

// compact for chart axis / tooltips: ₹1.2L, ₹45K
const inrShort = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${Math.round(n)}`;
};

const pad = (n: number) => String(n).padStart(2, "0");
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const monthKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const weekStart = (d: Date) => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (x.getDay() + 6) % 7; // Monday start
  x.setDate(x.getDate() - diff);
  return x;
};

const shortDate = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
const monthLabel = (d: Date) =>
  d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });

type Bucket = {
  key: string;
  label: string;
  revenue: number;
  orders: number;
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ------------------------------ component ------------------------------ */

const Sales = () => {
  const dispatch = useAppDispatch();

  const [orders, setOrders] = useState<Baseorder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rangeKey, setRangeKey] = useState<(typeof RANGES)[number]["key"]>("30");

  // getOrders is paginated, so walk every page and collect the orders
  const loadAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all: Baseorder[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const payload: any = await dispatch(
          getOrders({ page: currentPage, search: "", status: "", payment: "" })
        ).unwrap();

        const pageOrders = payload?.orders ?? payload?.data?.orders ?? [];
        totalPages = payload?.pages ?? payload?.totalPages ?? 1;
        all.push(...pageOrders);
        currentPage++;
      } while (currentPage <= totalPages);

      setOrders(all);
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to load sales data");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadAllOrders();
  }, [loadAllOrders]);

  const range = RANGES.find((r) => r.key === rangeKey)!;

  /* ---- current + previous period ---- */
  const { current, previous } = useMemo(() => {
    if (range.days === 0) return { current: orders, previous: null };

    const end = Date.now();
    const start = end - range.days * DAY;
    const prevStart = start - range.days * DAY;

    const inWindow = (o: Baseorder, a: number, b: number) => {
      const t = orderDateOf(o).getTime();
      return t >= a && t < b;
    };

    return {
      current: orders.filter((o) => inWindow(o, start, end + 1)),
      previous: orders.filter((o) => inWindow(o, prevStart, start)),
    };
  }, [orders, range]);

  /* ---- KPI calculation (reused for both periods) ---- */
  const kpis = (list: Baseorder[]) => {
    const rev = list.filter(isRevenue);
    const gross = rev.reduce((s, o) => s + grossOf(o), 0);
    const refunds = rev.reduce((s, o) => s + refundOf(o), 0);
    const net = gross - refunds;
    const units = rev.reduce((s, o) => s + (o.items?.length ?? 0), 0);
    return {
      gross,
      refunds,
      net,
      orders: rev.length,
      units,
      aov: rev.length ? net / rev.length : 0,
    };
  };

  const cur = useMemo(() => kpis(current), [current]);
  const prev = useMemo(() => (previous ? kpis(previous) : null), [previous]);

  /* ---- health rates ---- */
  const rates = useMemo(() => {
    const total = current.length || 1;
    const count = (fn: (o: Baseorder) => boolean) => current.filter(fn).length;
    const delivered = count((o) => o.orderStatus === "delivered");
    const cancelled = count((o) => o.orderStatus === "cancelled");
    const returned = count(
      (o) => o.orderStatus === "return_requested" || o.orderStatus === "returned"
    );
    const pendingPay = count((o) => o.orderStatus === "payment_pending");
    return {
      total: current.length,
      delivered,
      cancelled,
      returned,
      pendingPay,
      deliveredPct: (delivered / total) * 100,
      cancelledPct: (cancelled / total) * 100,
      returnedPct: (returned / total) * 100,
    };
  }, [current]);

  /* ---- revenue trend ---- */
  const trend = useMemo(() => {
    const rev = current.filter(isRevenue);
    if (rev.length === 0) return { buckets: [] as Bucket[], unit: "day" };

    const spanDays =
      range.days ||
      Math.max(
        1,
        Math.ceil(
          (Date.now() -
            Math.min(...rev.map((o) => orderDateOf(o).getTime()))) / DAY
        )
      );
    const unit = spanDays <= 31 ? "day" : spanDays <= 120 ? "week" : "month";

    const map = new Map<string, Bucket>();

    // pre-fill empty buckets so the chart has no gaps
    const startMs = range.days
      ? Date.now() - range.days * DAY
      : Math.min(...rev.map((o) => orderDateOf(o).getTime()));
    const cursor = new Date(startMs);
    const endDate = new Date();

    const keyOf = (d: Date) =>
      unit === "day"
        ? dayKey(d)
        : unit === "week"
        ? dayKey(weekStart(d))
        : monthKey(d);
    const labelOf = (d: Date) =>
      unit === "day"
        ? shortDate(d)
        : unit === "week"
        ? shortDate(weekStart(d))
        : monthLabel(d);

    while (cursor <= endDate) {
      const k = keyOf(cursor);
      if (!map.has(k))
        map.set(k, { key: k, label: labelOf(cursor), revenue: 0, orders: 0 });
      cursor.setDate(cursor.getDate() + (unit === "month" ? 20 : 1));
    }
    // make sure the current month/day itself exists
    const nowKey = keyOf(endDate);
    if (!map.has(nowKey))
      map.set(nowKey, {
        key: nowKey,
        label: labelOf(endDate),
        revenue: 0,
        orders: 0,
      });

    rev.forEach((o) => {
      const d = orderDateOf(o);
      const k = keyOf(d);
      const b = map.get(k) ?? {
        key: k,
        label: labelOf(d),
        revenue: 0,
        orders: 0,
      };
      b.revenue += netOf(o);
      b.orders += 1;
      map.set(k, b);
    });

    return {
      buckets: Array.from(map.values()).sort((a, b) =>
        a.key.localeCompare(b.key)
      ),
      unit,
    };
  }, [current, range]);

  const maxBucket = Math.max(...trend.buckets.map((b) => b.revenue), 1);
  const bestBucket = trend.buckets.reduce<Bucket | null>(
    (best, b) => (!best || b.revenue > best.revenue ? b : best),
    null
  );

  /* ---- payment mix ---- */
  const paymentMix = useMemo(() => {
    const map = new Map<string, { revenue: number; orders: number }>();
    current.filter(isRevenue).forEach((o) => {
      const key = o.paymentMethod === "cod" ? "Cash on delivery" : "Online";
      const e = map.get(key) ?? { revenue: 0, orders: 0 };
      e.revenue += netOf(o);
      e.orders += 1;
      map.set(key, e);
    });
    return Array.from(map, ([name, v]) => ({ name, ...v })).sort(
      (a, b) => b.revenue - a.revenue
    );
  }, [current]);

  /* ---- best weekdays ---- */
  const weekdays = useMemo(() => {
    const arr = WEEKDAYS.map((d) => ({ d, revenue: 0, orders: 0 }));
    current.filter(isRevenue).forEach((o) => {
      const idx = (orderDateOf(o).getDay() + 6) % 7;
      arr[idx].revenue += netOf(o);
      arr[idx].orders += 1;
    });
    return arr;
  }, [current]);
  const maxWeekday = Math.max(...weekdays.map((w) => w.revenue), 1);

  /* ---- top customers ---- */
  const topCustomers = useMemo(() => {
    const map = new Map<
      string,
      { name: string; email?: string; revenue: number; orders: number }
    >();
    current.filter(isRevenue).forEach((o) => {
      const u = typeof o.user === "string" ? null : o.user;
      const id = u?.email || (typeof o.user === "string" ? o.user : "unknown");
      const e = map.get(id) ?? {
        name: u?.name || "Customer",
        email: u?.email,
        revenue: 0,
        orders: 0,
      };
      e.revenue += netOf(o);
      e.orders += 1;
      map.set(id, e);
    });
    return Array.from(map.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [current]);

  const repeatCustomers = useMemo(() => {
    const counts = new Map<string, number>();
    current.filter(isRevenue).forEach((o) => {
      const u = typeof o.user === "string" ? o.user : o.user?.email;
      if (u) counts.set(u, (counts.get(u) ?? 0) + 1);
    });
    const total = counts.size;
    const repeat = Array.from(counts.values()).filter((c) => c > 1).length;
    return { total, repeat, pct: total ? (repeat / total) * 100 : 0 };
  }, [current]);

  /* ---- export ---- */
  const exportCSV = () => {
    const header = ["Period", "Net revenue", "Orders"];
    const rows = trend.buckets.map((b) => [b.label, Math.round(b.revenue), b.orders]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${range.key}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---- small UI pieces ---- */
  const Delta = ({ now, before }: { now: number; before?: number }) => {
    if (before === undefined || before === 0) return null;
    const pct = ((now - before) / before) * 100;
    const up = pct >= 0;
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
          up ? "text-emerald-600" : "text-red-500"
        }`}
      >
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {Math.abs(pct).toFixed(1)}% vs previous
      </span>
    );
  };

  const kpiCards = [
    {
      label: "Net Revenue",
      value: inr(cur.net),
      now: cur.net,
      before: prev?.net,
      highlight: true,
    },
    {
      label: "Orders",
      value: cur.orders.toLocaleString("en-IN"),
      now: cur.orders,
      before: prev?.orders,
    },
    {
      label: "Avg. Order Value",
      value: inr(cur.aov),
      now: cur.aov,
      before: prev?.aov,
    },
    {
      label: "Items Sold",
      value: cur.units.toLocaleString("en-IN"),
      now: cur.units,
      before: prev?.units,
    },
  ];

  const empty = !loading && !error && cur.orders === 0;

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
        {/* HEADER */}
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-black">
              Sales Report
            </h1>
            <p className="mt-1.5 text-sm text-[#8a7568]">
              Revenue, growth and customer insights for your store.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-gray-200 bg-white p-1">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRangeKey(r.key)}
                  className={`h-8 rounded-lg px-3 text-xs font-semibold transition ${
                    rangeKey === r.key
                      ? "bg-[#ff5a1f] text-white"
                      : "text-gray-600 hover:text-[#ff5a1f]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <button
              onClick={loadAllOrders}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 transition hover:border-[#ff5a1f] hover:text-[#ff5a1f] disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              onClick={exportCSV}
              disabled={loading || trend.buckets.length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gray-900 px-4 text-xs font-semibold text-white transition hover:bg-[#ff5a1f] disabled:opacity-40"
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-32">
            <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-orange-100 border-t-[#ff5a1f]" />
            <p className="text-sm text-gray-400">Crunching your sales...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-gray-200 py-16 text-center">
            <p className="text-sm font-semibold text-gray-800">
              Couldn't load sales data
            </p>
            <p className="mt-1 text-xs text-gray-400">{error}</p>
            <button
              onClick={loadAllOrders}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff5a1f]"
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        )}

        {empty && (
          <div className="rounded-2xl border border-gray-200 py-20 text-center text-sm text-gray-400">
            No sales in this period. Try a longer range.
          </div>
        )}

        {!loading && !error && !empty && (
          <>
            {/* KPI CARDS */}
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {kpiCards.map((c) => (
                <div
                  key={c.label}
                  className={`rounded-2xl border px-5 py-4 ${
                    c.highlight
                      ? "border-orange-100 bg-[#fff8f5]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <p className="text-xs text-[#8a7568]">{c.label}</p>
                  <p className="mt-1 text-3xl font-extrabold tracking-tight text-black">
                    {c.value}
                  </p>
                  <div className="mt-1 min-h-[16px]">
                    <Delta now={c.now} before={c.before} />
                  </div>
                </div>
              ))}
            </div>

            {/* REVENUE TREND */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-black">
                    Revenue trend
                  </h2>
                  <p className="text-xs text-[#8a7568]">
                    Net revenue per {trend.unit}
                  </p>
                </div>

                <div className="flex gap-6 text-right">
                  <div>
                    <p className="text-[11px] text-[#8a7568]">Gross sales</p>
                    <p className="text-sm font-extrabold text-black">
                      {inr(cur.gross)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#8a7568]">Refunds</p>
                    <p className="text-sm font-extrabold text-blue-600">
                      −{inr(cur.refunds)}
                    </p>
                  </div>
                  {bestBucket && bestBucket.revenue > 0 && (
                    <div>
                      <p className="text-[11px] text-[#8a7568]">Best {trend.unit}</p>
                      <p className="text-sm font-extrabold text-emerald-600">
                        {bestBucket.label} · {inrShort(bestBucket.revenue)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <div
                  className="flex h-56 items-end gap-1.5"
                  style={{ minWidth: Math.max(trend.buckets.length * 22, 320) }}
                >
                  {trend.buckets.map((b, i) => {
                    const h = (b.revenue / maxBucket) * 100;
                    const showLabel =
                      trend.buckets.length <= 12 ||
                      i % Math.ceil(trend.buckets.length / 10) === 0;
                    return (
                      <div
                        key={b.key}
                        className="group relative flex h-full flex-1 flex-col justify-end"
                      >
                        <div className="pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-[11px] text-white shadow group-hover:block">
                          <p className="font-bold">{b.label}</p>
                          <p>
                            {inr(b.revenue)} · {b.orders} orders
                          </p>
                        </div>
                        <div
                          className="w-full rounded-t-md bg-[#ff5a1f]/80 transition group-hover:bg-[#ff5a1f]"
                          style={{
                            height: `${b.revenue > 0 ? Math.max(h, 2) : 0}%`,
                          }}
                        />
                        <p className="mt-2 h-4 truncate text-center text-[10px] text-[#8a7568]">
                          {showLabel ? b.label : ""}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* HEALTH + PAYMENT */}
            <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="mb-4 text-sm font-extrabold text-black">
                  Order health
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      label: "Delivered",
                      pct: rates.deliveredPct,
                      count: rates.delivered,
                      bar: "bg-emerald-500",
                    },
                    {
                      label: "Cancelled",
                      pct: rates.cancelledPct,
                      count: rates.cancelled,
                      bar: "bg-red-500",
                    },
                    {
                      label: "Returns",
                      pct: rates.returnedPct,
                      count: rates.returned,
                      bar: "bg-amber-500",
                    },
                  ].map((r) => (
                    <div key={r.label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-medium text-gray-700">
                          {r.label}
                        </span>
                        <span className="font-bold text-black">
                          {r.pct.toFixed(1)}%{" "}
                          <span className="font-normal text-[#8a7568]">
                            ({r.count})
                          </span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div
                          className={`h-2 rounded-full ${r.bar}`}
                          style={{ width: `${Math.min(r.pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {rates.pendingPay > 0 && (
                  <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-[11px] text-[#8a7568]">
                    {rates.pendingPay} order{rates.pendingPay > 1 ? "s" : ""}{" "}
                    awaiting payment are not counted in revenue.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="mb-4 text-sm font-extrabold text-black">
                  Payment mix
                </h2>

                <div className="space-y-4">
                  {paymentMix.map((p) => {
                    const pct = cur.net ? (p.revenue / cur.net) * 100 : 0;
                    return (
                      <div key={p.name}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="font-medium text-gray-700">
                            {p.name}
                          </span>
                          <span className="font-bold text-black">
                            {inr(p.revenue)}{" "}
                            <span className="font-normal text-[#8a7568]">
                              ({pct.toFixed(0)}% · {p.orders} orders)
                            </span>
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-gray-900"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#f6f4f2] px-4 py-3">
                    <p className="text-[11px] text-[#8a7568]">Unique customers</p>
                    <p className="text-lg font-extrabold text-black">
                      {repeatCustomers.total}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#f6f4f2] px-4 py-3">
                    <p className="text-[11px] text-[#8a7568]">Repeat buyers</p>
                    <p className="text-lg font-extrabold text-black">
                      {repeatCustomers.pct.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* WEEKDAYS + TOP CUSTOMERS */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="mb-1 text-sm font-extrabold text-black">
                  Sales by day of week
                </h2>
                <p className="mb-4 text-xs text-[#8a7568]">
                  See which days bring in the most revenue.
                </p>

                <div className="flex h-40 items-end gap-2">
                  {weekdays.map((w) => (
                    <div
                      key={w.d}
                      className="group relative flex h-full flex-1 flex-col justify-end"
                    >
                      <div className="pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-[11px] text-white shadow group-hover:block">
                        {inr(w.revenue)} · {w.orders} orders
                      </div>
                      <div
                        className={`w-full rounded-t-md transition ${
                          w.revenue === maxWeekday
                            ? "bg-[#ff5a1f]"
                            : "bg-gray-300 group-hover:bg-[#ff5a1f]/70"
                        }`}
                        style={{
                          height: `${w.revenue > 0 ? Math.max((w.revenue / maxWeekday) * 100, 3) : 0}%`,
                        }}
                      />
                      <p className="mt-2 text-center text-[10px] font-medium text-[#8a7568]">
                        {w.d}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="mb-4 text-sm font-extrabold text-black">
                  Top customers
                </h2>

                {topCustomers.length === 0 ? (
                  <p className="text-xs text-gray-400">No customers yet.</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {topCustomers.map((c, i) => (
                      <li
                        key={(c.email || c.name) + i}
                        className="flex items-center gap-3 py-3"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1eb] text-xs font-bold text-[#ff5a1f]">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-black">
                            {c.name}
                          </p>
                          {c.email && (
                            <p className="truncate text-[11px] text-[#8a7568]">
                              {c.email}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-extrabold text-black">
                            {inr(c.revenue)}
                          </p>
                          <p className="text-[11px] text-[#8a7568]">
                            {c.orders} order{c.orders > 1 ? "s" : ""}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Sales;
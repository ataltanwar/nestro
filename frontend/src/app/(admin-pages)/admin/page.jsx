"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import {
  FiAlertTriangle,
  FiHome,
  FiMail,
  FiPackage,
  FiRefreshCw,
  FiTag,
} from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    axios.get(`${API_BASE}/dashboard`)
      .then((response) => {
        if (!active) return;
        setDashboard(response.data);
        setError("");
      })
      .catch((requestError) => {
        if (!active) return;
        const message = requestError?.response?.data?.message || "Failed to load dashboard data";
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [refreshKey]);

  const refresh = () => {
    setLoading(true);
    setRefreshKey((key) => key + 1);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const stats = dashboard?.stats || {};
  const recentProducts = dashboard?.recentProducts || [];
  const recentSubscribers = dashboard?.recentSubscribers || [];

  const cards = [
    {
      label: "Total Products",
      value: stats.totalProducts ?? 0,
      meta: `${stats.activeProducts ?? 0} active · ${stats.outOfStock ?? 0} out of stock`,
      icon: FiPackage,
      iconClass: "bg-[#e8f8f3] text-[#0d9f83]",
    },
    {
      label: "Categories",
      value: stats.totalCategories ?? 0,
      meta: `${stats.activeCategories ?? 0} active in catalogue`,
      icon: FiTag,
      iconClass: "bg-[#eef2ff] text-[#4f6bed]",
    },
    {
      label: "Rooms",
      value: stats.totalRooms ?? 0,
      meta: `${stats.activeRooms ?? 0} visible on storefront`,
      icon: FiHome,
      iconClass: "bg-[#fdf4e8] text-[#c07a2c]",
    },
    {
      label: "Subscribers",
      value: stats.totalSubscribers ?? 0,
      meta: "Newsletter audience",
      icon: FiMail,
      iconClass: "bg-[#f4eefe] text-[#8a5cf6]",
    },
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-bold text-[#17212b]">Dashboard</h1>
          <p className="mt-1 text-[14px] text-slate-500">
            A live overview of your catalogue and storefront
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          className="flex items-center gap-2 rounded-[9px] border border-[#e5e2dc] bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition hover:bg-[#f8f7f4] hover:text-[#17212b]"
        >
          <FiRefreshCw size={15} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-4 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
          <div className="flex items-center gap-2">
            <FiAlertTriangle size={16} />
            {error}
          </div>
          <button type="button" onClick={refresh} className="underline underline-offset-4">
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className="rounded-[14px] border border-[#e8e5df] bg-white p-5 shadow-[0_1px_2px_rgba(23,33,43,0.03)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-medium text-slate-500">{card.label}</p>
                  <p className="mt-3 text-[30px] font-bold leading-none text-[#17212b]">
                    {Number(card.value).toLocaleString("en-IN")}
                  </p>
                </div>

                <span className={`flex h-[42px] w-[42px] items-center justify-center rounded-[11px] ${card.iconClass}`}>
                  <Icon size={20} />
                </span>
              </div>

              <p className="mt-4 text-[11px] leading-5 text-slate-400">{card.meta}</p>
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-[1.55fr_1fr] gap-4 max-xl:grid-cols-1">
        <section className="overflow-hidden rounded-[14px] border border-[#e8e5df] bg-white">
          <div className="flex items-center justify-between border-b border-[#eeeae3] px-5 py-4">
            <div>
              <h2 className="text-[16px] font-semibold text-[#17212b]">Recent Products</h2>
              <p className="mt-0.5 text-[12px] text-slate-500">Newest additions to your catalogue</p>
            </div>

            <Link
              href="/admin/products"
              className="text-[12px] font-semibold text-[#0d9f83] transition hover:underline"
            >
              View all
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="px-5 py-14 text-center text-[13px] text-slate-500">
              No products yet. Add your first product to see it here.
            </div>
          ) : (
            <div className="divide-y divide-[#f1eee9]">
              {recentProducts.map((product) => (
                <div key={product._id} className="flex items-center gap-4 px-5 py-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-[48px] w-[48px] shrink-0 rounded-[9px] object-cover"
                    />
                  ) : (
                    <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[9px] bg-[#f1f3f4] text-slate-400">
                      <FiPackage size={19} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-[#17212b]">
                      {product.name}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {product.category?.name || "Uncategorised"} · {formatDate(product.createdAt)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[13px] font-semibold text-[#17212b]">
                      {money.format(Number(product.salePrice ?? product.price ?? 0))}
                    </p>
                    <p className={`mt-1 text-[10px] font-semibold ${Number(product.stock) > 0 ? "text-[#0d9f83]" : "text-red-500"}`}>
                      {Number(product.stock) > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-4">
          <section className="rounded-[14px] border border-[#e8e5df] bg-white">
            <div className="border-b border-[#eeeae3] px-5 py-4">
              <h2 className="text-[16px] font-semibold text-[#17212b]">Catalogue Overview</h2>
              <p className="mt-0.5 text-[12px] text-slate-500">Current storefront health</p>
            </div>

            <div className="divide-y divide-[#f1eee9]">
              <OverviewRow label="Total stock units" value={Number(stats.totalStock ?? 0).toLocaleString("en-IN")} />
              <OverviewRow label="Out of stock" value={stats.outOfStock ?? 0} />
              <OverviewRow label="Active colors" value={`${stats.activeColors ?? 0} of ${stats.totalColors ?? 0}`} />
              <OverviewRow label="Active rooms" value={`${stats.activeRooms ?? 0} of ${stats.totalRooms ?? 0}`} />
            </div>
          </section>

          <section className="rounded-[14px] border border-[#e8e5df] bg-white">
            <div className="border-b border-[#eeeae3] px-5 py-4">
              <h2 className="text-[16px] font-semibold text-[#17212b]">Latest Subscribers</h2>
              <p className="mt-0.5 text-[12px] text-slate-500">Newest newsletter signups</p>
            </div>

            {recentSubscribers.length === 0 ? (
              <div className="px-5 py-10 text-center text-[13px] text-slate-500">
                No subscribers yet.
              </div>
            ) : (
              <div className="divide-y divide-[#f1eee9]">
                {recentSubscribers.map((subscriber) => (
                  <div key={subscriber._id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#eef8f5] text-[12px] font-semibold uppercase text-[#0d9f83]">
                      {(subscriber.name || subscriber.email).charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-[#17212b]">
                        {subscriber.name || subscriber.email}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">
                        {subscriber.name ? subscriber.email : formatDate(subscriber.createdAt)}
                      </p>
                    </div>

                    <span className="shrink-0 text-[10px] text-slate-400">
                      {formatDate(subscriber.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function OverviewRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <span className="text-[12px] text-slate-500">{label}</span>
      <span className="text-[13px] font-semibold text-[#17212b]">{value}</span>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-7">
      <div>
        <div className="h-[32px] w-[180px] animate-pulse rounded bg-[#e9e5df]" />
        <div className="mt-2 h-[16px] w-[280px] animate-pulse rounded bg-[#efebe5]" />
      </div>

      <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-[150px] animate-pulse rounded-[14px] border border-[#e8e5df] bg-white" />
        ))}
      </div>

      <div className="grid grid-cols-[1.55fr_1fr] gap-4 max-xl:grid-cols-1">
        <div className="h-[420px] animate-pulse rounded-[14px] border border-[#e8e5df] bg-white" />
        <div className="space-y-4">
          <div className="h-[220px] animate-pulse rounded-[14px] border border-[#e8e5df] bg-white" />
          <div className="h-[180px] animate-pulse rounded-[14px] border border-[#e8e5df] bg-white" />
        </div>
      </div>
    </div>
  );
}

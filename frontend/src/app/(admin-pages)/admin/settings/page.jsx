"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiInstagram,
  FiLink,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiSettings,
  FiYoutube,
} from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const inputClass = "h-[44px] w-full rounded-[9px] border border-[#e2ded7] bg-white px-3.5 text-[13px] text-[#17212b] outline-none transition placeholder:text-slate-300 focus:border-[#10b99a]";
const labelClass = "mb-2 block text-[12px] font-semibold text-[#4b5563]";

export default function SettingsPage() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    axios.get(`${API_BASE}/settings`)
      .then((response) => {
        if (!active) return;
        setForm(response.data.settings);
        setError("");
      })
      .catch((requestError) => {
        if (!active) return;
        const message = requestError?.response?.data?.message || "Failed to load settings";
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [refreshKey]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const reload = () => {
    setLoading(true);
    setError("");
    setRefreshKey((key) => key + 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form) return;

    setSaving(true);

    const payload = {
      storeName: form.storeName,
      tagline: form.tagline,
      supportEmail: form.supportEmail,
      supportPhone: form.supportPhone,
      supportAddress: form.supportAddress,
      supportHours: form.supportHours,
      announcementEnabled: form.announcementEnabled,
      announcementText: form.announcementText,
      newsletterEnabled: form.newsletterEnabled,
      instagramUrl: form.instagramUrl,
      pinterestUrl: form.pinterestUrl,
      youtubeUrl: form.youtubeUrl,
    };

    try {
      const response = await axios.put(`${API_BASE}/settings`, payload);
      setForm(response.data.settings);
      toast.success("Settings saved. The storefront is up to date.");

      localStorage.setItem("nestro:settings-updated", String(Date.now()));

      if (typeof BroadcastChannel !== "undefined") {
        const channel = new BroadcastChannel("nestro-settings");
        channel.postMessage("updated");
        channel.close();
      }
    } catch (requestError) {
      toast.error(requestError?.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  if (error || !form) {
    return (
      <div className="rounded-[14px] border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-2 text-[14px] font-semibold text-red-700">
          <FiAlertTriangle size={18} />
          {error || "Settings are unavailable right now"}
        </div>
        <button
          type="button"
          onClick={reload}
          className="mt-4 rounded-[8px] bg-red-600 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-[30px] font-bold text-[#17212b]">
            <FiSettings className="text-[#10b99a]" size={26} />
            Settings
          </h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Manage the details and storefront options used across the website
          </p>
        </div>

        <div className="flex items-center gap-3">
          {form.updatedAt && (
            <span className="hidden text-[11px] text-slate-400 sm:block">
              Last updated {new Date(form.updatedAt).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex h-[42px] items-center gap-2 rounded-[9px] bg-[#10b99a] px-5 text-[13px] font-semibold text-white transition hover:bg-[#0da88c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiSave size={15} />
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-[10px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] font-medium text-emerald-800">
        <FiCheckCircle size={16} className="shrink-0" />
        Saved changes go live on the storefront immediately, including any open tabs.
      </div>

      <div className="grid grid-cols-2 gap-5 max-xl:grid-cols-1">
        <SectionCard
          icon={FiSettings}
          title="Brand identity"
          description="The name and line used in the header, footer, and page titles."
        >
          <label className="block">
            <span className={labelClass}>Store name</span>
            <input
              required
              type="text"
              maxLength={60}
              value={form.storeName}
              onChange={(event) => updateField("storeName", event.target.value)}
              className={inputClass}
            />
          </label>

          <label className="mt-4 block">
            <span className={labelClass}>Footer tagline</span>
            <textarea
              rows={3}
              maxLength={200}
              value={form.tagline}
              onChange={(event) => updateField("tagline", event.target.value)}
              className="w-full resize-none rounded-[9px] border border-[#e2ded7] bg-white px-3.5 py-3 text-[13px] leading-6 text-[#17212b] outline-none transition focus:border-[#10b99a]"
            />
          </label>
        </SectionCard>

        <SectionCard
          icon={FiMail}
          title="Contact and support"
          description="These details appear on the contact page and in the footer."
        >
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <label className="block">
              <span className={labelClass}>Support email</span>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  required
                  type="email"
                  maxLength={120}
                  value={form.supportEmail}
                  onChange={(event) => updateField("supportEmail", event.target.value)}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </label>

            <label className="block">
              <span className={labelClass}>Phone number</span>
              <div className="relative">
                <FiPhone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  maxLength={40}
                  value={form.supportPhone}
                  onChange={(event) => updateField("supportPhone", event.target.value)}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </label>
          </div>

          <label className="mt-4 block">
            <span className={labelClass}>Studio hours</span>
            <div className="relative">
              <FiClock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                maxLength={120}
                value={form.supportHours}
                onChange={(event) => updateField("supportHours", event.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>
          </label>

          <label className="mt-4 block">
            <span className={labelClass}>Showroom address</span>
            <div className="relative">
              <FiMapPin className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={14} />
              <textarea
                rows={2}
                maxLength={200}
                value={form.supportAddress}
                onChange={(event) => updateField("supportAddress", event.target.value)}
                className="w-full resize-none rounded-[9px] border border-[#e2ded7] bg-white py-3 pl-9 pr-3.5 text-[13px] leading-6 text-[#17212b] outline-none transition focus:border-[#10b99a]"
              />
            </div>
          </label>
        </SectionCard>

        <SectionCard
          icon={FiLink}
          title="Storefront announcement"
          description="A slim message strip shown above the main navigation."
        >
          <Toggle
            checked={form.announcementEnabled}
            onChange={() => updateField("announcementEnabled", !form.announcementEnabled)}
            title="Show announcement bar"
            description="Enable to display the message at the top of every page."
          />

          <label className="mt-4 block">
            <span className={labelClass}>Announcement text</span>
            <input
              type="text"
              maxLength={180}
              value={form.announcementText}
              onChange={(event) => updateField("announcementText", event.target.value)}
              className={inputClass}
            />
          </label>

          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Live preview</p>
            <div className={`rounded-[8px] px-3 py-2 text-center text-[10px] font-medium tracking-[0.12em] ${form.announcementEnabled ? "bg-[#1A1208] text-[#D6BFA7]" : "bg-[#f1eee9] text-slate-400"}`}>
              {form.announcementEnabled
                ? form.announcementText || "Your announcement will appear here"
                : "Announcement bar is turned off"}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={FiInstagram}
          title="Newsletter and social"
          description="Control subscriber signups and the social links in the footer."
        >
          <Toggle
            checked={form.newsletterEnabled}
            onChange={() => updateField("newsletterEnabled", !form.newsletterEnabled)}
            title="Allow newsletter signups"
            description="When off, the subscribe form is hidden from the footer."
          />

          <div className="mt-5 space-y-4">
            <UrlField
              icon={FiInstagram}
              label="Instagram URL"
              value={form.instagramUrl}
              onChange={(value) => updateField("instagramUrl", value)}
            />
            <UrlField
              icon={FiLink}
              label="Pinterest URL"
              value={form.pinterestUrl}
              onChange={(value) => updateField("pinterestUrl", value)}
            />
            <UrlField
              icon={FiYoutube}
              label="YouTube URL"
              value={form.youtubeUrl}
              onChange={(value) => updateField("youtubeUrl", value)}
            />
          </div>
        </SectionCard>
      </div>

      <div className="flex justify-end border-t border-[#e8e5df] pt-5">
        <button
          type="submit"
          disabled={saving}
          className="flex h-[44px] items-center gap-2 rounded-[9px] bg-[#10b99a] px-6 text-[13px] font-semibold text-white transition hover:bg-[#0da88c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiSave size={15} />
          {saving ? "Saving changes..." : "Save all changes"}
        </button>
      </div>
    </form>
  );
}

function SectionCard({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-[14px] border border-[#e8e5df] bg-[#fffdfa] p-5">
      <div className="mb-5 flex items-start gap-3 border-b border-[#f0ece6] pb-4">
        <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[9px] bg-[#e8f8f3] text-[#0d9f83]">
          <Icon size={17} />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold text-[#17212b]">{title}</h2>
          <p className="mt-0.5 text-[12px] leading-5 text-slate-500">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

function Toggle({ checked, onChange, title, description }) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-[10px] border border-[#eeeae3] bg-white px-4 py-3">
      <div>
        <p className="text-[13px] font-medium text-[#17212b]">{title}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-[24px] w-[44px] shrink-0 rounded-full transition ${checked ? "bg-[#10b99a]" : "bg-[#d7d3cc]"}`}
      >
        <span className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-[left] ${checked ? "left-[23px]" : "left-[3px]"}`} />
      </button>
    </div>
  );
}

function UrlField({ icon: Icon, label, value, onChange }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
        <input
          type="url"
          maxLength={250}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://"
          className={`${inputClass} pl-9`}
        />
      </div>
    </label>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-[32px] w-[170px] animate-pulse rounded bg-[#e9e5df]" />
        <div className="mt-2 h-[16px] w-[340px] animate-pulse rounded bg-[#efebe5]" />
      </div>

      <div className="h-[46px] animate-pulse rounded-[10px] border border-[#e8e5df] bg-white" />

      <div className="grid grid-cols-2 gap-5 max-xl:grid-cols-1">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-[330px] animate-pulse rounded-[14px] border border-[#e8e5df] bg-white" />
        ))}
      </div>
    </div>
  );
}

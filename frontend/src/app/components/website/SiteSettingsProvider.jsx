"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const defaultSiteSettings = {
  storeName: "Nestro",
  tagline: "Curated furniture for thoughtful homes. Crafted with intention, made to endure.",
  supportEmail: "hello@nestro.com",
  supportPhone: "+91 98290 00000",
  supportAddress: "14 Amber Lane, Jodhpur, Rajasthan 342001",
  supportHours: "Monday to Saturday, 10am - 7pm",
  announcementEnabled: false,
  announcementText: "Complimentary white-glove delivery on orders above Rs. 25,000",
  newsletterEnabled: true,
  instagramUrl: "",
  pinterestUrl: "",
  youtubeUrl: "",
};

const SiteSettingsContext = createContext({
  settings: defaultSiteSettings,
  loading: true,
  refresh: () => {},
});

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    axios.get(`${API_BASE}/settings`)
      .then((response) => {
        if (!active || !response.data?.settings) return;
        setSettings({ ...defaultSiteSettings, ...response.data.settings });
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [refreshKey]);

  useEffect(() => {
    const refresh = () => setRefreshKey((key) => key + 1);

    const channel = typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel("nestro-settings")
      : null;

    if (channel) channel.addEventListener("message", refresh);

    const handleStorage = (event) => {
      if (event.key === "nestro:settings-updated") refresh();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", refresh);

    return () => {
      if (channel) {
        channel.removeEventListener("message", refresh);
        channel.close();
      }
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{ settings, loading, refresh: () => setRefreshKey((key) => key + 1) }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

"use client";

import { useState } from "react";
import "../globals.css";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import AppToaster from "../components/admin/AppToaster";

export default function RootLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <html>
      <body className="min-h-screen bg-[#f7f5f1]">
        <AppToaster />
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <Header collapsed={collapsed} />

        <main
          className={`min-h-screen pt-[76px] transition-[margin] duration-300 ${
            collapsed ? "ml-[64px]" : "ml-[307px]"
          }`}
        >
          <div className="p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
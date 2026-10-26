"use client";

import {
  FiActivity,
  FiDroplet,
  FiGrid,
  FiLogOut,
  FiPackage,
  FiSettings,
  FiTag,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { RiSidebarFoldLine, RiSidebarUnfoldLine} from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const menu = [
  { name: "Dashboard", icon: FiGrid, href: "/admin" },
  { name: "Category", icon: FiTag, href: "/admin/category" },
  { name: "Products", icon: FiPackage, href: "/admin/products" },
  { name: "Rooms", icon: HiOutlineBuildingOffice2, href: "/admin/rooms" },
  { name: "Colors", icon: FiDroplet, href: "/admin/colors" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
   const router = useRouter();
   const pathname = usePathname();
   const settingsActive = pathname === "/admin/settings";

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col bg-[#0d1d2b] text-white transition-[width] duration-300 ease-in-out ${
        collapsed ? "w-[64px]" : "w-[307px]"
      }`}
    >
      <div
        className={`flex h-[76px] shrink-0 items-center border-b border-white/5 ${
          collapsed ? "justify-center" : "justify-between px-5"
        }`}
      >
        {collapsed ? (
          <div className="group relative">
            <button
              onClick={() => setCollapsed(false)}
              className="flex h-[43px] w-[43px] items-center justify-center rounded-[10px] text-slate-400 transition-colors duration-150 hover:bg-white/10 hover:text-white"
            >

              <FiActivity
                size={23}
                className="transition-opacity duration-150 group-hover:opacity-0"
              />

              <RiSidebarUnfoldLine
                size={21}
                className="absolute opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              />
            </button>

            <div className="pointer-events-none absolute left-[calc(100%+15px)] top-1/2 z-[100] -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-[8px] bg-[#202124] px-3 py-2 text-[12px] font-medium text-white opacity-0 shadow-xl transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100">
              Open Sidebar
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] bg-[#10b99a]">
                  <FiActivity size={22} />
                </div>
              </Link>

              <div className="whitespace-nowrap">
                <div className="text-[17px] font-bold leading-5">
                  AdminPanel
                </div>

                <div className="mt-1 text-[12px] font-semibold text-[#10b99a]">
                  Pro Dashboard
                </div>
              </div>
            </div>

            <Tooltip text="Close Sidebar">
              <button
                onClick={() => setCollapsed(true)}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-[9px] text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <RiSidebarFoldLine size={20} />
              </button>
            </Tooltip>
          </>
        )}
      </div>

      <div className="px-[10px] pt-6">
        <div
          className={`mb-4 overflow-hidden whitespace-nowrap px-[9px] text-[12px] font-bold tracking-[1px] text-slate-500 transition-[opacity,height] duration-200 ${
            collapsed
              ? "h-0 opacity-0"
              : "h-[18px] opacity-100"
          }`}
        >
          MAIN MENU
        </div>

        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/admin" 
            ? pathname === "/admin" 
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Tooltip
                key={item.name}
                text={item.name}
                disabled={!collapsed}
              >
                <button
                onClick={() => router.push(item.href)}
                  className={`relative flex h-[64px] w-full cursor-pointer items-center transition-colors duration-150 ${
                    collapsed
                      ? "justify-center"
                      : "gap-4 rounded-[14px] px-4"
                  } ${
                    active && !collapsed
                      ? "bg-[#103d43] text-[#0bd0ad]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {active && !collapsed && (
                    <span className="absolute left-0 h-[19px] w-[3px] rounded-r-full bg-[#16d2b0]" />
                  )}

                  <span
                    className={`flex h-[40px] w-[40px] shrink-0 items-center justify-center ${
                      collapsed
                        ? active
                          ? "rounded-[10px] bg-[#103d43] text-[#0bd0ad]"
                          : "rounded-[10px] hover:bg-white/5"
                        : active
                          ? "rounded-[10px] bg-[#115b58]"
                          : ""
                    }`}
                  >
                    <Icon size={21} />
                  </span>

                  <span
                    className={`overflow-hidden whitespace-nowrap text-[14px] transition-[opacity] duration-200 ${
                      collapsed
                        ? "w-0 opacity-0"
                        : "w-auto opacity-100 delay-100"
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              </Tooltip>
            );
          })}
        </nav>

        <div className="my-7 border-t border-white/5" />

        <div
          className={`mb-4 overflow-hidden whitespace-nowrap px-[9px] text-[12px] font-bold tracking-[1px] text-slate-500 transition-[opacity,height] duration-200 ${
            collapsed
              ? "h-0 opacity-0"
              : "h-[18px] opacity-100"
          }`}
        >
          SYSTEM
        </div>

        <Tooltip text="Settings" disabled={!collapsed}>
          <button
            onClick={() => router.push("/admin/settings")}
            className={`relative flex h-[58px] w-full cursor-pointer items-center transition-colors duration-150 ${
              collapsed
                ? "justify-center"
                : "gap-4 rounded-[14px] px-4"
            } ${
              settingsActive && !collapsed
                ? "bg-[#103d43] text-[#0bd0ad]"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {settingsActive && !collapsed && (
              <span className="absolute left-0 h-[19px] w-[3px] rounded-r-full bg-[#16d2b0]" />
            )}

            <span
              className={`flex h-[40px] w-[40px] shrink-0 items-center justify-center ${
                collapsed
                  ? settingsActive
                    ? "rounded-[10px] bg-[#103d43] text-[#0bd0ad]"
                    : "rounded-[10px]"
                  : settingsActive
                    ? "rounded-[10px] bg-[#115b58]"
                    : ""
              }`}
            >
              <FiSettings size={21} />
            </span>

            <span
              className={`overflow-hidden whitespace-nowrap text-[16px] transition-opacity duration-200 ${
                collapsed
                  ? "w-0 opacity-0"
                  : "w-auto opacity-100 delay-100"
              }`}
            >
              Settings
            </span>
          </button>
        </Tooltip>
      </div>


            {/* Profile Section */}
      <div
  className={`mt-auto border-t border-white/5 ${
    collapsed ? "flex justify-center p-2" : "p-5"
  }`}
>
  {collapsed ? (
    <div className="group relative">
      <button className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-[10px] text-slate-400 transition hover:bg-white/5 hover:text-red-400">
        <FiLogOut size={19} />
      </button>

      <div className="pointer-events-none absolute left-[calc(100%+15px)] top-1/2 z-[100] -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-[8px] bg-[#202124] px-3 py-2 text-[12px] font-medium text-white opacity-0 shadow-xl transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100">
        Logout
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        <div className="flex h-[47px] w-[47px] items-center justify-center rounded-full border-2 border-[#0ed0b0] bg-[#10a98e] text-[18px] font-semibold">
          A
        </div>

        <span className="absolute bottom-0 right-0 h-[11px] w-[11px] rounded-full border-2 border-[#0d1d2b] bg-[#16d29e]" />
      </div>

      <div className="flex-1">
        <div className="text-[15px] font-semibold">
          Admin
        </div>

        <div className="text-[12px] text-slate-500">
          Super Admin
        </div>
      </div>

      <div className="group relative">
        <button className="flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-[8px] text-slate-400 transition hover:bg-white/5 hover:text-red-400">
          <FiLogOut size={18} />
        </button>

        <div className="pointer-events-none absolute bottom-[calc(100%+8px)] right-0 z-[100] whitespace-nowrap rounded-[8px] bg-[#202124] px-3 py-2 text-[12px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
          Logout
        </div>
      </div>
    </div>
  )}
</div>

    </aside>
  );
}

function Tooltip({ children, text, disabled }) {
  if (disabled) {
    return children;
  }

  return (
    <div className="group relative">
      {children}

      <div className="pointer-events-none absolute left-[calc(100%+15px)] top-1/2 z-[100] -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-[8px] bg-[#202124] px-3 py-2 text-[12px] font-medium text-white opacity-0 shadow-xl transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100">
        {text}
      </div>
    </div>
  );
}
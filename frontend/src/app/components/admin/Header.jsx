"use client";

import { FiBell, FiChevronDown, FiSearch } from "react-icons/fi";

export default function Header({ collapsed }) {
  return (
    <header
      className={`fixed right-0 top-0 z-40 h-[76px] border-b border-[#e9e9e9] bg-white transition-[left] duration-300 ${
        collapsed ? "left-[64px]" : "left-[307px]"
      }`}
    >
      <div className="flex h-full items-center justify-between px-6">
        <div className="min-w-[220px]">
          <h1 className="text-[18px] font-bold leading-5 text-[#17212b]">
            Welcome back 👋
          </h1>

          <p className="mt-1 text-[12px] text-slate-500">
            Manage your product store
          </p>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <div className="flex h-[44px] w-[385px] items-center rounded-[13px] border border-[#e6e6e6] bg-[#fafafa] px-3 transition focus-within:border-[#10b99a] focus-within:bg-white">
            <FiSearch
              size={19}
              className="shrink-0 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search anything..."
              className="ml-3 w-full bg-transparent text-[13px] text-[#17212b] outline-none placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[9px] text-slate-500 transition hover:bg-slate-50 hover:text-[#17212b]">
            <FiBell size={21} />
          </button>

          <div className="h-[30px] w-px bg-[#e9e9e9]" />

          <button className="flex cursor-pointer items-center gap-3 rounded-[10px] px-2 py-1.5 transition hover:bg-slate-50">
            <div className="flex h-[39px] w-[39px] items-center justify-center rounded-full border-2 border-[#0ed0b0] bg-[#10a98e] text-[16px] font-semibold text-white">
              A
            </div>

            <div className="text-left">
              <div className="text-[13px] font-semibold leading-4 text-[#17212b]">
                Admin
              </div>

              <div className="mt-0.5 text-[11px] text-slate-500">
                Super Admin
              </div>
            </div>

            <FiChevronDown
              size={15}
              className="ml-2 text-slate-400"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
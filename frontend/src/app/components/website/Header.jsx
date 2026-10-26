"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconSearch,
  IconShoppingBag,
  IconUser,
} from "@tabler/icons-react";
import { useSiteSettings } from "./SiteSettingsProvider";

export default function Header() {
  const pathname = usePathname();
  const { settings } = useSiteSettings();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Store", path: "/store" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Checkout", path: "/checkout" },
    { name: "Sign In", path: "/signin" },
  ];

  return (
    <>
      {settings.announcementEnabled && settings.announcementText && (
        <div className="bg-wood px-4 py-2 text-center text-[10px] font-medium tracking-[0.16em] text-golden">
          {settings.announcementText}
        </div>
      )}

    <header className="bg-white border-b border-accent/15 flex justify-between">
      <Link
        href="/"
        className="py-4 pl-7 font-medium tracking-widest text-dark-text"
      >
        {settings.storeName.toUpperCase()} <span className="text-[#8B5E3C]">.</span>
      </Link>

      <ul className="flex gap-1.5 items-center text-[11px] text-light-text font-normal tracking-wider">
        {navItems.map((item) => {
          const active = pathname === item.path;

          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`block px-3 py-1 rounded-sm transition ${
                  active
                    ? "text-accent bg-[#f0ebe3] font-semibold"
                    : "hover:text-[#8B5E3C] hover:bg-[#f0ebe3] hover:font-semibold"
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <ul className="flex items-center mr-11 gap-4 relative">
        <div className="flex items-center gap-6">
          <li>
            <IconSearch size={16} className="text-dark-text" />
          </li>

          <li className="relative">
            <IconShoppingBag size={17} className="text-dark-text" />

            <span className="absolute -top-2.5 -right-2.5 w-[13px] h-[13px] flex items-center justify-center bg-accent text-white text-[8px] rounded-full">
              3
            </span>
          </li>
        </div>

        <li>
          <IconUser
            size={30}
            className="bg-[#f0ebe3] p-1.5 rounded-full text-[#8B5E3C] border"
          />
        </li>
      </ul>
    </header>
    </>
  );
}
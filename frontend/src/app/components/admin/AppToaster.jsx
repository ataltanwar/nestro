"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand
      duration={3600}
      offset={20}
      toastOptions={{
        style: {
          width: "min(380px, calc(100vw - 32px))",
          minHeight: "68px",
          padding: "14px 42px 14px 16px",
          borderRadius: "14px",
          border: "1px solid #eceae6",
          boxShadow: "0 10px 28px rgba(23, 33, 43, 0.12)",
          fontFamily: "Inter, sans-serif",
        },
        classNames: {
          toast: "!bg-white !text-[#17212b]",
          title: "!text-[13px] !font-semibold !leading-5",
          description: "!mt-0.5 !text-[12px] !leading-5 !text-slate-500",
          closeButton: "!left-auto !right-3 !top-1/2 !-translate-y-1/2 !border-0 !bg-transparent !text-slate-400 hover:!text-[#17212b]",
        },
      }}
    />
  );
}

"use client";

import { Sidebar } from "@/components/admin/Sidebar";
import { usePathname } from "next/navigation";
import React from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AnimatePresence, m } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="font-sf">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] font-sf text-[#191c1e]">
      <Sidebar />
      <div className="lg:pl-[260px]">
        {/* Main Content */}
        <main className="p-4 sm:p-8 pt-20 lg:pt-8 max-w-[1280px]">
          <SmoothScroll>
            <AnimatePresence mode="wait">
              <m.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </m.div>
            </AnimatePresence>
          </SmoothScroll>
        </main>
      </div>
    </div>
  );
}

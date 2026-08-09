"use client";

import { Sidebar } from "@/components/admin/Sidebar";
import { usePathname } from "next/navigation";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div 
      className="min-h-screen bg-[#f8f9fb]"
      style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
    >
      <Sidebar />
      <div className="lg:pl-[260px]">
        {/* Main Content */}
        <main className="p-4 sm:p-8 pt-20 lg:pt-8 max-w-[1280px]">
          {children}
        </main>
      </div>
    </div>
  );
}

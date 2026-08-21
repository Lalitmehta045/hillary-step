"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { 
  LuLayoutDashboard, 
  LuFileText, 
  LuBriefcase,
  LuMessageSquare, 
  LuSettings,
  LuMenu,
  LuX
} from "react-icons/lu";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LuLayoutDashboard },
  { name: "Applications", href: "/admin/applications", icon: LuFileText },
  { name: "Job Postings", href: "/admin/jobs", icon: LuBriefcase },
  { name: "Enquiries", href: "/admin/enquiries", icon: LuMessageSquare },
  { name: "Settings", href: "/admin/settings", icon: LuSettings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, admin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#061a3d] flex items-center justify-between px-4 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/Hillary Step Solutions  logo.png"
            alt="Hillary Step Solutions Logo"
            width={28}
            height={20}
            priority
            className="object-contain brightness-0 invert"
          />
          <h1 className="text-lg font-bold text-white tracking-wide">Hillary Step</h1>
          <span className="text-[9px] uppercase tracking-widest text-blue-200 border border-blue-200/30 px-1.5 py-0.5 rounded ml-1">Admin</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-md transition-colors"
        >
          {isOpen ? <LuX className="w-6 h-6" /> : <LuMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 w-[260px] bg-[#061a3d] text-white flex flex-col border-r border-[#c4c6d3] z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo Area */}
        <div className="h-[100px] flex flex-col justify-center px-8 border-b border-white/10 shrink-0 relative">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/Hillary Step Solutions  logo.png"
              alt="Hillary Step Solutions Logo"
              width={40}
              height={28}
              priority
              className="object-contain brightness-0 invert"
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-wide">Hillary Step</h1>
              <p className="text-[10px] uppercase tracking-widest text-blue-200 mt-0.5">Admin Suite</p>
            </div>
          </div>
          
          <button 
            className="lg:hidden absolute top-4 right-4 p-2 text-white/70 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-md text-sm font-normal transition-colors ${
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-blue-100 hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full" />
                )}
                <item.icon className="w-5 h-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LuLock, LuMail, LuEye, LuEyeOff, LuArrowRight } from "react-icons/lu";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@hillarystep.com");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter valid credentials");
      return;
    }
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_authenticated", "true");
      }
      router.push("/admin");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFBFD] font-display text-[#171717] flex flex-col items-center justify-center p-6 selection:bg-[#0070F3] selection:text-white">
      {/* Top Header Logo */}
      <Link href="/" className="mb-8 flex flex-col items-center gap-3 transition-transform duration-200 hover:scale-105">
        <Image
          src="/assets/Hillary Step Solutions  logo.png"
          alt="Hillary Step Solutions"
          width={180}
          height={60}
          priority
          className="h-12 w-auto object-contain"
        />
        <span className="font-display text-[11px] font-[600] uppercase tracking-[3px] text-[#8E8E8E]">
          Admin Console
        </span>
      </Link>

      {/* Main Clean Card */}
      <div className="w-full max-w-[400px] rounded-[24px] bg-white p-8 sm:p-9 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.06)] border border-[#EAEAEA]">
        <div className="mb-7">
          <h1 className="font-display text-2xl font-[600] tracking-[-0.5px] text-[#111111]">
            Sign in
          </h1>
          <p className="mt-1 font-display text-sm font-[400] text-[#666666]">
            Enter your Hillary Step admin credentials to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-center font-display text-xs font-[500] text-red-600 border border-red-100">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="font-display text-xs font-[600] uppercase tracking-[1.2px] text-[#666666]">
              Email Address
            </label>
            <div className="relative flex items-center">
              <LuMail className="absolute left-3.5 h-4 w-4 text-[#999999]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-[#E1E1E1] bg-[#FAFAFA] py-3 pl-10 pr-4 font-display text-sm font-[400] text-[#111111] placeholder-[#A0A0A0] outline-none transition-all duration-200 focus:border-[#0070F3] focus:bg-white focus:ring-2 focus:ring-[#0070F3]/10"
                placeholder="admin@hillarystep.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-display text-xs font-[600] uppercase tracking-[1.2px] text-[#666666]">
                Password
              </label>
              <button
                type="button"
                className="font-display text-xs font-[500] text-[#0070F3] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative flex items-center">
              <LuLock className="absolute left-3.5 h-4 w-4 text-[#999999]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-[#E1E1E1] bg-[#FAFAFA] py-3 pl-10 pr-10 font-display text-sm font-[400] text-[#111111] placeholder-[#A0A0A0] outline-none transition-all duration-200 focus:border-[#0070F3] focus:bg-white focus:ring-2 focus:ring-[#0070F3]/10"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[#999999] hover:text-[#111111] transition-colors"
              >
                {showPassword ? (
                  <LuEyeOff className="h-4 w-4" />
                ) : (
                  <LuEye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-[#0070F3] font-display text-sm font-[500] text-white shadow-[0_2px_10px_rgba(0,112,243,0.25)] transition-all duration-200 hover:bg-[#0060DF] active:scale-[0.99] disabled:opacity-75"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Sign in to Admin</span>
                <LuArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            )}
          </button>
        </form>
      </div>

      {/* Return to main site */}
      <Link
        href="/"
        className="mt-8 font-display text-xs font-[500] text-[#8E8E8E] transition-colors hover:text-[#111111]"
      >
        ← Back to Hillary Step Solutions
      </Link>
    </div>
  );
}

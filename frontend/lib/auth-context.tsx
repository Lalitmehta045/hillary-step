"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Admin } from "./api/types";
import { authApi } from "./api/auth";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string; [key: string]: string }) => Promise<{ admin?: Admin; requiresMfa?: boolean; mfaToken?: string }>;
  logout: () => Promise<void>;
  verifyMfa: (data: { mfaToken?: string; email?: string; code: string }) => Promise<{ admin?: Admin }>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkSession = async () => {
    try {
      const response = await authApi.getSession();
      setAdmin(response.admin);
    } catch (error) {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only check session on initial load or specific triggers
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkSession();
  }, []);

  useEffect(() => {
    // Protect admin routes
    if (!isLoading) {
      if (pathname.startsWith("/admin") && !pathname.includes("/login") && !admin) {
        router.push("/admin/login");
      }
    }
  }, [isLoading, admin, pathname, router]);

  const login = async (credentials: { email: string; password: string; [key: string]: string }) => {
    const response = await authApi.login(credentials);
    if (response.admin && !response.requiresMfa) {
      setAdmin(response.admin);
      router.push("/admin");
    }
    return response;
  };

  const verifyMfa = async (data: { mfaToken?: string; email?: string; code: string }) => {
    const response = await authApi.verifyMfa(data);
    if (response.admin) {
      setAdmin(response.admin);
      router.push("/admin");
    }
    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setAdmin(null);
      router.push("/admin/login");
    }
  };

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout, verifyMfa, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

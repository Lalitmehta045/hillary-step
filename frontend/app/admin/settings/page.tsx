"use client";

import { FormEvent, useState } from "react";
import { LuUser, LuBell, LuShield, LuSave } from "react-icons/lu";
import { adminApi } from "@/lib/api/admin";
import { ApiError } from "@/lib/api-client";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    if (oldPassword === newPassword) {
      setPasswordError("New password must be different from the current password.");
      return;
    }

    setPasswordBusy(true);
    try {
      const res = await adminApi.changePassword({
        oldPassword,
        newPassword,
      });
      setPasswordSuccess(res.message || "Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const apiErr = err instanceof ApiError ? err : null;
      setPasswordError(
        apiErr?.message ||
          (err instanceof Error ? err.message : "Failed to update password. Please try again."),
      );
    } finally {
      setPasswordBusy(false);
    }
  };

  return (
    <div className="w-full max-w-[1020px]">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#191c1e] font-display sm:text-2xl">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Settings Sidebar */}
        <div className="shrink-0 lg:w-64">
          <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LuUser className="h-4 w-4 shrink-0" />
              Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "notifications"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LuBell className="h-4 w-4 shrink-0" />
              Notifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "security"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LuShield className="h-4 w-4 shrink-0" />
              Security
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="min-h-[400px] flex-1 rounded-md border border-gray-200 bg-white p-4 sm:p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="border-b border-gray-100 pb-4 font-display text-lg font-bold text-[#191c1e]">
                Profile Information
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-gray-500">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Admin"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-gray-500">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="User"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase text-gray-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@hillarystep.com"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto"
                >
                  <LuSave className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="border-b border-gray-100 pb-4 font-display text-lg font-bold text-[#191c1e]">
                Notification Preferences
              </h2>

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 p-4 sm:items-center">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">Email Alerts</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Receive daily summary of new applications.
                    </p>
                  </div>
                  <div className="relative h-6 w-10 shrink-0 cursor-pointer rounded-full bg-blue-600">
                    <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 p-4 sm:items-center">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Browser Notifications
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Get instant alerts for important events.
                    </p>
                  </div>
                  <div className="relative h-6 w-10 shrink-0 cursor-pointer rounded-full bg-gray-200">
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="border-b border-gray-100 pb-4 font-display text-lg font-bold text-[#191c1e]">
                Security Settings
              </h2>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                  <label
                    htmlFor="current-password"
                    className="shrink-0 text-xs font-semibold uppercase text-gray-500 sm:w-40"
                  >
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                      if (passwordSuccess) setPasswordSuccess("");
                    }}
                    className="w-full max-w-md rounded-md border border-gray-200 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                  <label
                    htmlFor="new-password"
                    className="shrink-0 text-xs font-semibold uppercase text-gray-500 sm:w-40"
                  >
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                      if (passwordSuccess) setPasswordSuccess("");
                    }}
                    className="w-full max-w-md rounded-md border border-gray-200 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                  <label
                    htmlFor="confirm-password"
                    className="shrink-0 text-xs font-semibold uppercase text-gray-500 sm:w-40"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                      if (passwordSuccess) setPasswordSuccess("");
                    }}
                    className="w-full max-w-md rounded-md border border-gray-200 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <p className="text-xs text-gray-400 sm:pl-[11.5rem]">
                  Password must be at least 8 characters.
                </p>

                {passwordError && (
                  <p
                    role="alert"
                    className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700 sm:max-w-md sm:ml-[11.5rem]"
                  >
                    {passwordError}
                  </p>
                )}

                {passwordSuccess && (
                  <p
                    role="status"
                    className="rounded-md border border-green-100 bg-green-50 px-3 py-2 text-sm text-green-700 sm:max-w-md sm:ml-[11.5rem]"
                  >
                    {passwordSuccess}
                  </p>
                )}

                <div className="pt-2 sm:pl-[11.5rem]">
                  <button
                    type="submit"
                    disabled={passwordBusy}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {passwordBusy ? "Updating…" : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

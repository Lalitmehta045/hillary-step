"use client";

import { useState } from "react";
import { LuUser, LuBell, LuShield, LuSave } from "react-icons/lu";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-[1020px]">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#191c1e] font-display">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Sidebar */}
        <div className="lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === "profile" 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LuUser className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === "notifications" 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LuBell className="w-4 h-4" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === "security" 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LuShield className="w-4 h-4" />
              Security
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-md border border-gray-200 p-6 min-h-[400px]">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#191c1e] font-display border-b border-gray-100 pb-4">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">First Name</label>
                  <input type="text" defaultValue="Admin" className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Last Name</label>
                  <input type="text" defaultValue="User" className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
                  <input type="email" defaultValue="admin@hillarystep.com" className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  <LuSave className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#191c1e] font-display border-b border-gray-100 pb-4">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Email Alerts</h3>
                    <p className="text-xs text-gray-500 mt-1">Receive daily summary of new applications.</p>
                  </div>
                  <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Browser Notifications</h3>
                    <p className="text-xs text-gray-500 mt-1">Get instant alerts for important events.</p>
                  </div>
                  <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#191c1e] font-display border-b border-gray-100 pb-4">Security Settings</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full max-w-md px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">New Password</label>
                  <input type="password" placeholder="Enter new password" className="w-full max-w-md px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div className="pt-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

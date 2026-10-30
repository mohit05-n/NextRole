"use client";

import Layout from "@/components/Layout";
import { useState } from "react";
import { Settings, Shield, Bell, Eye, Save, Sparkles } from "lucide-react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState(true);
  const [showTokens, setShowTokens] = useState(false);

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Title */}
        <div className="border-b border-[#1f2833]/20 pb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className="h-7 w-7 text-blue-400" />
            Platform Settings
          </h1>
          <p className="text-sm text-[#c5c6c7]/65 mt-1">Manage UI themes, toggle alerts, and verify AWS credential parameters.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Theme Settings Card */}
          <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#c5c6c7]/50 flex items-center gap-2 border-b border-[#1f2833]/15 pb-3">
              <Eye className="h-4.5 w-4.5 text-blue-400" />
              Theme Preferences
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Visual Interface Mode</h4>
                <p className="text-xs text-gray-500 mt-0.5">Toggle between premium dark gradient configurations or standard modes.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    theme === "dark" 
                      ? "bg-blue-600 border-blue-500/20 text-white" 
                      : "bg-[#07080d] border-[#1f2833]/40 text-[#c5c6c7]/60"
                  }`}
                >
                  Dark Glow
                </button>
                <button
                  onClick={() => {
                    setTheme("classic");
                    alert("Classic theme is in progress. The application will stay in Premium Dark Glow by default.");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    theme === "classic" 
                      ? "bg-blue-600 border-blue-500/20 text-white" 
                      : "bg-[#07080d] border-[#1f2833]/40 text-[#c5c6c7]/60"
                  }`}
                >
                  Classic Slate
                </button>
              </div>
            </div>
          </div>

          {/* Notification Card */}
          <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#c5c6c7]/50 flex items-center gap-2 border-b border-[#1f2833]/15 pb-3">
              <Bell className="h-4.5 w-4.5 text-blue-400" />
              Email Notifications & Alerts
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Career Milestone Reminders</h4>
                <p className="text-xs text-gray-500 mt-0.5">Receive digests on roadmap steps or AWS certification exam updates.</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifications ? "bg-blue-600" : "bg-gray-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Security Credentials Card */}
          <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#c5c6c7]/50 flex items-center gap-2 border-b border-[#1f2833]/15 pb-3">
              <Shield className="h-4.5 w-4.5 text-blue-400" />
              Integration Security Keys
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white">AWS Integration Identifiers</h4>
                <p className="text-xs text-gray-500 mt-0.5">Below are the active serverless settings injected via `.env.local`.</p>
              </div>

              <div className="space-y-3.5 text-xs font-mono">
                <div className="space-y-1.5">
                  <span className="block text-gray-500 font-bold uppercase tracking-wider text-[10px]">NEXT_PUBLIC_CLIENT_ID</span>
                  <input
                    type="text"
                    value={process.env.NEXT_PUBLIC_CLIENT_ID || "AWS_ID"}
                    readOnly
                    className="w-full bg-[#07080d] border border-[#1f2833]/30 rounded-lg py-2.5 px-3 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="block text-gray-500 font-bold uppercase tracking-wider text-[10px]">NEXT_PUBLIC_USER_POOL_ID</span>
                  <input
                    type="text"
                    value={process.env.NEXT_PUBLIC_USER_POOL_ID || "us-east-1_AWS_ID"}
                    readOnly
                    className="w-full bg-[#07080d] border border-[#1f2833]/30 rounded-lg py-2.5 px-3 text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

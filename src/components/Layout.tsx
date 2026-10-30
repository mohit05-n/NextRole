"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { Search, Sun, Bell, User, AlertCircle } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0b0c10] text-white">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-lg font-medium text-gray-400">Synchronizing Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Get current page section label
  const getSectionLabel = () => {
    switch (pathname) {
      case "/dashboard": return "Dashboard Overview";
      case "/profile": return "My Professional Profile";
      case "/resume": return "Resume Processing Hub";
      case "/roadmap": return "Learning Roadmap";
      case "/projects": return "Project Portfolio";
      case "/certifications": return "Certification Advisor";
      case "/ask-ai": return "Ask AI Career Advisor";
      case "/career-paths": return "Career Trajectory Explorer";
      case "/compare-roles": return "Compare Job Roles";
      case "/admin-panel": return "Admin Console";
      case "/settings": return "Platform Settings";
      default: return "NextRole Platform";
    }
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-[#c5c6c7] flex overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 h-16 border-b border-[#1f2833]/15 bg-[#0b0c13]/85 backdrop-blur-md px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="hidden md:block text-sm font-bold text-white tracking-tight">{getSectionLabel()}</h2>
            
            {/* Search Input Bar */}
            <div className="relative w-64 md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search roles, skills, certifications..."
                className="w-full bg-[#07080d] border border-[#1f2833]/30 focus:border-blue-500/50 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-600 focus:outline-none transition duration-150"
              />
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition">
              <Sun className="h-4.5 w-4.5" />
            </button>

            {/* Notification Bell Button */}
            <button className="relative p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-blue-500"></span>
            </button>

            {/* User Profile Avatar */}
            <button 
              onClick={() => router.push("/profile")}
              className="p-1.5 rounded-lg border border-[#1f2833]/40 bg-[#0f111a] text-gray-400 hover:text-white transition"
            >
              <User className="h-4.5 w-4.5" />
            </button>
          </div>
        </header>

        {/* Dynamic Inner Page Children View */}
        <main className="flex-grow p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}

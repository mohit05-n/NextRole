"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  FolderGit2, 
  Map, 
  Award, 
  LogOut,
  Compass,
  GitCompare,
  ShieldCheck,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MessageSquareCode
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Ask AI", href: "/ask-ai", icon: MessageSquareCode, highlight: true },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Resume", href: "/resume", icon: FileText },
    { name: "Career Paths", href: "/career-paths", icon: Compass },
    { name: "Compare Roles", href: "/compare-roles", icon: GitCompare },
    { name: "Roadmap", href: "/roadmap", icon: Map },
    { name: "Projects", href: "/projects", icon: FolderGit2 },
    { name: "Certifications", href: "/certifications", icon: Award },
    { name: "Admin Panel", href: "/admin-panel", icon: ShieldCheck },
  ];

  const bottomItems = [
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div 
      className={`relative h-screen bg-[#0b0c13] border-r border-[#1f2833]/15 flex flex-col justify-between transition-all duration-300 z-50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header / Logo */}
      <div className="p-5 flex items-center justify-between border-b border-[#1f2833]/10">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wider text-white">NextRole</h2>
              <span className="text-[10px] text-gray-500 font-bold block mt-0.5">Career Platform</span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 mx-auto">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
        )}

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 h-6 w-6 rounded-full border border-[#1f2833]/30 bg-[#0b0c13] text-gray-500 hover:text-white flex items-center justify-center shadow-lg transition"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          if (item.highlight) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                    : "bg-blue-600/5 text-[#c5c6c7] border-blue-500/10 hover:bg-blue-600/10 hover:text-white"
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0 text-blue-400" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#1f2833]/15 text-blue-400 font-semibold"
                  : "text-[#c5c6c7]/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-blue-400" : "text-gray-400"}`} />
              {!isCollapsed && <span>{item.name}</span>}
              {isActive && !isCollapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500"></span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Menu Items */}
      <div className="p-3 border-t border-[#1f2833]/10 space-y-3">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#1f2833]/15 text-blue-400 font-semibold"
                  : "text-[#c5c6c7]/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-blue-400" : "text-gray-400"}`} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}

        {/* Profile Card */}
        <div className="flex items-center justify-between border-t border-[#1f2833]/10 pt-3 text-xs">
          <Link 
            href="/profile"
            className={`flex items-center gap-2.5 overflow-hidden text-[#c5c6c7]/80 hover:text-white transition ${
              isCollapsed ? "mx-auto justify-center" : "flex-1"
            }`}
          >
            <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="block font-bold text-white truncate text-[11px]">{user?.name}</span>
                <span className="block text-[10px] text-gray-500 truncate">{user?.email}</span>
              </div>
            )}
          </Link>

          {!isCollapsed && (
            <button 
              onClick={logout}
              className="p-2 text-gray-500 hover:text-white hover:bg-red-500/10 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

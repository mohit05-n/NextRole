"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  FolderGit2, 
  Map, 
  Award, 
  LogOut 
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Resume", href: "/resume", icon: FileText },
    { name: "Projects", href: "/projects", icon: FolderGit2 },
    { name: "Roadmap", href: "/roadmap", icon: Map },
    { name: "Certifications", href: "/certifications", icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1f2833]/40 bg-[#0b0c10]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20">
            <span className="text-lg font-bold text-white">N</span>
          </div>
          <Link href="/dashboard" className="text-xl font-bold tracking-wider text-white">
            Next<span className="text-blue-500">Role</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                    : "text-[#c5c6c7]/75 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-blue-400" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User profile & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-sm font-medium text-white">{user?.name}</span>
            <span className="text-xs text-gray-500 max-w-[150px] truncate">{user?.email}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400/90 border border-red-500/20 bg-red-950/10 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
      
      {/* Mobile navigation bar */}
      <div className="md:hidden border-t border-[#1f2833]/20 bg-[#0f111a] flex justify-around py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1.5 px-2 rounded text-xs transition-colors duration-150 ${
                isActive ? "text-blue-400 font-semibold" : "text-[#c5c6c7]/60"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Mail, Sparkles, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login, loginWithGoogle, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all credentials.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Failed to log in. Verify your username and password.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0b0c10]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0b0c10] flex items-center justify-center p-4 overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#1f2833]/40 bg-[#0f111a] p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Welcome to NextRole</h1>
          <p className="text-sm text-[#c5c6c7]/60 mt-1.5">Sign in to manage your AI-driven career path</p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-950/15 p-4 text-xs text-red-300">
            <AlertCircle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b0c10] border border-[#1f2833]/50 focus:border-blue-500/50 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none transition duration-150"
                placeholder="developer@example.com"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
              <Link href="/forgot-password" className="text-xs font-semibold text-blue-400 hover:text-blue-300">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b0c10] border border-[#1f2833]/50 focus:border-blue-500/50 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none transition duration-150"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border border-white border-t-transparent"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute w-full border-t border-[#1f2833]/25"></div>
          <span className="relative bg-[#0f111a] px-3.5 text-xs text-gray-500 font-semibold uppercase tracking-wider">Or</span>
        </div>

        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold text-[#c5c6c7] hover:text-white bg-[#1f2833]/20 hover:bg-[#1f2833]/45 border border-[#1f2833]/45 transition duration-150"
        >
          <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-xs text-gray-500 font-semibold">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

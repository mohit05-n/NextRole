"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Mail, Sparkles, AlertCircle, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const { requestForgotPassword, resetPassword } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please input your email address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await requestForgotPassword(email);
      setSuccessMsg("Verification code sent to your email.");
      setIsCodeSent(true);
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err.message || "Failed to send reset code. Verify the email is registered.");
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !newPassword || !confirmPassword) {
      setError("Please fill in all inputs.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await resetPassword(email, code, newPassword);
      setSuccessMsg("Password successfully reset! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Check verification code and rules.");
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold tracking-tight text-white">Reset Password</h1>
          <p className="text-sm text-[#c5c6c7]/60 mt-1.5">Recover access to your NextRole career dashboard</p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-950/15 p-4 text-xs text-red-300">
            <AlertCircle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-950/15 p-4 text-xs text-emerald-300">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{successMsg}</p>
          </div>
        )}

        {!isCodeSent ? (
          <form onSubmit={handleRequestCode} className="space-y-4">
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border border-white border-t-transparent"></div>
              ) : (
                "Request Reset Code"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Verification Code</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#0b0c10] border border-[#1f2833]/50 focus:border-blue-500/50 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none transition duration-150"
                  placeholder="Enter 6-digit code"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">New Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0b0c10] border border-[#1f2833]/50 focus:border-blue-500/50 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none transition duration-150"
                  placeholder="Minimum 8 characters"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Confirm Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0b0c10] border border-[#1f2833]/50 focus:border-blue-500/50 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none transition duration-150"
                  placeholder="Repeat new password"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border border-white border-t-transparent"></div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-500 font-semibold">
          Remember your password?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 transition">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Code2, Map } from "lucide-react";

export default function LandingPage() {
  const { loginWithGoogle, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0b0c10]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0b0c10] overflow-hidden">
      {/* Background Neon Glows */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2833_1px,transparent_1px),linear-gradient(to_bottom,#1f2833_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.07] pointer-events-none"></div>

      {/* Header / Navbar on Landing */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
            <span className="text-lg font-bold text-white">N</span>
          </div>
          <span className="text-xl font-bold tracking-wider text-white">
            Next<span className="text-blue-500">Role</span>
          </span>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all duration-200"
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Generation Career Development Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl">
          Supercharge Your Career with <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">AI & AWS Intelligence</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-[#c5c6c7]/70 max-w-2xl font-light leading-relaxed">
          Upload your resume to extract structural data with AWS Textract, parse skills and profiles with Gemini, and build live career roadmaps automatically.
        </p>

        {/* Primary Call to Action */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={loginWithGoogle}
            className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all duration-200"
          >
            Sign In with Google
            <ArrowRight className="h-5 w-5" />
          </button>
          <a
            href="#features"
            className="flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[#c5c6c7] hover:text-white bg-[#1f2833]/20 hover:bg-[#1f2833]/45 border border-[#1f2833]/40 transition-all duration-200"
          >
            Learn More
          </a>
        </div>

        {/* Floating dashboard preview card */}
        <div className="mt-16 md:mt-24 w-full max-w-5xl rounded-2xl border border-white/10 bg-white/[0.02] p-2 backdrop-blur-3xl shadow-2xl">
          <div className="rounded-xl border border-white/5 bg-[#0f111a] overflow-hidden p-6 md:p-8 text-left">
            <div className="flex items-center justify-between border-b border-[#1f2833]/30 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs text-[#c5c6c7]/40">https://nextrole.ai/dashboard</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="h-10 w-2/3 rounded-lg bg-white/5 animate-pulse"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 rounded-xl bg-white/5 animate-pulse"></div>
                  <div className="h-24 rounded-xl bg-white/5 animate-pulse"></div>
                  <div className="h-24 rounded-xl bg-white/5 animate-pulse"></div>
                </div>
                <div className="h-40 rounded-xl bg-white/5 animate-pulse"></div>
              </div>
              <div className="space-y-6">
                <div className="h-44 rounded-xl bg-white/5 animate-pulse"></div>
                <div className="h-32 rounded-xl bg-white/5 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <section id="features" className="w-full max-w-6xl mt-24 md:mt-32">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Engineered with Production-Grade AWS Integrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Feature 1 */}
            <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a]/50 p-6 hover:border-blue-500/30 transition-all duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Cognito Authorization</h3>
              <p className="text-sm text-[#c5c6c7]/65 leading-relaxed">
                Secure federated authentication with Google Sign-In managed natively through Amazon Cognito. Protected routes enforce identity verification.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a]/50 p-6 hover:border-blue-500/30 transition-all duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-6">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AWS Textract Extraction</h3>
              <p className="text-sm text-[#c5c6c7]/65 leading-relaxed">
                Asynchronous document analysis reads PDF resumes directly from secure Amazon S3 buckets, converting image layers and tables into digital raw text.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a]/50 p-6 hover:border-blue-500/30 transition-all duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600/10 border border-purple-500/20 text-purple-400 mb-6">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Gemini Structuring</h3>
              <p className="text-sm text-[#c5c6c7]/65 leading-relaxed">
                Generative AI models translate unstructured resume paragraphs into clean, relational, type-safe profile models including project and certification directories.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

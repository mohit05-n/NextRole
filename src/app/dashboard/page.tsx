"use client";

import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { fetchFromAPI } from "@/services/api";
import Link from "next/link";
import { 
  Sparkles, 
  FileUp, 
  Briefcase, 
  Terminal, 
  Award, 
  ListTodo, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  ShieldAlert
} from "lucide-react";

interface DashboardData {
  name: string;
  email: string;
  targetRole: string;
  skillsCount?: number;
  experienceCount?: number;
  projectsCount?: number;
  certificationsCount?: number;
  skills: string[];
  projects: any[];
  certifications: any[];
  roadmapProgress: number;
  resumeScore: number;
  atsScore: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const result = await fetchFromAPI("/dashboard");
        // Read from result.data because all endpoints wrap in { success, message, data }
        setData(result.data);
      } catch (err: any) {
        const msg = err.message || "";
        if (msg.includes("404") || msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("profile not found")) {
          setData(null);
        } else {
          setError(msg || "Failed to retrieve dashboard data from AWS Lambda.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-[#c5c6c7]/50 text-sm">Querying NextRole DynamoDB profile...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    const isAuthError = error.toLowerCase().includes("401") || error.toLowerCase().includes("unauthorized");
    const isNetworkError = error.toLowerCase().includes("network") || error.toLowerCase().includes("failed to fetch");
    
    return (
      <Layout>
        <div className="relative rounded-2xl border border-red-500/20 bg-gradient-to-b from-[#0f111a] to-[#121622] p-8 md:p-12 text-center max-w-2xl mx-auto mt-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-red-500/5 blur-[60px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-[60px] pointer-events-none"></div>

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600/10 border border-red-500/20 text-red-400 mb-6">
            <AlertCircle className="h-8 w-8" />
          </div>

          <h2 className="text-xl md:text-2xl font-extrabold text-white mb-3">
            {isAuthError ? "Session Expired" : isNetworkError ? "Connection Failed" : "Backend Error"}
          </h2>

          <p className="text-sm text-[#c5c6c7]/70 leading-relaxed mb-4">
            {isAuthError
              ? "Your session has expired. Please log out and log back in to refresh your credentials."
              : isNetworkError
              ? "Unable to reach the AWS Lambda backend. Check that your AWS API Gateway is deployed and reachable."
              : `An error occurred while loading your dashboard.`}
          </p>

          <div className="rounded-xl bg-[#0b0c10]/80 border border-[#1f2833]/30 p-4 text-left font-mono text-xs text-red-300/80 mb-8 break-all">
            <p className="font-semibold text-white border-b border-[#1f2833]/20 pb-2 mb-2">Error Details:</p>
            <p>{error}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/10 transition"
            >
              Retry Connection
            </button>
            {isAuthError && (
              <button
                onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-red-600/80 hover:bg-red-500 transition"
              >
                Re-login
              </button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // Profile not created yet
  if (!data) {
    return (
      <Layout>
        <div className="relative rounded-2xl border border-[#1f2833]/40 bg-[#0f111a] p-8 md:p-12 text-center max-w-3xl mx-auto overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/5 blur-[50px]"></div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-6">
            <FileUp className="h-8 w-8" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Welcome to NextRole, {user?.name}!
          </h1>
          
          <p className="text-sm md:text-base text-[#c5c6c7]/70 mb-8 max-w-xl mx-auto leading-relaxed">
            Let&apos;s get started on your profile. Upload your resume PDF and we&apos;ll extract your professional skills, projects, and work history to build your dynamic career roadmap and dashboard.
          </p>

          <Link
            href="/resume"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200"
          >
            Upload Resume PDF
            <ChevronRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#1f2833]/20 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              Welcome, {data.name}
              <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
            </h1>
            <p className="text-sm text-[#c5c6c7]/65 mt-1">Live career mapping and ATS match scores generated from your profile.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded bg-[#0f111a] border border-[#1f2833]/50 text-gray-500">
              Role: <strong className="text-blue-400">{data.targetRole}</strong>
            </span>
            <Link
              href="/resume"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#1f2833]/30 hover:bg-[#1f2833]/60 text-[#c5c6c7] border border-[#1f2833]/50 transition duration-150"
            >
              Update Resume
            </Link>
          </div>
        </div>

        {/* Dynamic ATS & Resume Scoring Meters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ATS Match Card */}
          <div className="relative overflow-hidden rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 text-center space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#c5c6c7]/50 flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              ATS Match Score
            </h3>
            <div className="relative flex items-center justify-center h-32">
              {/* Circular Gauge */}
              <svg className="w-28 h-28 transform -rotate-90">
                <circle cx="56" cy="56" r="48" stroke="#1f2833" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="56" 
                  cy="56" 
                  r="48" 
                  stroke="#3b82f6" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={301.6} 
                  strokeDashoffset={301.6 - (301.6 * (data.atsScore || 0)) / 100} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-2xl font-black text-white">{data.atsScore}%</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[200px] mx-auto">
              Optimized for digital parsing search keywords and syntax constraints.
            </p>
          </div>

          {/* Resume Formatting Score */}
          <div className="relative overflow-hidden rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 text-center space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#c5c6c7]/50 flex items-center justify-center gap-2">
              <Award className="h-4 w-4 text-indigo-400" />
              Resume Score
            </h3>
            <div className="relative flex items-center justify-center h-32">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle cx="56" cy="56" r="48" stroke="#1f2833" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="56" 
                  cy="56" 
                  r="48" 
                  stroke="#6366f1" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={301.6} 
                  strokeDashoffset={301.6 - (301.6 * (data.resumeScore || 0)) / 100} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-2xl font-black text-white">{data.resumeScore}%</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[200px] mx-auto">
              Scored on layout flow readability and clarity parameters.
            </p>
          </div>

          {/* Roadmap Progress Meter */}
          <div className="relative overflow-hidden rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 text-center space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#c5c6c7]/50 flex items-center justify-center gap-2 mb-2">
                <ListTodo className="h-4 w-4 text-emerald-400" />
                Roadmap Milestones Progress
              </h3>
              <div className="relative flex items-center justify-center h-28">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#1f2833" strokeWidth="7" fill="transparent" />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    stroke="#10b981" 
                    strokeWidth="7" 
                    fill="transparent" 
                    strokeDasharray={251.2} 
                    strokeDashoffset={251.2 - (251.2 * (data.roadmapProgress || 0)) / 100} 
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xl font-bold text-white">{data.roadmapProgress}%</span>
              </div>
            </div>
            <div className="w-full">
              <Link 
                href="/roadmap"
                className="inline-flex items-center justify-center w-full py-2.5 rounded-lg text-xs font-bold bg-[#1f2833]/30 border border-[#1f2833]/50 text-[#c5c6c7] hover:text-white transition"
              >
                Track Path
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Split details summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main profile items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Target Role details */}
            <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#c5c6c7]/50 mb-3">Target Career Objective</h2>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{data.targetRole}</h3>
                  <p className="text-xs text-gray-500">Suggested by Gemini based on skills profile.</p>
                </div>
              </div>
            </div>

            {/* Core Competencies badges */}
            <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#c5c6c7]/50 mb-4 flex items-center gap-2">
                <Terminal className="h-4.5 w-4.5 text-blue-400" />
                Key Professional Competencies
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.slice(0, 15).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1f2833]/20 text-[#c5c6c7] border border-[#1f2833]/50"
                  >
                    {skill}
                  </span>
                ))}
                {data.skills.length > 15 && (
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0b0c10] text-gray-500 border border-dashed border-[#1f2833]/50">
                    +{data.skills.length - 15} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#c5c6c7]/50">Entity Summary</h2>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-[#1f2833]/20 pb-2">
                  <span className="text-gray-500">Skills Identified</span>
                  <span className="text-white font-bold">{data.skills.length}</span>
                </div>
                <div className="flex justify-between border-b border-[#1f2833]/20 pb-2">
                  <span className="text-gray-500">Projects Count</span>
                  <span className="text-white font-bold">{data.projects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Certifications</span>
                  <span className="text-white font-bold">{data.certifications.length}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-gradient-to-b from-blue-950/10 to-indigo-950/10 p-5 text-center space-y-3">
              <ShieldAlert className="h-5 w-5 text-blue-400 mx-auto" />
              <h4 className="text-xs font-bold text-white">Production AWS Integration</h4>
              <p className="text-[11px] text-gray-500 leading-normal">
                This dashboard consumes live DynamoDB records stored under partition key <strong>{data.email}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

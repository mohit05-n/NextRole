"use client";

import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { fetchFromAPI } from "@/services/api";
import Link from "next/link";
import { FolderGit2, ExternalLink, AlertCircle, Cpu, Sparkles, RefreshCw, Trophy } from "lucide-react";

interface Project {
  title: string;
  description: string;
  skills: string[];
  githubUrl: string;
  liveUrl: string;
}

interface ProjectRecommendation {
  title: string;
  description: string;
  skills: string[];
}

interface Recommendations {
  beginner: ProjectRecommendation[];
  intermediate: ProjectRecommendation[];
  advanced: ProjectRecommendation[];
}

const GithubIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendations>({
    beginner: [],
    intermediate: [],
    advanced: []
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"current" | "recommendations">("current");

  useEffect(() => {
    async function loadProjects() {
      try {
        const result = await fetchFromAPI("/projects");
        setProjects(result?.data?.projects || []);
        setRecommendations(result?.data?.recommendations || { beginner: [], intermediate: [], advanced: [] });
      } catch (err: any) {
        setError(err.message || "Failed to load projects data");
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const result = await fetchFromAPI("/projects/generate", { method: "POST" });
      setRecommendations(result?.data || { beginner: [], intermediate: [], advanced: [] });
    } catch (err: any) {
      alert("Failed to regenerate recommendations: " + err.message);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-[#c5c6c7]/50 text-sm">Retrieving projects from DynamoDB...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    const isSetupPending = !!process.env.NEXT_PUBLIC_API_URL?.includes("AWS_ID");
    
    if (isSetupPending) {
      return (
        <Layout>
          <div className="relative rounded-2xl border border-blue-500/20 bg-gradient-to-b from-[#0f111a] to-[#121622] p-8 md:p-12 text-center max-w-2xl mx-auto mt-12 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/5 blur-[60px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-[60px] pointer-events-none"></div>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-6 animate-pulse">
              <AlertCircle className="h-8 w-8" />
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-white mb-3">
              AWS Configuration Required
            </h2>

            <p className="text-sm text-[#c5c6c7]/70 leading-relaxed mb-6">
              NextRole is ready, but it is currently configured with placeholder AWS resource values. Please update your `.env.local` configuration to connect to your live AWS stack and retrieve projects.
            </p>

            <div className="rounded-xl bg-[#0b0c10]/80 border border-[#1f2833]/30 p-4 text-left font-mono text-xs text-[#c5c6c7]/60 space-y-2.5 mb-8">
              <p className="font-semibold text-white border-b border-[#1f2833]/20 pb-2">Environment Variables Status:</p>
              <div className="flex justify-between">
                <span>NEXT_PUBLIC_API_URL:</span>
                <span className={process.env.NEXT_PUBLIC_API_URL?.includes("AWS_ID") ? "text-yellow-400 font-semibold" : "text-emerald-400 font-semibold"}>
                  {process.env.NEXT_PUBLIC_API_URL?.includes("AWS_ID") ? "AWS_ID (Placeholder)" : "Configured"}
                </span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition"
              >
                Retry Connection
              </button>
              <a
                href="https://github.com"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Please open the project's README.md file in your workspace editor for detailed manual deployment and IAM instructions.");
                }}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-[#c5c6c7] hover:text-white bg-[#1f2833]/30 hover:bg-[#1f2833]/60 border border-[#1f2833]/50 transition"
              >
                Read Deploy Steps
              </a>
            </div>
          </div>
        </Layout>
      );
    }

    const is404 = error.includes("404") || error.toLowerCase().includes("not found");
    return (
      <Layout>
        <div className="rounded-xl border border-red-500/20 bg-red-950/10 p-6 text-center max-w-xl mx-auto mt-10">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">{is404 ? "No Projects Profile Found" : "Error Loading Projects"}</h2>
          <p className="text-sm text-red-300/80 mb-6">
            {is404 ? "Could not locate any parsed projects. Make sure to upload a comprehensive resume." : error}
          </p>
          <a
            href="/resume"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition"
          >
            Upload Resume
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1f2833]/20 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <FolderGit2 className="h-7 w-7 text-blue-400" />
              Project Portfolio & Recommendations
            </h1>
            <p className="text-sm text-[#c5c6c7]/65 mt-1">
              Parsed details from your resume coupled with custom engineering project recommendations.
            </p>
          </div>
          
          <div className="flex bg-[#0f111a] border border-[#1f2833]/50 rounded-lg p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("current")}
              className={`px-4 py-2 rounded-md transition ${activeTab === "current" ? "bg-blue-600 text-white" : "text-[#c5c6c7]/60 hover:text-white"}`}
            >
              Resume Projects
            </button>
            <button
              onClick={() => setActiveTab("recommendations")}
              className={`px-4 py-2 rounded-md transition ${activeTab === "recommendations" ? "bg-blue-600 text-white" : "text-[#c5c6c7]/60 hover:text-white"}`}
            >
              AI Suggestions
            </button>
          </div>
        </div>

        {activeTab === "current" ? (
          /* Projects parsed from Resume */
          projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj, idx) => (
                <div 
                  key={idx} 
                  className="group relative flex flex-col justify-between rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 hover:border-blue-500/30 transition-all duration-200"
                >
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-blue-500/0 group-hover:bg-blue-500/5 blur-[30px] transition-all duration-300 pointer-events-none"></div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                        {proj.title}
                      </h2>
                      <FolderGit2 className="h-5 w-5 text-gray-500 group-hover:text-blue-500 transition" />
                    </div>
                    
                    <p className="text-sm text-[#c5c6c7]/75 leading-relaxed">
                      {proj.description}
                    </p>

                    {proj.skills && proj.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {proj.skills.map((skill) => (
                          <span 
                            key={skill} 
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-[#1f2833]/30 text-[#c5c6c7] border border-[#1f2833]/50"
                          >
                            <Cpu className="h-2.5 w-2.5 text-gray-500" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-6 border-t border-[#1f2833]/25 pt-4 text-xs font-semibold">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-gray-400 hover:text-white transition"
                      >
                        <GithubIcon className="h-4 w-4" />
                        Code Repository
                        <ExternalLink className="h-3 w-3 text-gray-500" />
                      </a>
                    )}

                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition"
                      >
                        Live Deployment
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    
                    {!proj.githubUrl && !proj.liveUrl && (
                      <span className="text-gray-500 italic font-normal">No links provided.</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#1f2833]/20 bg-[#0f111a]/40 p-12 text-center max-w-xl mx-auto">
              <FolderGit2 className="h-10 w-10 text-gray-500 mx-auto mb-4" />
              <h2 className="text-base font-bold text-white mb-2">No Projects Detected</h2>
              <p className="text-xs text-gray-500 mb-6">We couldn&apos;t locate any projects parsed in your profile. Make sure to upload a comprehensive resume.</p>
              <Link
                href="/resume"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition"
              >
                Analyze Resume
              </Link>
            </div>
          )
        ) : (
          /* AI Suggestions Tab */
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-[#0f111a] border border-[#1f2833]/30 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-semibold text-[#c5c6c7]/80">Regenerate tiered project recommendations using Gemini API</span>
              </div>
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${isRegenerating ? "animate-spin" : ""}`} />
                {isRegenerating ? "Generating..." : "Regenerate Suggestions"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Beginner */}
              <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 space-y-4">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#1f2833]/20 pb-3">
                  <Trophy className="h-4 w-4 text-emerald-400" />
                  Beginner Projects
                </h3>
                {recommendations.beginner && recommendations.beginner.map((rec, i) => (
                  <div key={i} className="space-y-2 border-b border-[#1f2833]/10 pb-3 last:border-b-0">
                    <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                    <p className="text-xs text-[#c5c6c7]/75 leading-relaxed">{rec.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.skills && rec.skills.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-emerald-950/15 text-emerald-400 border border-emerald-500/10 text-[9px] font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Intermediate */}
              <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 space-y-4">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#1f2833]/20 pb-3">
                  <Trophy className="h-4 w-4 text-blue-400" />
                  Intermediate Projects
                </h3>
                {recommendations.intermediate && recommendations.intermediate.map((rec, i) => (
                  <div key={i} className="space-y-2 border-b border-[#1f2833]/10 pb-3 last:border-b-0">
                    <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                    <p className="text-xs text-[#c5c6c7]/75 leading-relaxed">{rec.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.skills && rec.skills.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-blue-950/15 text-blue-400 border border-blue-500/10 text-[9px] font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Advanced */}
              <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 space-y-4">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#1f2833]/20 pb-3">
                  <Trophy className="h-4 w-4 text-purple-400" />
                  Advanced Projects
                </h3>
                {recommendations.advanced && recommendations.advanced.map((rec, i) => (
                  <div key={i} className="space-y-2 border-b border-[#1f2833]/10 pb-3 last:border-b-0">
                    <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                    <p className="text-xs text-[#c5c6c7]/75 leading-relaxed">{rec.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.skills && rec.skills.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-purple-950/15 text-purple-400 border border-purple-500/10 text-[9px] font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

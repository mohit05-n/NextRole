"use client";

import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { fetchFromAPI } from "@/services/api";
import Link from "next/link";
import { Map, Clock, ChevronRight, AlertCircle, Target, Sparkles, RefreshCw } from "lucide-react";

interface RoadmapPhase {
  title: string;
  description: string;
  duration: string;
  skillsToLearn: string[];
  steps: string[];
}

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    async function loadRoadmap() {
      try {
        const result = await fetchFromAPI("/roadmap");
        setRoadmap(result?.data?.roadmap || []);
      } catch (err: any) {
        setError(err.message || "Failed to load career roadmap data");
      } finally {
        setIsLoading(false);
      }
    }
    loadRoadmap();
  }, []);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const result = await fetchFromAPI("/roadmap/generate", { method: "POST" });
      setRoadmap(result?.data?.roadmap || []);
    } catch (err: any) {
      alert("Failed to regenerate roadmap: " + err.message);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-[#c5c6c7]/50 text-sm">Generating your personalized career roadmap...</p>
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
              NextRole is ready, but it is currently configured with placeholder AWS resource values. Please update your `.env.local` configuration to connect to your live AWS stack and retrieve your career roadmap.
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
          <h2 className="text-lg font-bold text-white mb-2">{is404 ? "No Roadmap Profile Found" : "Error Loading Roadmap"}</h2>
          <p className="text-sm text-red-300/80 mb-6">
            {is404 ? "Could not build your career roadmap. Make sure to upload a comprehensive resume." : error}
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
              <Map className="h-7 w-7 text-blue-400" />
              AI Career Roadmap
            </h1>
            <p className="text-sm text-[#c5c6c7]/65 mt-1 flex items-center gap-1">
              A step-by-step career path acceleration guide constructed dynamically.
            </p>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1f2833]/30 hover:bg-[#1f2833]/60 text-[#c5c6c7] border border-[#1f2833]/50 rounded-lg text-xs font-semibold transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isRegenerating ? "animate-spin" : ""}`} />
            {isRegenerating ? "Regenerating..." : "Regenerate Roadmap"}
          </button>
        </div>

        {/* Visual Roadmap Flow */}
        {roadmap.length > 0 ? (
          <div className="relative border-l border-blue-500/20 pl-6 md:pl-10 space-y-12 ml-4 md:ml-8 py-4">
            {roadmap.map((phase, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[35px] md:-left-[51px] top-1 h-8 w-8 md:h-10 md:w-10 rounded-full border-4 border-blue-500 bg-[#0f111a] flex items-center justify-center text-xs md:text-sm font-bold text-blue-400 shadow-md shadow-blue-500/10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {idx + 1}
                </div>

                <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 hover:border-blue-500/20 transition-all duration-200 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#1f2833]/15 pb-4">
                    <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                      {phase.title}
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-semibold bg-blue-500/5 border border-blue-500/10 px-3 py-1.5 rounded-full shrink-0">
                      <Clock className="h-3.5 w-3.5" />
                      {phase.duration}
                    </span>
                  </div>

                  <p className="text-sm text-[#c5c6c7]/75 leading-relaxed">
                    {phase.description}
                  </p>

                  {phase.skillsToLearn && phase.skillsToLearn.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#c5c6c7]/50 flex items-center gap-1.5">
                        <Target className="h-3.5 w-3.5 text-blue-500" />
                        Target Technologies & Core Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {phase.skillsToLearn.map((skill) => (
                          <span 
                            key={skill} 
                            className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-blue-950/20 text-blue-400 border border-blue-500/10"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {phase.steps && phase.steps.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#c5c6c7]/50">
                        Actionable Milestones
                      </h3>
                      <ul className="space-y-2.5">
                        {phase.steps.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2.5 text-sm text-[#c5c6c7]/85">
                            <ChevronRight className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[#1f2833]/20 bg-[#0f111a]/40 p-12 text-center max-w-xl mx-auto">
            <Map className="h-10 w-10 text-gray-500 mx-auto mb-4" />
            <h2 className="text-base font-bold text-white mb-2">Roadmap Not Ready</h2>
            <p className="text-xs text-gray-500 mb-6">We could not build your roadmap because no profile exists. Upload your resume to generate career suggestions.</p>
            <Link
              href="/resume"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition"
            >
              Analyze Resume
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}

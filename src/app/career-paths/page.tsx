"use client";

import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { fetchFromAPI } from "@/services/api";
import { Compass, Milestone, TrendingUp, DollarSign, Brain, Award, AlertCircle } from "lucide-react";

export default function CareerPathsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await fetchFromAPI("/profile");
        setProfile(result.data);
      } catch (err: any) {
        setError("Please upload your resume to build customized career trajectories.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const trajectories = [
    {
      role: "AWS Cloud Solutions Architect",
      salary: "$135,000 - $185,000",
      demand: "Critical",
      difficulty: "Advanced",
      skillsNeeded: ["AWS IAM", "CloudFormation", "System Design", "Networking", "Security"],
      certifications: ["AWS Cloud Practitioner", "AWS Solutions Architect Associate", "AWS Solutions Architect Professional"],
      description: "Design and implement highly available, cost-effective, and secure applications on the AWS platform."
    },
    {
      role: "DevSecOps Engineer",
      salary: "$120,000 - $170,000",
      demand: "High",
      difficulty: "Intermediate",
      skillsNeeded: ["CI/CD Pipelines", "Docker", "Kubernetes", "AWS CodePipeline", "Terraform"],
      certifications: ["AWS Developer Associate", "AWS DevOps Engineer Professional", "AWS Security Specialty"],
      description: "Automate delivery pipelines, maintain infrastructure compliance, and integrate security tooling directly into developer systems."
    },
    {
      role: "Serverless Solutions Developer",
      salary: "$115,000 - $160,000",
      demand: "Very High",
      difficulty: "Intermediate",
      skillsNeeded: ["AWS Lambda", "API Gateway", "DynamoDB", "Cognito", "TypeScript/NodeJS"],
      certifications: ["AWS Developer Associate", "AWS SysOps Administrator Associate", "AWS Certified Advanced Networking"],
      description: "Build scalable web and mobile backend endpoints using zero-management compute runtimes and serverless storage engines."
    }
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-[#c5c6c7]/50 text-sm">Mapping career paths...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Title */}
        <div className="border-b border-[#1f2833]/20 pb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Compass className="h-7 w-7 text-blue-400" />
            Career Trajectory Explorer
          </h1>
          <p className="text-sm text-[#c5c6c7]/65 mt-1">Explore different professional milestones, salary trends, and certificate trajectories.</p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-950/10 p-4 text-xs text-red-300 max-w-xl mx-auto">
            <AlertCircle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {trajectories.map((path, index) => (
            <div key={index} className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 hover:border-blue-500/20 transition-all duration-200 space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f2833]/15 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
                    <Milestone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{path.role}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{path.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/5 text-blue-400 border border-blue-500/10 rounded-full">
                    <DollarSign className="h-3.5 w-3.5" />
                    {path.salary}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 rounded-full">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {path.demand} Demand
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/5 text-purple-400 border border-purple-500/10 rounded-full">
                    <Brain className="h-3.5 w-3.5" />
                    {path.difficulty}
                  </span>
                </div>
              </div>

              {/* Trajectory Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm">
                {/* Tech Skills Gap */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#c5c6c7]/50">Primary Competencies Needed</h4>
                  <div className="flex flex-wrap gap-2">
                    {path.skillsNeeded.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 rounded bg-[#0b0c13] border border-[#1f2833]/30 text-[#c5c6c7]/80">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Target Certs Map */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#c5c6c7]/50">Sequential Certificate Timeline</h4>
                  <div className="flex flex-col gap-2">
                    {path.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <div className="h-5 w-5 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </div>
                        <Award className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                        <span className="text-white font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

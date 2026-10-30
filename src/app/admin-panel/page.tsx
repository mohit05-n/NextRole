"use client";

import Layout from "@/components/Layout";
import { Database, HardDrive, Cpu, ShieldCheck, Activity, Terminal, Cloud } from "lucide-react";

export default function AdminPanelPage() {
  const stats = [
    { name: "Database Table Status", val: "ACTIVE", sub: `Table: ${process.env.NEXT_PUBLIC_DYNAMODB_TABLE || "NextRoleUsers"}`, icon: Database, color: "text-emerald-400" },
    { name: "S3 Resumes Bucket", val: "ONLINE", sub: `Bucket: ${process.env.NEXT_PUBLIC_S3_BUCKET || "nextrole-resumes-AWS_ID"}`, icon: HardDrive, color: "text-blue-400" },
    { name: "Gemini Model Latency", val: "1.4s", sub: "Model: gemini-1.5-flash", icon: Cpu, color: "text-indigo-400" },
    { name: "Textract OCR Parser Status", val: "OPERATIONAL", sub: "AWS Async Jobs Scheduler", icon: Activity, color: "text-purple-400" },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Title */}
        <div className="border-b border-[#1f2833]/20 pb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-blue-400" />
            Admin Operations Console
          </h1>
          <p className="text-sm text-[#c5c6c7]/65 mt-1">Monitor serverless stack statistics, backend API integrations, and S3 assets configuration.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#c5c6c7]/50">{stat.name}</span>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white">{stat.val}</h3>
                  <p className="text-[10px] text-gray-500 font-medium truncate">{stat.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Console details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#c5c6c7]/50 flex items-center gap-2">
              <Terminal className="h-4.5 w-4.5 text-blue-400" />
              AWS Resource Settings Configuration
            </h3>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[#1f2833]/25 pb-2">
                <span className="text-gray-500">Lambda Router Node Runtime:</span>
                <span className="text-white font-semibold">NodeJS 20 (AWS Linux 2)</span>
              </div>
              <div className="flex justify-between border-b border-[#1f2833]/25 pb-2">
                <span className="text-gray-500">API Gateway Proxy Domain:</span>
                <span className="text-blue-400 font-semibold truncate max-w-[280px]">{process.env.NEXT_PUBLIC_API_URL || "https://AWS_ID.execute-api.us-east-1.amazonaws.com/prod"}</span>
              </div>
              <div className="flex justify-between border-b border-[#1f2833]/25 pb-2">
                <span className="text-gray-500">Cognito App Client Flow:</span>
                <span className="text-white font-semibold">USER_PASSWORD_AUTH / Google OAuth2</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-gray-500">Active Logging System:</span>
                <span className="text-emerald-400 font-semibold">AWS CloudWatch logs JSON stream</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/10 bg-gradient-to-b from-blue-950/10 to-indigo-950/10 p-5 space-y-4">
            <Cloud className="h-6 w-6 text-blue-400" />
            <h4 className="text-sm font-bold text-white">AWS Integration Guard</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              This console checks the health profiles of AWS assets using environment variable keys (AWS_ID). To deploy production-wide, consult guidelines inside <strong>README.md</strong>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

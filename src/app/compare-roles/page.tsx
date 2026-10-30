"use client";

import Layout from "@/components/Layout";
import { useState } from "react";
import { GitCompare, Sparkles, Scale, Briefcase, TrendingUp, DollarSign, Award, Check } from "lucide-react";

interface RoleComparison {
  role: string;
  salary: string;
  demand: string;
  stack: string[];
  roadmap: string;
  pros: string[];
  focus: string;
}

export default function CompareRolesPage() {
  const [roleA, setRoleA] = useState("solutions-architect");
  const [roleB, setRoleB] = useState("devops");

  const comparisonData: Record<string, RoleComparison> = {
    "solutions-architect": {
      role: "Solutions Architect",
      salary: "$150,000",
      demand: "Critical",
      stack: ["AWS Architecture", "CloudFormation", "Terraform", "System Design", "Security"],
      roadmap: "12-18 Months",
      pros: ["High salaries", "Strong leadership roles", "Strategic technical decision making"],
      focus: "Designing high-level network topology, scalability, disaster recovery, and cost optimizations."
    },
    "devops": {
      role: "DevOps Engineer",
      salary: "$140,000",
      demand: "Very High",
      stack: ["CI/CD Pipelines", "Docker", "Kubernetes", "Shell Scripting", "GitHub Actions"],
      roadmap: "9-12 Months",
      pros: ["High market demand", "Automation-focused work", "Sought-after by modern startups"],
      focus: "Bridging code delivery systems with target compute platforms, maintaining pipeline automations."
    },
    "full-stack": {
      role: "Full-Stack Developer",
      salary: "$125,000",
      demand: "High",
      stack: ["TypeScript", "Next.js", "Node.js", "Tailwind CSS", "DynamoDB"],
      roadmap: "6-9 Months",
      pros: ["Highly versatile", "Build complete applications independently", "High volume of job postings"],
      focus: "Implementing browser-side interface designs and structuring backend data APIs."
    }
  };

  const aDetails = comparisonData[roleA] || comparisonData["solutions-architect"];
  const bDetails = comparisonData[roleB] || comparisonData["devops"];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Title */}
        <div className="border-b border-[#1f2833]/20 pb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <GitCompare className="h-7 w-7 text-blue-400" />
            Compare Professional Roles
          </h1>
          <p className="text-sm text-[#c5c6c7]/65 mt-1">Select and compare career pathways, typical stacks, and timeline complexity side-by-side.</p>
        </div>

        {/* Role Selection Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0f111a] border border-[#1f2833]/30 rounded-xl p-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">First Target Pathway</label>
            <select
              value={roleA}
              onChange={(e) => setRoleA(e.target.value)}
              className="w-full bg-[#07080d] border border-[#1f2833]/50 focus:border-blue-500/50 rounded-xl py-3 px-4 text-xs md:text-sm text-white focus:outline-none transition"
            >
              <option value="solutions-architect">Solutions Architect</option>
              <option value="devops">DevOps Engineer</option>
              <option value="full-stack">Full-Stack Developer</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Second Target Pathway</label>
            <select
              value={roleB}
              onChange={(e) => setRoleB(e.target.value)}
              className="w-full bg-[#07080d] border border-[#1f2833]/50 focus:border-blue-500/50 rounded-xl py-3 px-4 text-xs md:text-sm text-white focus:outline-none transition"
            >
              <option value="solutions-architect">Solutions Architect</option>
              <option value="devops">DevOps Engineer</option>
              <option value="full-stack">Full-Stack Developer</option>
            </select>
          </div>
        </div>

        {/* Side-by-Side Table Panel */}
        <div className="rounded-xl border border-[#1f2833]/45 bg-[#0f111a] overflow-hidden">
          <div className="grid grid-cols-3 bg-[#0b0c13]/60 border-b border-[#1f2833]/20 p-4 text-xs font-bold uppercase tracking-wider text-[#c5c6c7]/50">
            <div>Comparison Metric</div>
            <div>{aDetails.role}</div>
            <div>{bDetails.role}</div>
          </div>

          {/* Average Base Salary */}
          <div className="grid grid-cols-3 border-b border-[#1f2833]/15 p-4 items-center">
            <div className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-blue-400" />
              Avg. Salary
            </div>
            <div className="text-sm font-black text-white">{aDetails.salary}</div>
            <div className="text-sm font-black text-white">{bDetails.salary}</div>
          </div>

          {/* Market Demand */}
          <div className="grid grid-cols-3 border-b border-[#1f2833]/15 p-4 items-center">
            <div className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Market Demand
            </div>
            <div>
              <span className="px-2.5 py-1 bg-emerald-950/15 text-emerald-400 border border-emerald-500/10 rounded-full text-[10px] font-bold uppercase tracking-wider">{aDetails.demand}</span>
            </div>
            <div>
              <span className="px-2.5 py-1 bg-emerald-950/15 text-emerald-400 border border-emerald-500/10 rounded-full text-[10px] font-bold uppercase tracking-wider">{bDetails.demand}</span>
            </div>
          </div>

          {/* Technical Stacks */}
          <div className="grid grid-cols-3 border-b border-[#1f2833]/15 p-4">
            <div className="text-xs font-bold text-gray-500 flex items-center gap-1.5 mt-1.5">
              <Scale className="h-4 w-4 text-purple-400" />
              Technology Stacks
            </div>
            <div className="flex flex-wrap gap-1">
              {aDetails.stack.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded bg-blue-950/20 text-blue-400 border border-blue-500/10 text-[9px] font-semibold">{s}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {bDetails.stack.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded bg-blue-950/20 text-blue-400 border border-blue-500/10 text-[9px] font-semibold">{s}</span>
              ))}
            </div>
          </div>

          {/* Study Roadmap Target Length */}
          <div className="grid grid-cols-3 border-b border-[#1f2833]/15 p-4 items-center">
            <div className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-indigo-400" />
              Roadmap Timeline
            </div>
            <div className="text-xs text-[#c5c6c7] font-semibold">{aDetails.roadmap}</div>
            <div className="text-xs text-[#c5c6c7] font-semibold">{bDetails.roadmap}</div>
          </div>

          {/* Core Focus Area */}
          <div className="grid grid-cols-3 border-b border-[#1f2833]/15 p-4 text-xs md:text-sm">
            <div className="text-xs font-bold text-gray-500 flex items-center gap-1.5 mt-0.5">
              <Briefcase className="h-4 w-4 text-yellow-400" />
              Core Focus
            </div>
            <div className="text-xs text-[#c5c6c7]/85 leading-relaxed pr-4">{aDetails.focus}</div>
            <div className="text-xs text-[#c5c6c7]/85 leading-relaxed pr-4">{bDetails.focus}</div>
          </div>

          {/* Key Advantages */}
          <div className="grid grid-cols-3 p-4 text-xs md:text-sm">
            <div className="text-xs font-bold text-gray-500 flex items-center gap-1.5 mt-0.5">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Key Benefits
            </div>
            <div className="space-y-1.5">
              {aDetails.pros.map((p, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-gray-400">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {bDetails.pros.map((p, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-gray-400">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

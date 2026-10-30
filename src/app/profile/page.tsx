"use client";

import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { fetchFromAPI } from "@/services/api";
import { 
  User, 
  Mail, 
  GraduationCap, 
  Briefcase, 
  Terminal, 
  Calendar,
  AlertCircle,
  Phone,
  MapPin,
  FileText,
  Edit2,
  Save,
  X
} from "lucide-react";

interface Education {
  degree: string;
  fieldOfStudy: string;
  school: string;
  startYear: string;
  endYear: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  skillsUsed: string[];
}

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  summary?: string;
  targetRole?: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  achievements?: string[];
  languages?: string[];
  softSkills?: string[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit form states
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [editedSummary, setEditedSummary] = useState("");
  const [editedTargetRole, setEditedTargetRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await fetchFromAPI("/profile");
        // Read data property with null safety
        const prof = result?.data;
        if (!prof) {
          throw new Error("404: Profile not found. Please upload your resume first.");
        }
        setProfile(prof);
        
        // Initialize form fields
        setEditedName(prof.name || "");
        setEditedPhone(prof.phone || "");
        setEditedLocation(prof.location || "");
        setEditedSummary(prof.summary || "");
        setEditedTargetRole(prof.targetRole || "");
      } catch (err: any) {
        setError(err.message || "Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    setError(null);

    const updatedPayload = {
      name: editedName,
      phone: editedPhone,
      location: editedLocation,
      summary: editedSummary,
      targetRole: editedTargetRole
    };

    try {
      const result = await fetchFromAPI("/profile", {
        method: "PUT",
        body: JSON.stringify(updatedPayload)
      });
      
      setProfile(result?.data || profile);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-[#c5c6c7]/50 text-sm">Retrieving profile from DynamoDB...</p>
        </div>
      </Layout>
    );
  }

  if (error && !profile) {
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
              NextRole is ready, but it is currently configured with placeholder AWS resource values. Please update your `.env.local` configuration to connect to your live AWS stack and retrieve profiles.
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
          <h2 className="text-lg font-bold text-white mb-2">{is404 ? "No Active Profile Found" : "Error Loading Profile"}</h2>
          <p className="text-sm text-red-300/80 mb-6">
            {is404 ? "Could not retrieve your user profile from the database. Have you uploaded your resume yet?" : error}
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

  if (!profile) {
    return (
      <Layout>
        <div className="rounded-xl border border-red-500/20 bg-red-950/10 p-6 text-center max-w-xl mx-auto mt-10">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">No Active Profile Found</h2>
          <p className="text-sm text-red-300/80 mb-6">
            Could not retrieve your user profile from the database. Have you uploaded your resume yet?
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
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1f2833]/20 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
              <User className="h-8 w-8" />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-[#0b0c10] border border-blue-500/40 rounded px-2.5 py-1 text-xl font-bold text-white focus:outline-none"
                />
              ) : (
                <h1 className="text-2xl md:text-3xl font-bold text-white">{profile.name}</h1>
              )}
              
              <p className="text-sm text-[#c5c6c7]/65 flex items-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5 text-gray-500" />
                {profile.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition duration-150 disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedName(profile.name);
                    setEditedPhone(profile.phone || "");
                    setEditedLocation(profile.location || "");
                    setEditedSummary(profile.summary || "");
                    setEditedTargetRole(profile.targetRole || "");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#1f2833]/30 hover:bg-[#1f2833]/60 text-gray-400 transition duration-150"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition duration-150"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Skills & Details */}
          <div className="space-y-6">
            {/* Meta Card Contact Details */}
            <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#c5c6c7]/50">Contact Information</h2>
              
              <div className="space-y-3.5 text-xs text-gray-400">
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4.5 w-4.5 text-blue-400 shrink-0" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      className="bg-[#0b0c10] border border-blue-500/40 rounded px-2 py-1 text-white focus:outline-none w-full"
                    />
                  ) : (
                    <span>{profile.phone || "Not provided"}</span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4.5 w-4.5 text-blue-400 shrink-0" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedLocation}
                      onChange={(e) => setEditedLocation(e.target.value)}
                      className="bg-[#0b0c10] border border-blue-500/40 rounded px-2 py-1 text-white focus:outline-none w-full"
                    />
                  ) : (
                    <span>{profile.location || "Not provided"}</span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 border-t border-[#1f2833]/20 pt-3 text-gray-500">
                  <Briefcase className="h-4.5 w-4.5 shrink-0" />
                  <div className="w-full">
                    <span className="block text-[10px] uppercase font-bold text-gray-500">Target Role</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedTargetRole}
                        onChange={(e) => setEditedTargetRole(e.target.value)}
                        className="bg-[#0b0c10] border border-blue-500/40 rounded px-2 py-1 text-white focus:outline-none w-full mt-1"
                      />
                    ) : (
                      <span className="text-[#c5c6c7] font-semibold">{profile.targetRole || "Not Specified"}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Core Info */}
            <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#c5c6c7]/50 mb-4 flex items-center gap-2">
                <Terminal className="h-4.5 w-4.5 text-blue-400" />
                Technical Competencies
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1f2833]/20 text-[#c5c6c7] border border-[#1f2833]/40"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            {profile.softSkills && profile.softSkills.length > 0 && (
              <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#c5c6c7]/50 mb-3">Soft Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                  {profile.softSkills.map((sk) => (
                    <span key={sk} className="px-2.5 py-1 rounded text-xs bg-indigo-950/20 text-indigo-400 border border-indigo-500/20">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && (
              <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#c5c6c7]/50 mb-3">Languages</h2>
                <div className="flex flex-wrap gap-1.5">
                  {profile.languages.map((lng) => (
                    <span key={lng} className="px-2.5 py-1 rounded text-xs bg-emerald-950/20 text-emerald-400 border border-emerald-500/20">
                      {lng}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Info - Experience and Education */}
          <div className="lg:col-span-2 space-y-8">
            {/* Summary */}
            <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#c5c6c7]/50 mb-3 flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-blue-400" />
                Professional Summary
              </h2>
              {isEditing ? (
                <textarea
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  rows={4}
                  className="w-full bg-[#0b0c10] border border-blue-500/40 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <p className="text-sm text-[#c5c6c7]/85 leading-relaxed">{profile.summary || "No summary provided."}</p>
              )}
            </div>

            {/* Achievements */}
            {profile.achievements && profile.achievements.length > 0 && (
              <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#c5c6c7]/50 mb-3">Achievements & Highlights</h2>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-[#c5c6c7]/85">
                  {profile.achievements.map((ach, index) => (
                    <li key={index}>{ach}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Experience Timeline */}
            <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 md:p-8">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2.5">
                <Briefcase className="h-5 w-5 text-blue-400" />
                Professional Work Experience
              </h2>
              
              <div className="relative border-l border-[#1f2833]/40 pl-6 space-y-8 ml-3">
                {profile.experience && profile.experience.length > 0 ? (
                  profile.experience.map((job, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-blue-500 bg-[#0b0c10] group-hover:bg-blue-400 transition duration-150"></div>
                      
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <h3 className="text-base font-bold text-white">{job.position}</h3>
                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <Calendar className="h-3.5 w-3.5" />
                            {job.startDate} — {job.endDate}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-blue-400">{job.company}</p>
                        <p className="text-sm text-[#c5c6c7]/75 leading-relaxed">{job.description}</p>
                        
                        {job.skillsUsed && job.skillsUsed.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {job.skillsUsed.map((sk) => (
                              <span key={sk} className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-950/20 text-blue-400 border border-blue-500/10">
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No work experience identified.</p>
                )}
              </div>
            </div>

            {/* Education Timeline */}
            <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 md:p-8">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2.5">
                <GraduationCap className="h-5 w-5 text-blue-400" />
                Educational Credentials
              </h2>
              
              <div className="relative border-l border-[#1f2833]/40 pl-6 space-y-8 ml-3">
                {profile.education && profile.education.length > 0 ? (
                  profile.education.map((edu, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-indigo-500 bg-[#0b0c10] group-hover:bg-indigo-400 transition duration-150"></div>
                      
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <h3 className="text-base font-bold text-white">{edu.degree}</h3>
                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <Calendar className="h-3.5 w-3.5" />
                            {edu.startYear} — {edu.endYear}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-indigo-400">{edu.fieldOfStudy}</p>
                        <p className="text-sm text-[#c5c6c7]/85">{edu.school}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No educational records identified.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

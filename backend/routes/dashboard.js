const { getProfileByEmail } = require("../services/dynamodb");
const { successResponse } = require("../utils/response");
const { NotFoundError } = require("../utils/errors");

async function getDashboard(email) {
  const profile = await getProfileByEmail(email);
  if (!profile) {
    throw new NotFoundError("Profile not found. Please upload your resume first.");
  }

  const roadmapProgress = profile.roadmap?.length 
    ? Math.round(((profile.roadmap.filter((p) => p.completed).length) / profile.roadmap.length) * 100) 
    : 0;

  const dashboardData = {
    name: profile.name,
    targetRole: profile.targetRole || "Not Specified",
    skills: profile.skills || [],
    projects: profile.projects || [],
    certifications: profile.certifications || [],
    roadmapProgress: roadmapProgress,
    resumeScore: profile.resumeScore || 0,
    atsScore: profile.atsScore || 0,
    email: profile.email
  };

  return successResponse("Dashboard metrics fetched successfully", dashboardData);
}

module.exports = {
  getDashboard
};

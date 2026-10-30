const { getProfileByEmail, putProfile } = require("../services/dynamodb");
const { generateProjectRecommendationsWithGemini } = require("../services/gemini");
const { successResponse } = require("../utils/response");
const { NotFoundError } = require("../utils/errors");

async function getProjects(email) {
  const profile = await getProfileByEmail(email);
  if (!profile) {
    throw new NotFoundError("Profile not found.");
  }
  return successResponse("Projects and recommendations fetched successfully", {
    projects: profile.projects || [],
    recommendations: profile.projectRecommendations || { beginner: [], intermediate: [], advanced: [] }
  });
}

async function generateProjects(email) {
  const profile = await getProfileByEmail(email);
  if (!profile) {
    throw new NotFoundError("Profile not found. Please upload a resume first.");
  }

  const recommendations = await generateProjectRecommendationsWithGemini(
    profile.skills || []
  );

  profile.projectRecommendations = recommendations;
  await putProfile(profile);

  return successResponse("Project recommendations generated and saved successfully", recommendations);
}

module.exports = {
  getProjects,
  generateProjects
};

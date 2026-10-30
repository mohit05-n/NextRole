const { getProfileByEmail, putProfile } = require("../services/dynamodb");
const { generateRoadmapWithGemini } = require("../services/gemini");
const { successResponse } = require("../utils/response");
const { NotFoundError } = require("../utils/errors");

async function getRoadmap(email) {
  const profile = await getProfileByEmail(email);
  if (!profile) {
    throw new NotFoundError("Profile not found.");
  }
  return successResponse("Roadmap fetched successfully", { roadmap: profile.roadmap || [] });
}

async function generateRoadmap(email) {
  const profile = await getProfileByEmail(email);
  if (!profile) {
    throw new NotFoundError("Profile not found. Please upload a resume first.");
  }

  const generatedRoadmap = await generateRoadmapWithGemini(
    profile.skills || [],
    profile.experience || [],
    profile.targetRole || "Software Engineer"
  );

  profile.roadmap = generatedRoadmap;
  await putProfile(profile);

  return successResponse("Roadmap generated and saved successfully", { roadmap: generatedRoadmap });
}

module.exports = {
  getRoadmap,
  generateRoadmap
};

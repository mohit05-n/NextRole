const { getProfileByEmail, putProfile } = require("../services/dynamodb");
const { generateCertificationRecommendationsWithGemini } = require("../services/gemini");
const { successResponse } = require("../utils/response");
const { NotFoundError } = require("../utils/errors");

async function getCertifications(email) {
  const profile = await getProfileByEmail(email);
  if (!profile) {
    throw new NotFoundError("Profile not found.");
  }
  return successResponse("Certifications and recommendations fetched successfully", {
    certifications: profile.certifications || [],
    recommendations: profile.certificationRecommendations || []
  });
}

async function generateCertifications(email) {
  const profile = await getProfileByEmail(email);
  if (!profile) {
    throw new NotFoundError("Profile not found. Please upload a resume first.");
  }

  const recommendations = await generateCertificationRecommendationsWithGemini(
    profile.skills || [],
    profile.targetRole || "Software Engineer",
    profile.summary || ""
  );

  profile.certificationRecommendations = recommendations;
  await putProfile(profile);

  return successResponse("Certification recommendations generated and saved successfully", {
    recommendations
  });
}

module.exports = {
  getCertifications,
  generateCertifications
};

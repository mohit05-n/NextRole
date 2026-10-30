const { getProfileByEmail, putProfile } = require("../services/dynamodb");
const { successResponse } = require("../utils/response");
const { NotFoundError, BadRequestError } = require("../utils/errors");

async function getProfile(email) {
  const profile = await getProfileByEmail(email);
  if (!profile) {
    throw new NotFoundError("Profile not found in DynamoDB. Please upload your resume first.");
  }
  return successResponse("Profile fetched successfully", profile);
}

async function updateProfile(email, body) {
  if (!body) {
    throw new BadRequestError("Missing request body.");
  }

  let updates;
  try {
    updates = JSON.parse(body);
  } catch (err) {
    throw new BadRequestError("Invalid JSON in request body.");
  }

  const existingProfile = await getProfileByEmail(email);
  if (!existingProfile) {
    throw new NotFoundError("Profile does not exist. Please upload your resume to initialize your account.");
  }

  const updatedProfile = {
    ...existingProfile,
    name: updates.name ?? existingProfile.name,
    phone: updates.phone ?? existingProfile.phone,
    location: updates.location ?? existingProfile.location,
    summary: updates.summary ?? existingProfile.summary,
    skills: updates.skills ?? existingProfile.skills,
    education: updates.education ?? existingProfile.education,
    experience: updates.experience ?? existingProfile.experience,
    projects: updates.projects ?? existingProfile.projects,
    certifications: updates.certifications ?? existingProfile.certifications,
    achievements: updates.achievements ?? existingProfile.achievements,
    languages: updates.languages ?? existingProfile.languages,
    softSkills: updates.softSkills ?? existingProfile.softSkills,
    targetRole: updates.targetRole ?? existingProfile.targetRole,
    atsScore: updates.atsScore ?? existingProfile.atsScore,
    resumeScore: updates.resumeScore ?? existingProfile.resumeScore,
    lastUploadDate: existingProfile.lastUploadDate
  };

  await putProfile(updatedProfile);

  return successResponse("Profile updated successfully in DynamoDB", updatedProfile);
}

module.exports = {
  getProfile,
  updateProfile
};

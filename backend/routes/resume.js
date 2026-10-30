const { uploadResumeToS3, parseS3Url } = require("../services/s3");
const { extractTextFromDocument } = require("../services/textract");
const { 
  parseResumeWithGemini,
  generateRoadmapWithGemini,
  generateProjectRecommendationsWithGemini,
  generateCertificationRecommendationsWithGemini
} = require("../services/gemini");
const { getProfileByEmail, putProfile } = require("../services/dynamodb");
const { successResponse } = require("../utils/response");
const { BadRequestError, NotFoundError } = require("../utils/errors");

async function getResume(email) {
  const profile = await getProfileByEmail(email);
  if (!profile) {
    throw new NotFoundError("Profile not found. Please upload your resume first.");
  }
  return successResponse("Resume details fetched successfully", {
    s3Url: profile.s3Url || null,
    resumeText: profile.resumeText || null,
    name: profile.name || null,
    lastUploadDate: profile.lastUploadDate || null
  });
}

async function uploadResume(email, body) {
  if (!body) {
    throw new BadRequestError("Missing request body.");
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(body);
  } catch (err) {
    throw new BadRequestError("Invalid JSON in request body.");
  }

  const { pdf, fileName } = parsedBody;
  if (!pdf) {
    throw new BadRequestError("Missing 'pdf' field containing base64 data.");
  }

  const fileBuffer = Buffer.from(pdf, "base64");
  const s3Url = await uploadResumeToS3(email, fileName || "resume.pdf", fileBuffer);

  // Parse the S3 URL to extract bucket name and object key for Textract
  const { bucket: s3Bucket, key: s3Key } = parseS3Url(s3Url);
  const rawText = await extractTextFromDocument(s3Bucket, s3Key);

  const parsedData = await parseResumeWithGemini(rawText, email);

  const roadmap = await generateRoadmapWithGemini(
    parsedData.skills || [],
    parsedData.experience || [],
    parsedData.targetRole || "Software Engineer"
  );

  const projectRecommendations = await generateProjectRecommendationsWithGemini(
    parsedData.skills || []
  );

  const certificationRecommendations = await generateCertificationRecommendationsWithGemini(
    parsedData.skills || [],
    parsedData.targetRole || "Software Engineer",
    parsedData.summary || ""
  );

  const fullProfile = {
    ...parsedData,
    email,
    resumeText: rawText,
    s3Url,
    lastUploadDate: new Date().toISOString().split("T")[0],
    roadmap,
    projectRecommendations,
    certificationRecommendations
  };

  await putProfile(fullProfile);

  return successResponse("Resume processed and profile saved successfully", fullProfile);
}

module.exports = {
  uploadResume,
  getResume
};

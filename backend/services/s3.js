const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { BadRequestError } = require("../utils/errors");

const s3Client = new S3Client({});
const BUCKET_NAME = process.env.S3_BUCKET || "nextrole-resumes";

async function uploadResumeToS3(email, fileName, buffer) {
  const maxBytes = 5 * 1024 * 1024;
  if (buffer.length > maxBytes) {
    throw new BadRequestError(`File size exceeds 5MB limit. Uploaded size: ${(buffer.length / (1024 * 1024)).toFixed(2)}MB`);
  }

  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueKey = `resumes/${email.replace(/[^a-zA-Z0-9]/g, "_")}/${Date.now()}_${sanitizedName}`;

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueKey,
      Body: buffer,
      ContentType: "application/pdf"
    });

    await s3Client.send(command);
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${uniqueKey}`;
  } catch (error) {
    console.error("S3 Upload Failed:", error);
    throw new Error(`Failed to upload resume to S3: ${error.message}`);
  }
}

function parseS3Url(s3Url) {
  try {
    const url = new URL(s3Url);
    const bucket = url.hostname.split(".")[0];
    const key = decodeURIComponent(url.pathname.substring(1));
    return { bucket, key };
  } catch (err) {
    return { bucket: BUCKET_NAME, key: s3Url };
  }
}

module.exports = {
  uploadResumeToS3,
  parseS3Url
};

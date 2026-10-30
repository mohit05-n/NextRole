import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { logger } from "./utils/logger";
import { uploadToS3 } from "./modules/s3";
import { extractTextFromResume } from "./modules/textract";
import { parseResumeWithGemini } from "./modules/gemini";
import { getUserProfile, saveUserProfile } from "./modules/dynamodb";

const S3_BUCKET = process.env.S3_BUCKET || "nextrole-resumes-bucket";

// Helper for CORS headers
function getResponseHeaders(statusCode: number, body: any): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-User-Email",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
      "Access-Control-Allow-Credentials": "true"
    },
    body: JSON.stringify(body)
  };
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const startTime = Date.now();
  const requestId = event.requestContext?.requestId || "local-test";
  const path = event.path || event.requestContext?.resourcePath || "/";
  const method = event.httpMethod || "GET";

  logger.info(`Received API Request`, {
    requestId,
    method,
    path,
    queryParams: event.queryStringParameters,
    headers: {
      host: event.headers?.Host || event.headers?.host,
      userAgent: event.headers?.["User-Agent"] || event.headers?.["user-agent"]
    }
  });

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return getResponseHeaders(200, { message: "Preflight OK" });
  }

  try {
    // Resolve email
    const email = extractEmail(event);
    if (!email) {
      logger.warn(`Unauthorized request: No email identified`, { path, method });
      return getResponseHeaders(401, { error: "Unauthorized: User email could not be determined" });
    }

    // Router
    // 1. POST /resume/upload
    if (path.endsWith("/resume/upload") && method === "POST") {
      if (!event.body) {
        return getResponseHeaders(400, { error: "Missing request body" });
      }

      let bodyData;
      try {
        bodyData = JSON.parse(event.body);
      } catch (err) {
        return getResponseHeaders(400, { error: "Invalid JSON body" });
      }

      const { pdf, fileName } = bodyData;
      if (!pdf) {
        return getResponseHeaders(400, { error: "Missing 'pdf' field containing base64 data" });
      }

      const fileBuffer = Buffer.from(pdf, "base64");
      const fileKey = `${email.replace(/[^a-zA-Z0-9]/g, "_")}/${Date.now()}_${fileName || "resume.pdf"}`;

      // Upload PDF to S3
      const s3Url = await uploadToS3(S3_BUCKET, fileKey, fileBuffer, "application/pdf");

      // Extract text from S3 using Textract
      const extractedText = await extractTextFromResume(S3_BUCKET, fileKey);

      // Parse with Gemini
      const profile = await parseResumeWithGemini(extractedText, email);

      // Add audit metadata
      profile.s3Url = s3Url;
      profile.resumeText = extractedText;

      // Save to DynamoDB
      await saveUserProfile(profile);

      logger.info(`Request processed successfully in ${Date.now() - startTime}ms`, { path, method });
      return getResponseHeaders(200, profile);
    }

    // 2. GET /profile
    if (path.endsWith("/profile") && method === "GET") {
      const profile = await getUserProfile(email);
      if (!profile) {
        return getResponseHeaders(404, { error: "Profile not found" });
      }
      return getResponseHeaders(200, profile);
    }

    // 3. GET /dashboard
    if (path.endsWith("/dashboard") && method === "GET") {
      const profile = await getUserProfile(email);
      if (!profile) {
        return getResponseHeaders(404, { error: "Profile not found" });
      }
      // Return dashboard-centric metrics
      const dashboardData = {
        name: profile.name,
        email: profile.email,
        skillsCount: profile.skills?.length || 0,
        experienceCount: profile.experience?.length || 0,
        projectsCount: profile.projects?.length || 0,
        certificationsCount: profile.certifications?.length || 0,
        recentJob: profile.experience?.[0] || null,
        skills: profile.skills || [],
        roadmapStepsCount: profile.roadmap?.reduce((acc: number, val: any) => acc + (val.steps?.length || 0), 0) || 0
      };
      return getResponseHeaders(200, dashboardData);
    }

    // 4. GET /roadmap
    if (path.endsWith("/roadmap") && method === "GET") {
      const profile = await getUserProfile(email);
      if (!profile) {
        return getResponseHeaders(404, { error: "Profile not found" });
      }
      return getResponseHeaders(200, { roadmap: profile.roadmap || [] });
    }

    // 5. GET /certifications
    if (path.endsWith("/certifications") && method === "GET") {
      const profile = await getUserProfile(email);
      if (!profile) {
        return getResponseHeaders(404, { error: "Profile not found" });
      }
      return getResponseHeaders(200, { certifications: profile.certifications || [] });
    }

    // 6. GET /projects
    if (path.endsWith("/projects") && method === "GET") {
      const profile = await getUserProfile(email);
      if (!profile) {
        return getResponseHeaders(404, { error: "Profile not found" });
      }
      return getResponseHeaders(200, { projects: profile.projects || [] });
    }

    // 7. GET /resume
    if (path.endsWith("/resume") && method === "GET") {
      const profile = await getUserProfile(email);
      if (!profile) {
        return getResponseHeaders(404, { error: "Profile not found" });
      }
      return getResponseHeaders(200, {
        s3Url: profile.s3Url || "",
        resumeText: profile.resumeText || "",
        name: profile.name
      });
    }

    // Default 404 Route
    logger.warn(`Route not found`, { path, method });
    return getResponseHeaders(404, { error: `Route ${method} ${path} not found` });

  } catch (error) {
    logger.error(`Internal server error during request execution`, error, { path, method, requestId });
    return getResponseHeaders(500, { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) });
  }
};

function extractEmail(event: any): string | null {
  const claims = event.requestContext?.authorizer?.claims;
  if (claims && claims.email) {
    return claims.email;
  }
  const headers = event.headers || {};
  const emailHeader = headers['x-user-email'] || headers['X-User-Email'];
  if (emailHeader) {
    return emailHeader;
  }
  const query = event.queryStringParameters || {};
  if (query.email) {
    return query.email;
  }
  return null;
}

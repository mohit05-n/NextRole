const { optionsResponse, errorResponse } = require("./utils/response");
const { uploadResume, getResume } = require("./routes/resume");
const { getProfile, updateProfile } = require("./routes/profile");
const { getDashboard } = require("./routes/dashboard");
const { getRoadmap, generateRoadmap } = require("./routes/roadmap");
const { getProjects, generateProjects } = require("./routes/projects");
const { getCertifications, generateCertifications } = require("./routes/certifications");

function getEmailFromEvent(event) {
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

const handler = async (event) => {
  const startTime = Date.now();
  const path = event.path || event.requestContext?.resourcePath || "";
  const method = event.httpMethod || "GET";
  const requestId = event.requestContext?.requestId || "unknown";

  console.log(JSON.stringify({
    level: "INFO",
    timestamp: new Date().toISOString(),
    message: "Request Received",
    requestId,
    method,
    path,
    queryParams: event.queryStringParameters,
    headers: {
      host: event.headers?.Host || event.headers?.host,
      userAgent: event.headers?.["User-Agent"] || event.headers?.["user-agent"]
    }
  }));

  if (method === "OPTIONS") {
    return optionsResponse();
  }

  try {
    const email = getEmailFromEvent(event);
    if (!email) {
      console.warn(JSON.stringify({
        level: "WARN",
        timestamp: new Date().toISOString(),
        message: "Unauthorized: Email could not be identified",
        path,
        method
      }));
      return errorResponse(401, "Unauthorized: User identity could not be verified.");
    }

    let response;

    // --- Resume routes ---
    if (path.endsWith("/resume/upload") && method === "POST") {
      response = await uploadResume(email, event.body);
    } else if (path.endsWith("/resume") && method === "GET") {
      response = await getResume(email);

    // --- Profile routes ---
    } else if (path.endsWith("/profile")) {
      if (method === "GET") {
        response = await getProfile(email);
      } else if (method === "PUT") {
        response = await updateProfile(email, event.body);
      } else {
        return errorResponse(405, `Method ${method} not allowed on /profile`);
      }

    // --- Dashboard ---
    } else if (path.endsWith("/dashboard") && method === "GET") {
      response = await getDashboard(email);

    // --- Roadmap routes (check /generate FIRST before /roadmap) ---
    } else if (path.endsWith("/roadmap/generate") && method === "POST") {
      response = await generateRoadmap(email);
    } else if (path.endsWith("/roadmap") && method === "GET") {
      response = await getRoadmap(email);

    // --- Projects routes (check /generate FIRST) ---
    } else if (path.endsWith("/projects/generate") && method === "POST") {
      response = await generateProjects(email);
    } else if (path.endsWith("/projects") && method === "GET") {
      response = await getProjects(email);

    // --- Certifications routes (check /generate FIRST) ---
    } else if (path.endsWith("/certifications/generate") && method === "POST") {
      response = await generateCertifications(email);
    } else if (path.endsWith("/certifications") && method === "GET") {
      response = await getCertifications(email);

    } else {
      console.warn(JSON.stringify({
        level: "WARN",
        timestamp: new Date().toISOString(),
        message: "Endpoint Route Not Found",
        path,
        method
      }));
      response = errorResponse(404, `Endpoint ${method} ${path} not found.`);
    }

    console.log(JSON.stringify({
      level: "INFO",
      timestamp: new Date().toISOString(),
      message: "Request Completed Successfully",
      requestId,
      durationMs: Date.now() - startTime,
      statusCode: response.statusCode
    }));

    return response;

  } catch (error) {
    console.error(JSON.stringify({
      level: "ERROR",
      timestamp: new Date().toISOString(),
      message: "Request Execution Error",
      requestId,
      durationMs: Date.now() - startTime,
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error
    }));

    if (error.statusCode) {
      return errorResponse(error.statusCode, error.message);
    }

    return errorResponse(500, "Internal Server Error", { details: error.message || String(error) });
  }
};

module.exports = {
  handler
};

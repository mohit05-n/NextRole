const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://nextrole.vercel.app"
];

function getCorsHeaders(requestOrigin) {
  const origin = ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-User-Email",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Expose-Headers": "ETag",
    "Access-Control-Allow-Credentials": "true"
  };
}

function successResponse(message, data = {}, requestOrigin) {
  return {
    statusCode: 200,
    headers: getCorsHeaders(requestOrigin),
    body: JSON.stringify({
      success: true,
      message,
      data
    })
  };
}

function errorResponse(statusCode, message, details = {}, requestOrigin) {
  return {
    statusCode,
    headers: getCorsHeaders(requestOrigin),
    body: JSON.stringify({
      success: false,
      message,
      data: details
    })
  };
}

function optionsResponse(requestOrigin) {
  return {
    statusCode: 200,
    headers: getCorsHeaders(requestOrigin),
    body: ""
  };
}

module.exports = {
  successResponse,
  errorResponse,
  optionsResponse,
  getCorsHeaders
};

// All API calls go through Next.js server-side proxy at /api/backend/*
// This avoids CORS issues since the Next.js server calls Lambda server-to-server
const API_PROXY_BASE = "/api/backend";

function getEmailFromToken(token: string): string | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.email || null;
  } catch (e) {
    return null;
  }
}

export async function fetchFromAPI(endpoint: string, options: RequestInit = {}): Promise<any> {
  const idToken = typeof window !== "undefined" ? localStorage.getItem("nextrole_id_token") : null;
  const headers = new Headers(options.headers || {});

  if (idToken) {
    headers.set("Authorization", `Bearer ${idToken}`);
    const email = getEmailFromToken(idToken);
    if (email) {
      headers.set("X-User-Email", email);
    }
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  // Use the server-side proxy base URL — always relative, no CORS
  const targetUrl = `${API_PROXY_BASE}${cleanEndpoint}`;

  try {
    const response = await fetch(targetUrl, {
      ...options,
      headers,
    });

    // Parse response body regardless of status code
    let responseData: any = null;
    try {
      responseData = await response.json();
    } catch (e) {
      // Response is not JSON
    }

    if (!response.ok) {
      // Extract structured error message from Lambda response
      let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
      if (responseData) {
        if (responseData.message) {
          errorMsg = responseData.message;
        } else if (responseData.error) {
          errorMsg = responseData.error;
        }
      }
      // Prefix with status code so pages can detect 404 reliably
      throw new Error(`${response.status}: ${errorMsg}`);
    }

    return responseData;
  } catch (err: any) {
    if (err.message && /^\d{3}:/.test(err.message)) {
      throw err; // Already a structured HTTP error
    }
    console.warn(`Fetch API failed on endpoint: ${cleanEndpoint}`, err);
    throw new Error(`Network error connecting to API: ${err.message || "Unknown error"}`);
  }
}

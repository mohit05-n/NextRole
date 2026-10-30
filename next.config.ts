import type { NextConfig } from "next";

const LAMBDA_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://idckdvseki.execute-api.ap-south-1.amazonaws.com/prod";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // All /api/backend/* calls are proxied server-side to Lambda
        // This eliminates CORS entirely (server-to-server, not browser-to-Lambda)
        source: "/api/backend/:path*",
        destination: `${LAMBDA_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;

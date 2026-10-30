"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Parse the hash parameters from URL
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // remove '#'
      const idToken = params.get("id_token");
      const accessToken = params.get("access_token");

      if (idToken) {
        localStorage.setItem("nextrole_id_token", idToken);
        if (accessToken) {
          localStorage.setItem("nextrole_access_token", accessToken);
        }
        // Redirect to dashboard using full page navigation to reset state cleanly
        window.location.href = "/dashboard";
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0b0c10] text-white">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto"></div>
        <p className="text-lg font-medium text-gray-400">Completing Secure Authentication...</p>
      </div>
    </div>
  );
}

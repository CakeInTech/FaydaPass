"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("=== CALLBACK HANDLING START ===");

        // Check for OAuth errors first
        const oauthError = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (oauthError) {
          console.error("OAuth error:", oauthError, errorDescription);
          setError(`OAuth Error: ${errorDescription || oauthError}`);
          setStatus("error");
          return;
        }

        const code = searchParams.get("code");
        const state = searchParams.get("state");

        console.log("Callback parameters:", {
          code: code?.substring(0, 20),
          state: state?.substring(0, 20),
        });

        if (!code || !state) {
          setError("Missing authorization code or state");
          setStatus("error");
          return;
        }

        // Verify state
        const storedState = sessionStorage.getItem("oauth_state");
        console.log("State verification:", {
          received: state?.substring(0, 20),
          stored: storedState?.substring(0, 20),
        });

        if (state !== storedState) {
          setError("Invalid state parameter - possible security issue");
          setStatus("error");
          return;
        }

        // Get code verifier
        const codeVerifier = sessionStorage.getItem("code_verifier");
        console.log("Code verifier:", codeVerifier?.substring(0, 20));

        if (!codeVerifier) {
          setError("Missing code verifier - please restart verification");
          setStatus("error");
          return;
        }

        // Check environment variables in client
        const clientId =
          process.env.NEXT_PUBLIC_CLIENT_ID ||
          "crXYIYg2cJiNTaw5t-peoPzCRo-3JATNfBd5A86U8t0";
        const redirectUri =
          process.env.NEXT_PUBLIC_REDIRECT_URI ||
          "http://localhost:3000/callback";

        console.log("Environment variables:", {
          clientId: clientId,
          redirectUri: redirectUri,
        });

        if (!clientId || !redirectUri) {
          setError("Missing environment variables - check configuration");
          setStatus("error");
          return;
        }

        // Exchange code for tokens
        console.log("Making token exchange request...");
        const tokenRequest = {
          code,
          code_verifier: codeVerifier,
          client_id: clientId,
          redirect_uri: redirectUri,
        };

        console.log("Token request:", tokenRequest);

        const tokenResponse = await fetch("/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tokenRequest),
        });

        console.log("Token response status:", tokenResponse.status);

        const tokenData = await tokenResponse.json();
        console.log("Token response data:", tokenData);

        if (!tokenResponse.ok) {
          console.error("Token exchange failed:", tokenData);
          setError(
            tokenData.error_description ||
              tokenData.error ||
              "Token exchange failed"
          );
          setDebugInfo(tokenData);
          setStatus("error");
          return;
        }

        console.log("✅ Tokens received successfully");
        console.log(
          "Access token received:",
          tokenData.access_token?.substring(0, 20) + "..."
        );
        setStatus("success");

        // Store basic success data
        sessionStorage.setItem("access_token", tokenData.access_token);
        sessionStorage.setItem("verification_success", "true");

        // Clean up OAuth state
        sessionStorage.removeItem("code_verifier");
        sessionStorage.removeItem("oauth_state");

        // Redirect after delay
        setTimeout(() => {
          router.push("/verified");
        }, 2000);
      } catch (err) {
        console.error("Callback error:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setStatus("error");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-indigo-600 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Processing Verification
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your identity with Fayda...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Successful!
            </h1>
            <p className="text-gray-600">
              Redirecting you to your dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-4 text-sm">{error}</p>

            {debugInfo && (
              <details className="text-left mb-4 bg-gray-100 p-3 rounded text-xs">
                <summary className="cursor-pointer font-medium">
                  Debug Info
                </summary>
                <pre className="mt-2 overflow-auto max-h-40">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}

            <div className="space-y-2">
              <button
                onClick={() => router.push("/verify")}
                className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

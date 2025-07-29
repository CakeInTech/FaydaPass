"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, CheckCircle, Lock, Loader2 } from "lucide-react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import { generateCodeVerifier, generateCodeChallenge } from "@/lib/pkce";

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleFaydaLogin = async () => {
    try {
      setIsLoading(true);

      // Generate PKCE parameters
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = generateCodeVerifier(); // Use same function for random state

      // Store PKCE parameters
      sessionStorage.setItem("code_verifier", codeVerifier);
      sessionStorage.setItem("oauth_state", state);

      // Build authorization URL
      const params = new URLSearchParams({
        response_type: "code",
        client_id:
          process.env.NEXT_PUBLIC_CLIENT_ID ||
          "crXYIYg2cJiNTaw5t-peoPzCRo-3JATNfBd5A86U8t0",
        redirect_uri:
          process.env.NEXT_PUBLIC_REDIRECT_URI ||
          "http://localhost:3000/callback",
        scope: "openid profile email phone address",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state: state,
        nonce: generateCodeVerifier(), // Random nonce
        ui_locales: "en", // Simplified to just English
        acr_values:
          "mosip:idp:acr:generated-code mosip:idp:acr:biometrics mosip:idp:acr:static-code",
      });

      const authUrl = `${
        process.env.NEXT_PUBLIC_AUTHORIZATION_ENDPOINT ||
        "https://esignet.ida.fayda.et/authorize"
      }?${params.toString()}`;

      console.log("Redirecting to:", authUrl);

      // Redirect to Fayda
      window.location.href = authUrl;
    } catch (error) {
      console.error("OAuth initiation failed:", error);
      setIsLoading(false);
      alert("Failed to initiate verification. Please try again.");
    }
  };

  return (
    <BackgroundWrapper>
      <div className="min-h-screen py-32 px-4 flex items-center justify-center bg-transparent relative">
        <div className="relative z-10 w-full max-w-6xl bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Complete Your KYC Verification
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              To comply with regulatory requirements and ensure account
              security, verify your identity using your official Fayda digital
              ID.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                How it Works
              </h2>
              <ul className="space-y-6">
                {[
                  {
                    title: "Connect with Fayda",
                    desc: "Securely connect to the Ethiopian national identity system",
                  },
                  {
                    title: "Instant Verification",
                    desc: "Your identity is verified in real-time using biometric data",
                  },
                  {
                    title: "Get Verified",
                    desc: "Receive your verification certificate and access services",
                  },
                ].map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {step.title}
                      </h3>
                      <p className="text-white/70 mt-1">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Security & Privacy
              </h2>
              <ul className="space-y-4 text-white/80">
                {[
                  "End-to-end encrypted data transmission",
                  "OAuth 2.0 & OpenID Connect standards",
                  "No sensitive data stored locally",
                  "Government-grade identity verification",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-blue-300 mt-0.5" />
                  <div>
                    <p className="text-sm text-white font-medium">
                      Test Credentials
                    </p>
                    <p className="text-sm text-white/70 mt-1">
                      FIN: 6140798523917519 | OTP: 111111
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={handleFaydaLogin}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-3" />
                  Connecting to Fayda...
                </>
              ) : (
                <>
                  <Smartphone className="w-5 h-5 mr-3" />
                  Continue with Fayda
                </>
              )}
            </Button>
            <p className="text-sm text-white/60 mt-4">
              By continuing, you agree to share your identity information with
              FaydaPass for verification purposes.
            </p>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}

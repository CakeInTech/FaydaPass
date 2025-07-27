"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, CheckCircle, Lock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
} from "@/lib/pkce";
import BackgroundWrapper from "@/components/BackgroundWrapper";

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleFaydaLogin = async () => {
    setIsLoading(true);
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateState();

    sessionStorage.setItem("code_verifier", codeVerifier);
    sessionStorage.setItem("oauth_state", state);

    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;
    const authorizationEndpoint =
      process.env.NEXT_PUBLIC_AUTHORIZATION_ENDPOINT!;

    const claims = {
      userinfo: {
        name: { essential: true },
        phone_number: { essential: true },
        email: { essential: true },
        picture: { essential: false },
        gender: { essential: false },
        birthdate: { essential: false },
        address: { essential: false },
      },
      id_token: {},
    };

    const authUrl = new URL(authorizationEndpoint);
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", "openid profile email");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("code_challenge", codeChallenge);
    authUrl.searchParams.set("code_challenge_method", "S256");
    authUrl.searchParams.set("claims", JSON.stringify(claims));
    authUrl.searchParams.set("claims_locales", "en am");

    if (!clientId || !authorizationEndpoint || !redirectUri) {
      alert("Missing configuration");
      setIsLoading(false);
      return;
    }

    window.location.href = authUrl.toString();
  };

  return (
    <BackgroundWrapper>
      <div className="min-h-screen py-32 px-4 flex items-center justify-center bg-transparent relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[60rem] h-[60rem] bg-blue-500/10 blur-3xl rounded-full -top-40 -left-40 animate-pulse-slow" />
          <div className="absolute w-[40rem] h-[40rem] bg-green-400/10 blur-2xl rounded-full -bottom-20 right-0 animate-pulse-slower" />
        </div>

        <div className="relative z-10 w-full max-w-6xl bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-10">
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/"
              className="flex items-center text-white/80 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold text-lg">
                FaydaPass
              </span>
            </div>
          </div>

          <div className="text-center mb-12">
            <div className="floating-animation inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
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
                How It Works
              </h2>
              <ul className="space-y-6">
                {[
                  "Connect with Fayda",
                  "Instant Verification",
                  "Get Verified",
                ].map((title, idx) => (
                  <li key={idx} className="flex items-start space-x-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 text-sm font-bold text-white bg-opacity-20`}
                      style={{
                        backgroundColor: ["#10b981", "#3b82f6", "#8b5cf6"][idx],
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{title}</h3>
                      <p className="text-white/70 text-sm">
                        {
                          [
                            "Securely log in using your Fayda digital identity",
                            "Your identity is verified using official government data",
                            "Receive your verification status and continue onboarding",
                          ][idx]
                        }
                      </p>
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
                      Your Data is Protected
                    </p>
                    <p className="text-sm text-white/70 mt-1">
                      FaydaPass uses bank-level security protocols and never
                      stores your personal information.
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
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Connecting to Fayda...
                </>
              ) : (
                <>
                  <Smartphone className="w-5 h-5 mr-3" /> Continue with Fayda
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

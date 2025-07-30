"use client";

import BackgroundWrapper from "@/components/BackgroundWrapper";
import { Button } from "@/components/ui/button";
import { generateCodeChallenge, generateCodeVerifier } from "@/lib/pkce";
import { CheckCircle, Loader2, Lock, Smartphone } from "lucide-react";
import { useState } from "react";

const translations = {
  en: {
    title: "Complete Your KYC Verification",
    description:
      "To comply with regulatory requirements and ensure account security, verify your identity using your official Fayda digital ID.",
    howItWorks: "How it Works",
    steps: [
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
    ],
    securityTitle: "Security & Privacy",
    securityItems: [
      "End-to-end encrypted data transmission",
      "OAuth 2.0 & OpenID Connect standards",
      "No sensitive data stored locally",
      "Government-grade identity verification",
    ],
    testCreds: "Test Credentials",
    continueButton: "Continue with Fayda",
    connectingButton: "Connecting to Fayda...",
    agreement:
      "By continuing, you agree to share your identity information with FaydaPass for verification purposes.",
  },
  am: {
    title: "የእርስዎን የKYC ማረጋገጫ ያጠናቅቁ",
    description:
      "የቁጥጥር መስፈርቶችን ለማክበር እና የመለያ ደህንነትን ለማረጋገጥ፣ የእርስዎን ኦፊሴላዊ የፈይዳ ዲጂታል መታወቂያ በመጠቀም ማንነትዎን ያረጋግጡ።",
    howItWorks: "እንዴት እንደሚሰራ",
    steps: [
      {
        title: "ከፈይዳ ጋር ይገናኙ",
        desc: "ከኢትዮጵያ ብሔራዊ የማንነት ስርዓት ጋር ደህንነቱ በተጠበቀ ሁኔታ ይገናኙ",
      },
      {
        title: "ፈጣን ማረጋገጫ",
        desc: "የእርስዎ ማንነት በባዮሜትሪክ መረጃ በእውነተኛ ጊዜ ይረጋገጣል",
      },
      {
        title: "ማረጋገጫ ያግኙ",
        desc: "የማረጋገጫ ሰርተፍኬትዎን ይቀበሉ እና አገልግሎቶችን ያግኙ",
      },
    ],
    securityTitle: "ደህንነት እና ግላዊነት",
    securityItems: [
      "ከጫፍ-እስከ-ጫፍ የተመሰጠረ የመረጃ ልውውጥ",
      "OAuth 2.0 እና OpenID Connect መስፈርቶች",
      "ምንም ሚስጥራዊ መረጃ በአገር ውስጥ አይቀመጥም",
      "በመንግስት ደረጃ የማንነት ማረጋገጫ",
    ],
    testCreds: "የሙከራ ምስክርነቶች",
    continueButton: "በፈይዳ ይቀጥሉ",
    connectingButton: "ከፈይዳ ጋር በመገናኘት ላይ...",
    agreement:
      "በመቀጠል፣ የማንነት መረጃዎን ለማረጋገጫ ከFaydaPass ጋር ለማጋራት ተስማምተዋል።",
  },
};

const ProgressStepper = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Consent", "Redirect", "Verified"];
  return (
    <div className="flex justify-center items-center space-x-4 mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              index + 1 === currentStep
                ? "bg-indigo-500 text-white"
                : index + 1 < currentStep
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {index + 1 < currentStep ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              index + 1
            )}
          </div>
          <span
            className={`ml-2 ${
              index + 1 <= currentStep ? "text-white" : "text-white/50"
            }`}
          >
            {step}
          </span>
          {index < steps.length - 1 && (
            <div className="w-16 h-1 bg-gray-300/50 mx-4 rounded-full">
              <div
                className={`h-1 rounded-full ${
                  index + 1 < currentStep ? "bg-green-500 w-full" : "w-0"
                }`}
                style={{
                  width: index + 1 < currentStep ? "100%" : "0%",
                  transition: "width 0.5s",
                }}
              ></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<"en" | "am">("en");

  const t = translations[language];

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
        <div className="absolute top-4 right-4 z-20">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "am")}
            className="bg-white/20 text-black rounded-md p-2 border border-white/30"
          >
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
          </select>
        </div>
        <div className="relative z-10 w-full max-w-6xl bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-10">
          <ProgressStepper currentStep={1} />
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              {t.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t.howItWorks}
              </h2>
              <ul className="space-y-6">
                {t.steps.map((step, idx) => (
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
                {t.securityTitle}
              </h2>
              <ul className="space-y-4 text-white/80">
                {t.securityItems.map((item, idx) => (
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
                      {t.testCreds}
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
                  {t.connectingButton}
                </>
              ) : (
                <>
                  <Smartphone className="w-5 h-5 mr-3" />
                  {t.continueButton}
                </>
              )}
            </Button>
            <p className="text-sm text-white/60 mt-4">
              {t.agreement}
            </p>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}

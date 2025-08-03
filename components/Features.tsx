"use client";

import {
  Terminal,
  Lock,
  Globe,
  Building2,
  CreditCard,
  Shield,
  Zap,
  Users,
} from "lucide-react";

export default function ServicesSection() {
  return (
    <section className="py-40 relative overflow-hidden bg-transparent text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-indigo-400/20 blur-3xl rounded-full animate-float-slow" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 blur-2xl rounded-full animate-float-slower" />
      </div>

      <div className="relative z-20 max-w-6xl mx-auto px-6">
        <div className="backdrop-blur-xl bg-black/25 border border-white/10 shadow-[0_20px_80px_rgba(99,102,241,0.25)] rounded-3xl p-12 md:p-20 transition-all duration-500 hover:shadow-[0_30px_100px_rgba(99,102,241,0.35)]">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              KYC Integration Made Simple
            </h2>
            <p className="text-white/80 text-lg max-w-3xl mx-auto">
              Whether you're building a startup, fintech app, or enterprise
              solution, integrate Ethiopian identity verification in minutes.
              Built for developers, trusted by enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-[0_20px_80px_rgba(99,102,241,0.15)] relative">
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <div className="text-sm bg-white/10 px-3 py-1 rounded-full text-white/70">
                  REST API
                </div>
              </div>
              <pre className="text-green-400 text-sm leading-relaxed font-mono whitespace-pre-wrap">
                {`// Initialize KYC verification
const response = await fetch('/api/kyc/initiate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer fp_live_...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_email: 'user@company.com',
    redirect_url: 'https://yourapp.com/kyc/callback'
  })
});

const { verification_id, auth_url } = response.json();
// Redirect user to auth_url for verification`}
              </pre>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: <Zap className="w-8 h-8 text-yellow-400" />,
                    title: "Quick Integration",
                    desc: "Get started in under 5 minutes with our simple API",
                  },
                  {
                    icon: <Shield className="w-8 h-8 text-green-400" />,
                    title: "Government Backed",
                    desc: "Powered by official Ethiopian National ID system",
                  },
                  {
                    icon: <Users className="w-8 h-8 text-blue-400" />,
                    title: "For Everyone",
                    desc: "From startups to enterprises, we scale with you",
                  },
                  {
                    icon: <Terminal className="w-8 h-8 text-purple-400" />,
                    title: "Developer First",
                    desc: "Comprehensive SDKs and documentation included",
                  },
                ].map(({ icon, title, desc }, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                      {icon}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {title}
                    </h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Perfect For Any Application
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🚀",
                  title: "Startups & Apps",
                  desc: "Verify users in your mobile app or web platform",
                },
                {
                  icon: "🏦",
                  title: "Fintech & Banking",
                  desc: "Compliance-ready KYC for financial services",
                },
                {
                  icon: "🏢",
                  title: "Enterprise",
                  desc: "Scale to millions of verifications with enterprise features",
                },
              ].map(({ icon, title, desc }, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300"
                >
                  <div className="text-3xl mb-4">{icon}</div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {title}
                  </h4>
                  <p className="text-white/70 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import {
  Shield,
  Lock,
  CheckCircle,
  FileText,
  Users,
  Globe,
} from "lucide-react";

export default function Compliance() {
  const complianceFeatures = [
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: "SOC 2 Type II",
      description: "Certified security controls and data protection",
      details:
        "Annual audits ensure your data is protected with enterprise-grade security.",
    },
    {
      icon: <Lock className="w-8 h-8 text-green-400" />,
      title: "GDPR Compliant",
      description: "Full data protection and privacy compliance",
      details:
        "Built-in data minimization, consent management, and right to be forgotten.",
    },
    {
      icon: <FileText className="w-8 h-8 text-purple-400" />,
      title: "KYC/AML Ready",
      description: "Built for financial compliance requirements",
      details:
        "Automated reporting, audit trails, and regulatory compliance features.",
    },
    {
      icon: <Users className="w-8 h-8 text-orange-400" />,
      title: "Multi-tenant Security",
      description: "Isolated data and role-based access",
      details: "Enterprise-grade isolation with custom roles and permissions.",
    },
  ];

  const securityFeatures = [
    "End-to-end encryption",
    "OAuth 2.0 & OpenID Connect",
    "JWT token authentication",
    "Rate limiting & DDoS protection",
    "Regular security audits",
    "24/7 security monitoring",
  ];

  return (
    <section className="py-40 relative overflow-hidden bg-transparent text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-blue-400/10 blur-3xl rounded-full animate-float-slow" />
        <div className="absolute bottom-10 right-1/3 w-80 h-80 bg-green-500/10 blur-2xl rounded-full animate-float-slower" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Enterprise Security & Compliance
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Built for banks and fintechs with enterprise-grade security,
            compliance, and audit capabilities.
          </p>
        </div>

        {/* Compliance Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {complianceFeatures.map((feature, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 font-medium mb-3">
                    {feature.description}
                  </p>
                  <p className="text-white/60 text-sm">{feature.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Features */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Bank-Grade Security
            </h3>
            <p className="text-white/80">
              Your data is protected with the same security standards used by
              leading financial institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-white/80">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Government Partnership */}
        <div className="mt-16 text-center">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-6">
              <Globe className="w-12 h-12 text-blue-400 mr-4" />
              <h3 className="text-2xl font-bold text-white">
                Government Partnership
              </h3>
            </div>
            <p className="text-white/80 max-w-2xl mx-auto mb-6">
              FaydaPass is officially partnered with the Ethiopian government
              and powered by Fayda eSignet, the national digital identity
              infrastructure. This ensures your verifications are backed by
              official government records and biometric data.
            </p>
            <div className="flex items-center justify-center space-x-8 text-white/60">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">
                  Official Partnership
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">
                  Biometric Verification
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Real-time Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

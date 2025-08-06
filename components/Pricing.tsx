"use client";

import { CheckCircle, Building2, Zap, Shield, Users, Code } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      id: "developer",
      name: "Developer Plan",
      price: "Free",
      period: "forever",
      description: "Perfect for individual developers and small projects",
      icon: Code,
      gradient: "from-blue-500 to-purple-600",
      features: [
        "1,000 API calls/month",
        "Complete SDK access",
        "Sandbox environment",
        "Community support",
        "Basic analytics",
        "Email notifications",
      ],
      highlights: [
        "Instant API access",
        "No credit card required",
        "Perfect for testing",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      id: "business",
      name: "Business Plan",
      price: "$299",
      period: "/month",
      description: "For companies, startups, and production applications",
      icon: Building2,
      gradient: "from-green-500 to-blue-600",
      features: [
        "50,000 API calls/month",
        "Advanced KYC features",
        "Webhook support",
        "Priority support",
        "Custom branding",
        "Advanced analytics",
        "Compliance reporting",
        "Multi-user access",
      ],
      highlights: [
        "Production ready",
        "Enterprise features",
        "Dedicated support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
  ];

  return (
    <section className="py-40 relative overflow-hidden bg-transparent text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-400/10 blur-3xl rounded-full animate-float-slow" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500/10 blur-2xl rounded-full animate-float-slower" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include
            government-backed KYC verification powered by Fayda eSignet.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative backdrop-blur-xl bg-white/5 border rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? "border-green-500/50 shadow-[0_20px_80px_rgba(34,197,94,0.25)]"
                  : "border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-white/60 text-lg ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-white/70">{plan.description}</p>
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {plan.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="bg-white/10 text-white border border-white/20 text-xs px-3 py-1 rounded-full"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => (window.location.href = "/plan-selection")}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  plan.popular
                    ? "bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700"
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Enterprise Features */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">
            Why Choose FaydaPass?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-blue-400" />,
                title: "Government Backed",
                desc: "Powered by Ethiopia's official Fayda eSignet system",
              },
              {
                icon: <Zap className="w-8 h-8 text-yellow-400" />,
                title: "Lightning Fast",
                desc: "Complete KYC verification in under 60 seconds",
              },
              {
                icon: <Users className="w-8 h-8 text-green-400" />,
                title: "Developer First",
                desc: "Simple APIs, comprehensive docs, ready-to-use SDKs",
              },
              {
                icon: <Building2 className="w-8 h-8 text-purple-400" />,
                title: "Enterprise Ready",
                desc: "SOC 2 compliant with 99.9% uptime guarantee",
              },
            ].map(({ icon, title, desc }, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {icon}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {title}
                </h4>
                <p className="text-white/70 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

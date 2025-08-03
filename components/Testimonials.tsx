"use client";

import { Quote, Star, Building2, CreditCard, Shield } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "FaydaPass has transformed our customer onboarding process. The government-backed verification gives us confidence and our customers trust it.",
      author: "Sarah Johnson",
      role: "CTO",
      company: "Digital Bank Ethiopia",
      logo: "🏦",
    },
    {
      quote:
        "Integration was seamless. We went from months of development to live KYC verification in just 2 weeks.",
      author: "Michael Chen",
      role: "Head of Engineering",
      company: "Fintech Solutions",
      logo: "💳",
    },
    {
      quote:
        "The compliance features are excellent. We can easily generate reports for regulators and auditors.",
      author: "Amina Hassan",
      role: "Compliance Officer",
      company: "Payment Platform",
      logo: "🔒",
    },
  ];

  const logos = [
    { name: "Commercial Bank of Ethiopia", logo: "🏦" },
    { name: "Dashen Bank", logo: "🏦" },
    { name: "Ethio Telecom", logo: "📱" },
    { name: "Ethiopian Airlines", logo: "✈️" },
    { name: "Ethiopian Electric Power", logo: "⚡" },
    { name: "Ethiopian Investment Commission", logo: "📊" },
  ];

  return (
    <section className="py-40 relative overflow-hidden bg-transparent text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-400/10 blur-3xl rounded-full animate-float-slow" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-indigo-500/10 blur-2xl rounded-full animate-float-slower" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by Leading Institutions
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Join hundreds of banks, fintechs, and government institutions using
            FaydaPass for secure KYC verification.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-300"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="text-3xl">{testimonial.logo}</div>
                <div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <h4 className="font-semibold text-white">
                    {testimonial.author}
                  </h4>
                  <p className="text-white/60 text-sm">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
              <blockquote className="text-white/80 italic">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>

        {/* Trusted By Logos */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">
            Trusted by Leading Ethiopian Institutions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {logos.map((company, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{company.logo}</div>
                <p className="text-white/70 text-sm text-center font-medium">
                  {company.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              icon: <Building2 className="w-8 h-8 text-blue-400" />,
              number: "50+",
              label: "Banks & Fintechs",
            },
            {
              icon: <CreditCard className="w-8 h-8 text-green-400" />,
              number: "1M+",
              label: "Verifications",
            },
            {
              icon: <Shield className="w-8 h-8 text-purple-400" />,
              number: "99.9%",
              label: "Uptime",
            },
            {
              icon: <Star className="w-8 h-8 text-yellow-400" />,
              number: "4.9/5",
              label: "Customer Rating",
            },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-white/70 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

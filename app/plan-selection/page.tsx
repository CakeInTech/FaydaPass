"use client";

import { useState } from "react";
import { plans, Plan } from "../plans";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Code,
  Building2,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Users,
  BarChart3,
  Sparkles,
} from "lucide-react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import { Badge } from "@/components/ui/badge";

export default function PlanSelectionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<
    "developer" | "business" | null
  >(null);

  const handlePlanSelect = (planType: "developer" | "business") => {
    setSelectedPlan(planType);
    // Store plan selection for signup process
    sessionStorage.setItem("selected_plan", planType);

    // Redirect to appropriate signup flow
    router.push(`/signup?plan=${planType}`);
  };

  return (
    <BackgroundWrapper>
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary-foreground py-2 px-4 rounded-full text-sm font-semibold mb-6"
            >
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Choose Your Plan
            </Badge>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Start Your KYC Journey
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Choose the plan that fits your needs. Whether you're a developer
              building your first app or a company scaling to millions of users,
              we've got you covered.
            </p>
          </motion.div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {plans.map((plan: Plan, index: number) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative backdrop-blur-xl bg-white/5 border rounded-3xl p-8 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  plan.popular
                    ? "border-green-500/50 shadow-[0_20px_80px_rgba(34,197,94,0.25)]"
                    : "border-white/10 hover:border-white/30"
                } ${selectedPlan === plan.id ? "ring-2 ring-white/50" : ""}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
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

                  <h3 className="text-3xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>

                  <p className="text-white/70 mb-4">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-white/60 text-lg ml-1">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {plan.highlights.map((highlight: string, idx: number) => (
                      <Badge
                        key={idx}
                        className="bg-white/10 text-white border-white/20 text-xs"
                      >
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map(
                    (feature: string, featureIndex: number) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    )
                  )}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                    plan.popular
                      ? "bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 shadow-lg"
                      : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Feature Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
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
                  icon: <BarChart3 className="w-8 h-8 text-purple-400" />,
                  title: "Enterprise Ready",
                  desc: "SOC 2 compliant with 99.9% uptime guarantee",
                },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-white/70 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <p className="text-white/60 text-sm mb-4">
              Trusted by leading Ethiopian institutions
            </p>
            <div className="flex justify-center items-center space-x-8 text-white/40">
              <span className="text-2xl">🏦</span>
              <span className="text-2xl">💳</span>
              <span className="text-2xl">📱</span>
              <span className="text-2xl">🏢</span>
              <span className="text-2xl">⚡</span>
            </div>
          </motion.div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}

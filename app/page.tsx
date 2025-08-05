"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Code,
  Building,
  BookOpen,
  Users,
  Sparkles,
  CheckCircle,
  Globe,
  Lock,
  Terminal,
} from "lucide-react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Globe className="w-8 h-8 text-blue-400" />,
      title: "Government Backed",
      description: "Powered by Ethiopia's official Fayda eSignet system",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Lightning Fast",
      description: "Complete KYC verification in under 60 seconds",
    },
    {
      icon: <Lock className="w-8 h-8 text-green-400" />,
      title: "Bank-Grade Security",
      description: "OAuth 2.0, PKCE, and end-to-end encryption",
    },
    {
      icon: <Terminal className="w-8 h-8 text-purple-400" />,
      title: "Developer First",
      description: "Simple APIs, comprehensive docs, ready-to-use SDKs",
    },
  ];

  const testimonials = [
    {
      quote: "FaydaPass transformed our customer onboarding. Integration was seamless.",
      author: "Sarah Johnson",
      role: "CTO, Digital Bank Ethiopia",
      avatar: "🏦",
    },
    {
      quote: "The government-backed verification gives us confidence and our customers trust it.",
      author: "Michael Chen",
      role: "Head of Engineering, Fintech Solutions",
      avatar: "💳",
    },
    {
      quote: "From months of development to live KYC verification in just 2 weeks.",
      author: "Amina Hassan",
      role: "Product Manager, Payment Platform",
      avatar: "🔒",
    },
  ];

  return (
    <BackgroundWrapper>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-dark-900 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-white">FaydaPass</span>
                  <span className="text-xs text-white/60 block">KYC API Platform</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link href="/docs">
                  <Button variant="ghost" className="text-white/70 hover:text-white">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Docs
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/plan-selection">
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden pt-20">
          <motion.div
            className="relative z-10 max-w-7xl mx-auto px-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary-foreground py-2 px-4 rounded-full text-sm font-semibold mb-8"
            >
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              KYC API for Everyone
            </Badge>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-8 leading-tight">
              Verify Users with
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Government Backed
              </span>
              Identity Data
            </h1>

            <p className="text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto mb-12">
              Whether you're a startup, developer, or enterprise, integrate Ethiopian 
              identity verification into your app in minutes. Powered by Fayda eSignet.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <Link href="/plan-selection">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  <Building className="mr-2 w-5 h-5" />
                  Choose Your Plan
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Link href="/verify">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                >
                  <Code className="mr-2 w-5 h-5" />
                  Try Demo
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/60">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <span>Government Backed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span>60s Verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>Developer Friendly</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Why Choose FaydaPass?
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Built for developers, trusted by enterprises. Get started in minutes 
                with our comprehensive KYC platform.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="backdrop-blur-xl bg-white/5 border-white/10 hover:border-white/30 transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Trusted by Leading Institutions
              </h2>
              <p className="text-xl text-white/80">
                Join hundreds of companies using FaydaPass for secure KYC verification.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="backdrop-blur-xl bg-white/5 border-white/10 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-2xl">{testimonial.avatar}</span>
                        <div>
                          <h4 className="font-semibold text-white">
                            {testimonial.author}
                          </h4>
                          <p className="text-white/60 text-sm">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <blockquote className="text-white/80 italic">
                        "{testimonial.quote}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Choose your plan and start verifying users in minutes. 
                No credit card required for developers.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/plan-selection">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
                  >
                    Choose Your Plan
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                
                <Link href="/docs">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <BookOpen className="mr-2 w-5 h-5" />
                    View Documentation
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/50 border-t border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-dark-900 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FaydaPass</span>
              </div>
              
              <div className="text-white/60 text-sm">
                © {new Date().getFullYear()} FaydaPass. The developer-first KYC platform for Ethiopia.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BackgroundWrapper>
  );
}
"use client";
import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Code,
  Building,
  BookOpen,
  Users,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Home = ({ isVisible = true }: { isVisible?: boolean }) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Left Column: Text Content */}
        <div className="text-center md:text-left">
          <motion.div variants={itemVariants}>
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary-foreground py-2 px-4 rounded-full text-sm font-semibold mb-6"
            >
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              KYC API for Everyone
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
            variants={itemVariants}
          >
            Verify Users with
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Government Backed
            </span>
            Identity Data
          </motion.h1>

          <motion.p
            className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto md:mx-0 mb-10"
            variants={itemVariants}
          >
            Whether you're a startup, developer, or enterprise, integrate
            Ethiopian identity verification into your app in minutes. Powered by
            Fayda eSignet.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-8"
            variants={itemVariants}
          >
            <Link href="/company-login">
              <button className="w-full sm:w-auto group relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center">
                  <Building className="mr-2 w-5 h-5" />
                  Company Login
                  <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </Link>
            <Link href="/developer-login">
              <button className="w-full sm:w-auto group relative border-2 border-white/30 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center">
                  <Code className="mr-2 w-5 h-5" />
                  Developer Login
                  <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-white/60"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span className="text-sm">Free for Developers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Instant Setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-sm">For All Sizes</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Code Example */}
        <motion.div className="relative" variants={itemVariants}>
          <div className="bg-black backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-white/60 text-sm">Quick Start</div>
            </div>
            <pre className="text-green-400 text-sm leading-relaxed">
              <code>
                {`// Get started in 2 minutes
const faydapass = new FaydaPass({
  apiKey: 'fp_dev_your_key'
});

// Verify a user
const result = await faydapass.verifyUser(
  'user@yourcompany.com'
);

console.log(result.status); // "success"`}
              </code>
            </pre>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">2 min</div>
              <div className="text-xs text-white/60">Setup Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-xs text-white/60">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">Free</div>
              <div className="text-xs text-white/60">Developer Plan</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Home;

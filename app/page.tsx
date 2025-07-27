"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Users,
  Zap,
  CheckCircle,
  Building2,
  Briefcase,
  Code,
  BookOpen,
  Sparkles,
  Star,
  Github,
  Play,
  Terminal,
  Layers,
  Lock,
  Globe,
  Rocket,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-55 glass-effect border-b border-white/20">
        <div className="mad-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-dark-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-dark-900">FaydaPass</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="">
                API
              </Link>
              <Link href="#example" className="">
                Example
              </Link>
              <Link href="/admin" className="">
                Admin
              </Link>
              <Link href="/docs" className="">
                Documentation
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      {/* Features Section */}
      {/* Documentation */}
      {/* Footer */}
    </div>
  );
};

export default HomePage;

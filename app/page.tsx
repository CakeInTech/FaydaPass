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

function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-effect border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-dark-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-dark-900">FaydaPass</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-dark-600 hover:text-dark-900 transition-colors font-medium"
              >
                API
              </Link>
              <Link
                href="#examples"
                className="text-dark-600 hover:text-dark-900 transition-colors font-medium"
              >
                Examples
              </Link>
              <Link
                href="/admin"
                className="text-dark-600 hover:text-dark-900 transition-colors font-medium"
              >
                Admin
              </Link>
              <Link href="/docs">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-black hover:bg-white/10"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
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
}

export default HomePage;

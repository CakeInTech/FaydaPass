import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Badge,
  Sparkles,
  Code,
  Play,
  Star,
  Zap,
  BookOpen,
  Shield,
  ArrowRight,
  CheckCircle,
  Globe,
  Lock,
  Cpu,
  Database,
  Network,
} from "lucide-react";

const Home = ({ isVisible = true }: { isVisible?: boolean }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
      return () => hero.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Animation phases
  useEffect(() => {
    const phases = [0, 1, 2, 3];
    let currentPhase = 0;

    const interval = setInterval(() => {
      currentPhase = (currentPhase + 1) % phases.length;
      setAnimationPhase(currentPhase);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Star, label: "99.9% Uptime", value: "24/7" },
    { icon: Shield, label: "SOC 2 Compliant", value: "Secure" },
    { icon: Zap, label: "Response Time", value: "<100ms" },
    { icon: Globe, label: "API Calls/Month", value: "100M+" },
  ];

  const floatingIcons = [
    { Icon: Lock, delay: 0, color: "text-blue-400" },
    { Icon: Cpu, delay: 1000, color: "text-green-400" },
    { Icon: Database, delay: 2000, color: "text-purple-400" },
    { Icon: Network, delay: 3000, color: "text-orange-400" },
  ];

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden min-h-screen flex items-center justify-center"
    >
      {/* Dynamic Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
        }}
      />

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, color }, index) => (
        <div
          key={index}
          className={`absolute ${color} opacity-20`}
          style={{
            left: `${10 + index * 20}%`,
            top: `${20 + index * 15}%`,
            animation: `float-icon-${index} 6s infinite ease-in-out`,
            animationDelay: `${delay}ms`,
            transform: `scale(${1 + mousePos.x * 0.2})`,
          }}
        >
          <Icon size={40} />
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge with pulsing effect */}
        <div
          className={`transform transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center justify-center mb-8">
            <Badge className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-white/30 px-6 py-3 text-sm font-semibold backdrop-blur-xl rounded-full shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105">
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Developer-First KYC Platform
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400/30 to-purple-400/30 animate-pulse" />
            </Badge>
          </div>
        </div>

        {/* 3D Floating Logo */}
        <div
          className={`transform transition-all duration-1000 delay-400 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div
            className="relative inline-block mb-12 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={`w-32 h-32 bg-gradient-to-br from-indigo-400/30 to-purple-600/30 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 transition-all duration-500 ${
                isHovered ? "transform rotate-12 scale-110" : ""
              }`}
              style={{
                boxShadow: `
                  0 25px 50px -12px rgba(99, 102, 241, 0.5),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `,
                transform: `
                  perspective(1000px)
                  rotateX(${mousePos.y * 10 - 5}deg)
                  rotateY(${mousePos.x * 10 - 5}deg)
                  ${isHovered ? "rotateZ(12deg) scale(1.1)" : ""}
                `,
              }}
            >
              <Code className="w-16 h-16 text-white animate-pulse" />

              {/* Orbiting elements */}
              <div className="absolute inset-0">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    style={{
                      animation: `orbit-${i} ${3 + i}s infinite linear`,
                      left: "50%",
                      top: "50%",
                      transformOrigin: `${60 + i * 10}px center`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Title with Gradient Animation */}
        <div
          className={`transform transition-all duration-1000 delay-600 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-6xl lg:text-8xl font-black text-white mb-8 leading-tight">
            The KYC API
            <br />
            <span
              className="relative inline-block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(
                  ${45 + animationPhase * 90}deg,
                  #60a5fa,
                  #a855f7,
                  #ec4899,
                  #60a5fa
                )`,
                backgroundSize: "400% 400%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                animation: "gradient-shift 3s ease-in-out infinite",
              }}
            >
              Developers Love
            </span>
          </h1>
        </div>

        {/* Subtitle with Typewriter Effect */}
        <div
          className={`transform transition-all duration-1000 delay-800 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <p className="text-2xl lg:text-3xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
            Integrate Ethiopian KYC verification in
            <span className="text-indigo-400 font-semibold"> minutes</span>, not
            months.
            <br />
            Built on Fayda eSignet with a modern REST API that
            <span className="text-purple-400 font-semibold"> just works</span>.
          </p>
        </div>

        {/* CTA Buttons with Advanced Hover Effects */}
        <div
          className={`transform transition-all duration-1000 delay-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <button className="group relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-10 py-5 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center">
                <BookOpen className="mr-3 w-6 h-6" />
                Read Documentation
                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>

            <Link href="/verify">
              <button className="group relative border-2 border-white/30 text-white px-10 py-5 text-lg font-bold rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center">
                  <Shield className="mr-3 w-6 h-6" />
                  Start Verification
                  <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            </Link>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div
          className={`transform transition-all duration-1000 delay-1200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map(({ icon: Icon, label, value }, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                style={{
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  animationDelay: `${index * 200}ms`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <Icon className="w-8 h-8 text-indigo-400 mb-3 mx-auto group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {value}
                  </div>
                  <div className="text-sm text-white/70">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div
          className={`transform transition-all duration-1000 delay-1400 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="mt-16 flex items-center justify-center space-x-8 text-white/60">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">Enterprise Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">Bank-Grade Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">Lightning Fast</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  Code,
  Globe,
  Menu,
  Shield,
  X,
  Zap,
} from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      name: "API",
      href: "#features",
      icon: Code,
      description: "RESTful endpoints",
    },
    {
      name: "Examples",
      href: "#examples",
      icon: Globe,
      description: "Live implementations",
    },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "navbar-glass shadow-2xl shadow-primary-500/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative w-12 h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-dark-900 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Shield className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>

              <div className="flex flex-col">
                <span className="text-2xl font-black text-white group-hover:text-primary-300 transition-colors duration-300">
                  FaydaPass
                </span>
                <span className="text-xs text-white/60 font-medium tracking-wide">
                  KYC API Platform
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.name}
                    className="relative group"
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <a
                      href={item.href}
                      className="relative px-6 py-3 text-white/80 hover:text-white font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2 hover:bg-white/10 backdrop-blur-sm"
                    >
                      <IconComponent className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                      <span>{item.name}</span>

                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </a>

                    {/* Tooltip */}
                    {hoveredItem === index && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-dark-900/90 backdrop-blur-xl text-white/90 text-sm rounded-lg border border-primary-500/20 shadow-2xl opacity-0 animate-fade-in">
                        {item.description}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-dark-900 rotate-45 border-l border-t border-primary-500/20" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Documentation Button */}
              <a href="/docs" className="ml-4">
                <button className="group relative bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-primary-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Documentation</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden relative w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="navbar-glass">
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center space-x-3 text-white/80 hover:text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                  >
                    <IconComponent className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-sm text-white/50">
                        {item.description}
                      </span>
                    </div>
                  </a>
                );
              })}

              <div className="pt-4 border-t border-white/20">
                <a
                  href="/docs"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Documentation</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-20" />

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;

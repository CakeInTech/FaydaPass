"use client";

import {
  ArrowRight,
  Code,
  Globe,
  Menu,
  Shield,
  X
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const DocsNavbar = () => {
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
            ? "bg-black shadow-2xl shadow-primary-500/10"
            : "bg-black"
        } py-4`}
      >
        <div className="max-w-full mx-auto px-6 flex justify-between items-center">
          {/* Logo - Adjusted for Docs Navbar */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-dark-900 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white">FaydaPass</span>
              <span className="text-xs text-white/60 font-medium tracking-wide">
                KYC API Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Example of a dropdown, similar to the screenshot */}
            <div className="relative group">
              <button
                className="text-white/80 hover:text-white transition-colors duration-200 focus:outline-none flex items-center space-x-2"
                onMouseEnter={() => setHoveredItem(0)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Products
                <ArrowRight
                  className={`w-4 h-4 transform transition-transform duration-200 ${
                    hoveredItem === 0 ? "rotate-90" : "rotate-0"
                  }`}
                />
              </button>
              {hoveredItem === 0 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-4 p-4 rounded-xl shadow-lg bg-dark-950 ring-1 ring-white/10 animate-fade-in w-64">
                  {navItems.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.href}
                      className="flex items-center space-x-3 p-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200 group"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0 opacity-70 group-hover:opacity-100" />
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className="text-sm text-white/50">
                          {item.description}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/docs"
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              Docs
            </Link>
            <Link
              href="/pricing"
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              Contact
            </Link>
         
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white focus:outline-none"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-dark-900 px-6 pt-4 pb-6 mt-4 border-t border-white/10 animate-fade-in">
            <div className="space-y-4">
              {navItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200"
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    <span className="text-sm text-white/50">
                      {item.description}
                    </span>
                  </div>
                </a>
              ))}
              <Link
                href="/docs"
                onClick={() => setMobileOpen(false)}
                className="block text-white/80 hover:text-white transition-colors duration-200 py-2"
              >
                Docs
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="block text-white/80 hover:text-white transition-colors duration-200 py-2"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block text-white/80 hover:text-white transition-colors duration-200 py-2"
              >
                Contact
              </Link>
              <button className="w-full bg-primary-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-primary-600 transition-colors duration-300">
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default DocsNavbar;

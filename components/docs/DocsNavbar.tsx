"use client";

import {
  ArrowRight,
  Github,
  Menu,
  Search,
  Shield,
  X,
  BookOpen,
  Code,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const DocsNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Documentation", href: "/docs", icon: BookOpen },
    { name: "API Reference", href: "/docs#api-reference", icon: Code },
    { name: "Examples", href: "/docs#examples", icon: Code },
    { name: "Community", href: "/docs#contributing", icon: Users },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/95 backdrop-blur-sm border-b border-gray-800 shadow-lg"
            : "bg-black"
        } py-3`}
      >
        <div className="max-w-full mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-dark-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors duration-200">
                FaydaPass
              </span>
              <span className="text-xs text-gray-400 font-medium">
                Documentation
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 flex items-center space-x-2"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Right side utilities */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">
                v1.0
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <a
                href="https://github.com/CakeInTech/faydapass"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </a>
            </Button>

            <div className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-md px-3 py-2 cursor-pointer transition-colors duration-200 group">
              <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
              <span className="text-gray-400 text-sm group-hover:text-gray-300">
                Search docs...
              </span>
              <kbd className="bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded text-xs">
                ⌘K
              </kbd>
            </div>

            <Link href="/verify">
              <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium">
                Try Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-700 mt-4">
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white py-2 transition-colors duration-200"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-700 space-y-3">
                <a
                  href="https://github.com/CakeInTech/faydapass"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white py-2 transition-colors duration-200"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>

                <Link href="/verify" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium">
                    Try Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default DocsNavbar;

"use client";

import {
  BookOpen,
  ChevronDown,
  Code,
  Cpu,
  Database,
  Lock,
  Network,
  Terminal,
  Shield,
  Zap,
  Users,
  Settings,
  AlertTriangle,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Heading {
  id: string;
  title: string;
}

interface DocsSidebarProps {
  headings: Heading[];
}

export function DocsSidebar({ headings }: DocsSidebarProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "getting-started",
    "core-concepts",
  ]);

  const sidebarSections = [
    {
      title: "Getting Started",
      id: "getting-started",
      icon: BookOpen,
      items: [
        { href: "#about-faydapass", label: "About FaydaPass", icon: BookOpen },
        { href: "#key-features", label: "Key Features", icon: Zap },
        { href: "#quick-start", label: "Quick Start", icon: Rocket },
        { href: "#installation", label: "Installation", icon: Code },
      ],
    },
    {
      title: "Core Concepts",
      id: "core-concepts",
      icon: Cpu,
      items: [
        { href: "#configuration", label: "Configuration", icon: Settings },
        {
          href: "#authentication-flow",
          label: "Authentication Flow",
          icon: Shield,
        },
        { href: "#security", label: "Security", icon: Lock },
      ],
    },
    {
      title: "API Reference",
      id: "api-reference",
      icon: Code,
      items: [
        { href: "#api-reference", label: "API Endpoints", icon: Network },
        { href: "#examples", label: "Code Examples", icon: Code },
      ],
    },
    {
      title: "Deployment",
      id: "deployment",
      icon: Rocket,
      items: [
        { href: "#deployment", label: "Deployment Guide", icon: Rocket },
        {
          href: "#troubleshooting",
          label: "Troubleshooting",
          icon: AlertTriangle,
        },
      ],
    },
    {
      title: "Community",
      id: "community",
      icon: Users,
      items: [{ href: "#contributing", label: "Contributing", icon: Users }],
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id) setActiveId(id);
          }
        });
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 0,
      }
    );

    const sections = document.querySelectorAll(
      "section[id], h1[id], h2[id], h3[id]"
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <aside className="hidden lg:block fixed top-20 left-0 w-64 h-[calc(100vh-80px)] overflow-y-auto border-r border-gray-700 bg-black p-6 z-40">
      <div className="mb-6">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">
          Documentation
        </h3>
      </div>

      <nav className="space-y-1">
        {sidebarSections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          return (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <section.icon className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                  <span>{section.title}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-4">
                  {section.items.map((item) => {
                    const isActive = item.href.substring(1) === activeId;
                    return (
                      <Link key={item.href} href={item.href} scroll={false}>
                        <div
                          className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                            isActive
                              ? "bg-primary-600/20 text-primary-400 border-r-2 border-primary-400"
                              : "text-gray-400 hover:bg-gray-800 hover:text-primary-400"
                          }`}
                        >
                          <item.icon
                            className={`w-4 h-4 ${
                              isActive ? "text-primary-400" : "text-gray-500"
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Quick Links */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <h4 className="text-white font-medium text-sm mb-3">Quick Links</h4>
        <div className="space-y-2">
          <a
            href="https://github.com/CakeInTech/faydapass"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-400 hover:text-white text-sm transition-colors duration-200"
          >
            <Code className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a
            href="/verify"
            className="flex items-center space-x-2 text-gray-400 hover:text-white text-sm transition-colors duration-200"
          >
            <Shield className="w-4 h-4" />
            <span>Try Demo</span>
          </a>
        </div>
      </div>
    </aside>
  );
}

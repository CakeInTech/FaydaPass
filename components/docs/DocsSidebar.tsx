"use client"

import { BookOpen, ChevronDown, Code, Cpu, Database, Lock, Network, Terminal } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Heading {
  id: string
  title: string
}

interface DocsSidebarProps {
  headings: Heading[]
}

export function DocsSidebar({ headings }: DocsSidebarProps) {
  const [activeId, setActiveId] = useState<string>("")
  const [expandedSections, setExpandedSections] = useState<string[]>(["getting-started"])

  const sidebarSections = [
    {
      title: "Getting Started",
      id: "getting-started",
      icon: BookOpen,
      items: [
        { href: "#introduction", label: "Introduction", icon: BookOpen },
        { href: "#installation", label: "Installation", icon: Code },
      ],
    },
    {
      title: "Configuration",
      id: "configuration",
      icon: Code,
      items: [
        { href: "#basic-config", label: "Basic Configuration", icon: Code },
        { href: "#advanced-config", label: "Advanced Configuration", icon: Cpu },
      ],
    },
    {
      title: "Providers",
      id: "providers",
      icon: Database,
      items: [
        { href: "#oauth-providers", label: "OAuth Providers", icon: Database },
        { href: "#email-provider", label: "Email Provider", icon: Network },
      ],
    },
    {
      title: "Adapters",
      id: "adapters",
      icon: Cpu,
      items: [{ href: "#database-adapters", label: "Database Adapters", icon: Database }],
    },
    {
      title: "Warnings",
      id: "warnings",
      icon: Lock,
      items: [{ href: "#security-warnings", label: "Security Warnings", icon: Lock }],
    },
    {
      title: "Errors",
      id: "errors",
      icon: Terminal,
      items: [{ href: "#common-errors", label: "Common Errors", icon: Terminal }],
    },
    {
      title: "Deployment",
      id: "deployment",
      icon: Network,
      items: [{ href: "#vercel-deployment", label: "Vercel", icon: Network }],
    },
    {
      title: "Guides",
      id: "guides",
      icon: BookOpen,
      items: [{ href: "#typescript-guide", label: "TypeScript", icon: Code }],
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id")
            if (id) setActiveId(id)
          }
        })
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 0,
      },
    )

    const sections = document.querySelectorAll("section[id], h1[id], h2[id], h3[id]")
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  return (
    <aside className="hidden lg:block fixed top-20 left-0 w-64 h-[calc(100vh-80px)] overflow-y-auto border-r border-gray-700 bg-black p-6 z-40">
      <nav className="space-y-1">
        {sidebarSections.map((section) => {
          const isExpanded = expandedSections.includes(section.id)
          return (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <section.icon className="w-4 h-4 text-gray-500" />
                  <span>{section.title}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {isExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {section.items.map((item) => {
                    const isActive = item.href.substring(1) === activeId
                    return (
                      <Link key={item.href} href={item.href} scroll={false}>
                        <div
                          className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                            isActive
                              ? "bg-primary-600/20 text-primary-400 border-r-2 border-primary-400"
                              : "text-gray-400 hover:bg-gray-800 hover:text-primary-400"
                          }`}
                        >
                          <item.icon className={`w-4 h-4 ${isActive ? "text-primary-400" : "text-gray-500"}`} />
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
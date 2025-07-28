"use client";

import { ArrowRight, BookOpen, Code, Cpu, Database, Github, Lock, Network, Terminal, Users } from "lucide-react";
import Link from 'next/link';
import React from 'react';

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const sidebarLinks = [
    { href: "#getting-started", label: "Getting Started", icon: BookOpen },
    { href: "#configuration", label: "Configuration", icon: Code },
    { href: "#adapters", label: "Adapters", icon: Cpu },
    { href: "#providers", label: "Providers", icon: Database },
    { href: "#warnings", label: "Warnings", icon: Lock },
    { href: "#errors", label: "Errors", icon: Terminal },
    { href: "#deployment", label: "Deployment", icon: Network },
    { href: "#guides", label: "Guides", icon: BookOpen },
    { href: "#about-faydapass", label: "About FaydaPass", icon: Users },
    { href: "#flexible-and-easy-to-use", label: "Flexible and easy to use", icon: Code },
    { href: "#own-your-own-data", label: "Own your own data", icon: Database },
    { href: "#secure-by-default", label: "Secure by default", icon: Lock },
    { href: "#credits", label: "Credits", icon: Github },
    { href: "#getting-started-next-steps", label: "Getting Started (Next Steps)", icon: ArrowRight },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed top-20 left-0 w-64 h-[calc(100vh-80px)] overflow-y-auto bg-black p-6 z-40 border-r border-black hidden lg:block">
  <nav className="space-y-2">
    {sidebarLinks.map((link, index) => (
      <Link key={index} href={link.href}>
        <div className="flex items-center space-x-3 py-2 px-3 rounded-md text-white/80 hover:bg-white/10 hover:text-primary-500 transition-colors duration-200 group">
          <link.icon className="w-4 h-4 text-white/60 group-hover:text-primary-500 transition-colors duration-200" />
          <span>{link.label}</span>
        </div>
      </Link>
    ))}
    
    {/* <div className="mt-6 pt-4 border-t border-dark-800">
      <div className="text-xs text-white/50 mb-2">Sponsored</div>
      <a href="#" className="block p-4 bg-dark-800 rounded-lg text-white/90 hover:bg-dark-700 transition-colors duration-200">
        <h4 className="font-semibold text-sm mb-1">Scale Your Workloads</h4>
        <p className="text-xs text-white/70">with GPUs / Dual power supply / Up to 25 Gbps network / 99.99% SLA. Shop now!</p>
      </a>
    </div> */}
  </nav>
</aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 pt-20 p-8 bg-black text-white"> 
        <div className="max-w-4xl mx-auto"> 
          {children}
        </div>
      </main>
    </div>
  );
}

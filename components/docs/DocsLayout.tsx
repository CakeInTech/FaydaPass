"use client";

import type React from "react";
import { TableOfContents } from "./TableOfContents";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Main content with right sidebar */}
      <main className="flex-1 lg:ml-64 flex">
        {/* Content area */}
        <div className="flex-1 p-8 pt-20 max-w-4xl">
          <article className="prose prose-invert max-w-none">
            {children}
          </article>

          {/* Navigation footer */}
          <div className="mt-16 pt-8 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Last updated: {new Date().toLocaleDateString()}
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com/CakeInTech/faydapass/edit/main/docs/introduction.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200"
                >
                  Edit this page
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar - Table of Contents */}
        <aside className="hidden xl:block w-64 p-6 pt-20 sticky top-0 h-screen overflow-y-auto border-l border-gray-700">
          <TableOfContents />
        </aside>
      </main>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 transform hover:scale-110"
          size="sm"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

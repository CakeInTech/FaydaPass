"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { List, ChevronRight } from "lucide-react";

interface TocEntry {
  level: number;
  text: string;
  id: string;
}

export function TableOfContents() {
  const [toc, setToc] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll("main h2, main h3, main h4")
    ).map((el) => ({
      level: Number.parseInt(el.tagName.substring(1), 10),
      text: el.textContent || "",
      id: el.id,
    }));
    setToc(headings);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      toc.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [toc]);

  if (toc.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <List className="w-4 h-4 text-gray-400" />
        <p className="font-semibold text-white text-sm">On This Page</p>
      </div>

      <nav className="space-y-1">
        {toc.map(({ id, level, text }) => (
          <a
            key={id}
            href={`#${id}`}
            className={cn(
              "group flex items-start space-x-2 text-sm no-underline transition-all duration-200 py-1 px-2 rounded-md hover:bg-gray-800",
              id === activeId
                ? "font-medium text-primary-400 bg-primary-500/10 border-l-2 border-primary-400"
                : "text-gray-400 hover:text-gray-200",
              level === 3 && "ml-4",
              level === 4 && "ml-8"
            )}
          >
            {id === activeId && (
              <ChevronRight className="w-3 h-3 text-primary-400 mt-0.5 flex-shrink-0" />
            )}
            <span
              className={cn(
                "leading-5",
                id !== activeId && level > 2 && "ml-3"
              )}
            >
              {text}
            </span>
          </a>
        ))}
      </nav>

      {/* Progress indicator */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-500 mb-2">Reading Progress</div>
        <div className="w-full bg-gray-800 rounded-full h-1">
          <div
            className="bg-primary-500 h-1 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(
                100,
                ((toc.findIndex((item) => item.id === activeId) + 1) /
                  toc.length) *
                  100
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

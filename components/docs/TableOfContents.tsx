"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface TocEntry {
  level: number
  text: string
  id: string
}

export function TableOfContents() {
  const [toc, setToc] = useState<TocEntry[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll("main h2, main h3")
    ).map((el) => ({
      level: parseInt(el.tagName.substring(1), 10),
      text: el.textContent || "",
      id: el.id,
    }))
    setToc(headings)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: `0% 0% -80% 0%` }
    )

    toc.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => {
      toc.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el) observer.unobserve(el)
      })
    }
  }, [toc])

  if (toc.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <ul className="space-y-2">
        {toc.map(({ id, level, text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={cn(
                "inline-block text-sm no-underline transition-colors hover:text-primary",
                id === activeId
                  ? "font-medium text-primary"
                  : "text-muted-foreground",
                level === 3 && "pl-4"
              )}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
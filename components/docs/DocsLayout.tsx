"use client"

import type React from "react"
import { TableOfContents } from "./TableOfContents"

interface DocsLayoutProps {
  children: React.ReactNode
}

export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Main content with right sidebar */}
      <main className="flex-1 lg:ml-64 flex">
        {/* Content area */}
        <div className="flex-1 p-8 pt-20 max-w-4xl">{children}</div>

        {/* Right sidebar - Table of Contents */}
        <aside className="hidden xl:block w-64 p-6 pt-20 sticky top-0 h-screen overflow-y-auto border-l border-gray-700">
          <TableOfContents />
        </aside>
      </main>
    </div>
  )
}

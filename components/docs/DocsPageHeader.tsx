"use client"

interface DocsPageHeaderProps {
  heading: string
  text?: string
}

export function DocsPageHeader({ heading, text }: DocsPageHeaderProps) {
  return (
    <header className="mb-12">
      <div className="flex items-center space-x-2 mb-4">
        <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-sm font-medium">Version: v4</span>
      </div>
      <h1 className="text-5xl font-bold text-white leading-tight mb-6">{heading}</h1>
      {text && <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">{text}</p>}
    </header>
  )
}

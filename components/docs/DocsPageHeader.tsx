"use client";


interface DocsPageHeaderProps {
  heading: string;
  text?: string;
}

export function DocsPageHeader({ heading, text }: DocsPageHeaderProps) {
  return (
    <div className="mb-12">
      <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
        {heading}
      </h1>
      {text && <p className="text-xl text-white/80 leading-relaxed">{text}</p>}
    </div>
  );
}

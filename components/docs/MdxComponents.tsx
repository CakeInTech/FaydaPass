"use client";

import React from "react";

// Define a type for common HTML attributes for flexibility
type HTMLProps<T> = React.HTMLAttributes<T> & React.RefAttributes<T>;

export const MdxComponents = {
  h1: (props: HTMLProps<HTMLHeadingElement>) => (
    <h1 className="text-4xl font-bold text-white mb-6 mt-10" {...props} />
  ),
  h2: (props: HTMLProps<HTMLHeadingElement>) => (
    <h2 className="text-3xl font-bold text-white mb-5 mt-8 border-b border-dark-800 pb-2" {...props} />
  ),
  h3: (props: HTMLProps<HTMLHeadingElement>) => (
    <h3 className="text-2xl font-semibold text-white mb-4 mt-6" {...props} />
  ),
  h4: (props: HTMLProps<HTMLHeadingElement>) => (
    <h4 className="text-xl font-semibold text-white mb-3 mt-5" {...props} />
  ),
  p: (props: HTMLProps<HTMLParagraphElement>) => (
    <p className="text-lg text-white/80 leading-relaxed mb-4" {...props} />
  ),
  ul: (props: HTMLProps<HTMLUListElement>) => (
    <ul className="list-disc pl-6 text-lg text-white/80 space-y-2 mb-4" {...props} />
  ),
  ol: (props: HTMLProps<HTMLOListElement>) => (
    <ol className="list-decimal pl-6 text-lg text-white/80 space-y-2 mb-4" {...props} />
  ),
  li: (props: HTMLProps<HTMLLIElement>) => (
    <li className="text-white/80" {...props} />
  ),
  a: (props: HTMLProps<HTMLAnchorElement>) => (
    <a className="text-primary-500 hover:underline transition-colors duration-200" {...props} />
  ),
  strong: (props: HTMLProps<HTMLElement>) => (
    <strong className="font-bold text-white" {...props} />
  ),
  code: (props: HTMLProps<HTMLElement>) => (
    <code className="bg-dark-800 text-primary-300 px-2 py-1 rounded text-sm font-mono" {...props} />
  ),
  pre: (props: HTMLProps<HTMLPreElement>) => (
    <pre className="bg-dark-950 p-4 rounded-lg overflow-x-auto text-sm font-mono text-green-400 my-4 border border-dark-800" {...props} />
  ),
  table: (props: HTMLProps<HTMLTableElement>) => (
    <table className="w-full text-left border-collapse my-6" {...props} />
  ),
  th: (props: HTMLProps<HTMLTableCellElement>) => (
    <th className="py-2 px-4 border-b border-dark-700 text-white font-semibold bg-dark-800" {...props} />
  ),
  td: (props: HTMLProps<HTMLTableCellElement>) => (
    <td className="py-2 px-4 border-b border-dark-800 text-white/80" {...props} />
  ),
  blockquote: (props: HTMLProps<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-primary-500 pl-4 italic text-white/70 my-4" {...props} />
  ),
};

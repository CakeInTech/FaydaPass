import { ReactNode } from "react";

export const MdxComponents = {
  h1: ({ children, ...props }: { children: ReactNode }) => (
    <h1
      className="text-4xl font-bold text-white mb-6 mt-8 scroll-mt-20"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: { children: ReactNode }) => (
    <h2
      className="text-3xl font-bold text-white mb-4 mt-12 scroll-mt-20 border-b border-gray-700 pb-2"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: { children: ReactNode }) => (
    <h3
      className="text-2xl font-semibold text-white mb-3 mt-8 scroll-mt-20"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: { children: ReactNode }) => (
    <h4 className="text-xl font-semibold text-white mb-2 mt-6" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: { children: ReactNode }) => (
    <p className="text-gray-300 leading-7 mb-4" {...props}>
      {children}
    </p>
  ),
  a: ({ children, href, ...props }: { children: ReactNode; href?: string }) => (
    <a
      href={href}
      className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors duration-200"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }: { children: ReactNode }) => (
    <ul
      className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: { children: ReactNode }) => (
    <ol
      className="list-decimal list-inside text-gray-300 space-y-2 mb-4 ml-4"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: { children: ReactNode }) => (
    <li className="text-gray-300" {...props}>
      {children}
    </li>
  ),
  code: ({ children, ...props }: { children: ReactNode }) => (
    <code
      className="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm font-mono"
      {...props}
    >
      {children}
    </code>
  ),
  blockquote: ({ children, ...props }: { children: ReactNode }) => (
    <blockquote
      className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-4"
      {...props}
    >
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }: { children: ReactNode }) => (
    <div className="overflow-x-auto my-6">
      <table
        className="min-w-full border border-gray-700 rounded-lg"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: { children: ReactNode }) => (
    <thead className="bg-gray-800" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: { children: ReactNode }) => (
    <tbody className="bg-gray-900" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }: { children: ReactNode }) => (
    <tr className="border-b border-gray-700" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: { children: ReactNode }) => (
    <th className="px-4 py-2 text-left text-white font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: { children: ReactNode }) => (
    <td className="px-4 py-2 text-gray-300" {...props}>
      {children}
    </td>
  ),
};

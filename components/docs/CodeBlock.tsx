"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative group my-6">
      {filename && (
        <div className="flex items-center justify-between bg-gray-800 border border-gray-700 border-b-0 rounded-t-lg px-4 py-2">
          <span className="text-sm text-gray-300 font-mono">{filename}</span>
          <span className="text-xs text-gray-500 uppercase">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre
          className={`bg-gray-900 border border-gray-700 ${
            filename ? "rounded-b-lg" : "rounded-lg"
          } p-4 overflow-x-auto text-sm`}
        >
          <code className={`language-${language} text-gray-300`}>{code}</code>
        </pre>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 hover:bg-gray-700 border border-gray-600"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </Button>
      </div>
    </div>
  );
}

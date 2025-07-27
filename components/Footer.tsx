// components/Footer.tsx
"use client";
import { Shield } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-black p-6 mt-12 w-full bg-[#E43F6F]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ">
        
        <div className="flex items-center space-x-2 p-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-dark-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-dark-900">FaydaPass</span>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/" className="text-primary-500 hover:underline">Home</Link>
          <Link href="#features" className="text-primary-500 hover:underline">API</Link>
          <Link href="#examples" className="text-primary-500 hover:underline">Examples</Link>
          <Link href="/admin" className="text-primary-500 hover:underline">Admin</Link>
          <Link href="/docs" className="text-primary-500 hover:underline">Documentation</Link>
        </nav>
      </div>

      <div className="text-center text-xs text-gray-600 mt-4">
        © {new Date().getFullYear()} FaydaPass. All rights reserved.
      </div>
    </footer>
  );
}

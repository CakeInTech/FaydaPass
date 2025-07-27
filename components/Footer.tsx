// components/Footer.tsx
"use client";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="text-black p-6 mt-12 w-full bg-[#24050E]">
      <div className="flex flex-col items-center justify-center mx-auto max-w-screen-sm gap-4">
        <div className="flex items-center space-x-2 p-4">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-dark-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white group-hover:text-primary-300 transition-colors duration-300">
              FaydaPass
            </span>
            <span className="text-xs text-white/60 font-medium tracking-wide">
              KYC API Platform
            </span>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-300 mt-4">
        © {new Date().getFullYear()} The developer-first KYC platform for Ethiopia.
      </div>
    </footer>
  );
}

"use client"

import { ArrowRight, Github, Menu, Moon, Search, Shield, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const DocsNavbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/95 backdrop-blur-sm border-b border-gray-800" : "bg-black"
        } py-3`}
      >
        <div className="max-w-full mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-dark-900 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">FaydaPass</span>
              <span className="text-xs text-gray-400 font-medium">KYC API Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/docs" className="text-white font-medium hover:text-primary-500 transition-colors duration-200">
              Documentation
            </Link>
            <Link href="/tutorials" className="text-gray-300 hover:text-primary-500 transition-colors duration-200">
              Tutorials
            </Link>
            <Link href="/faq" className="text-gray-300 hover:text-primary-500 transition-colors duration-200">
              FAQ
            </Link>
            <Link href="/security" className="text-gray-300 hover:text-primary-500 transition-colors duration-200">
              Security
            </Link>
          </div>

          {/* Right side utilities */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>v4</span>
              <ArrowRight className="w-3 h-3" />
            </div>
            <button className="p-2 text-gray-400 hover:text-primary-500 transition-colors">
              <Github className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-primary-500 transition-colors">
              <Moon className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 bg-gray-800 rounded-md px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Search</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white focus:outline-none">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-gray-900 px-6 pt-4 pb-6 mt-4 border-t border-gray-700">
            <div className="space-y-4">
              <Link href="/docs" onClick={() => setMobileOpen(false)} className="block text-white font-medium py-2">
                Documentation
              </Link>
              <Link
                href="/tutorials"
                onClick={() => setMobileOpen(false)}
                className="block text-gray-300 hover:text-primary-500 py-2"
              >
                Tutorials
              </Link>
              <Link
                href="/faq"
                onClick={() => setMobileOpen(false)}
                className="block text-gray-300 hover:text-primary-500 py-2"
              >
                FAQ
              </Link>
              <Link
                href="/security"
                onClick={() => setMobileOpen(false)}
                className="block text-gray-300 hover:text-primary-500 py-2"
              >
                Security
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}


export default DocsNavbar

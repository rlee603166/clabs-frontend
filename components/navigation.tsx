"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { List, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Use Cases", href: "#use-cases" },
    { name: "Docs", href: "#docs" },
    { name: "Pricing", href: "#pricing", disabled: true },
  ]

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: isScrolled ? 1 : 0,
          y: isScrolled ? 0 : -20,
        }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-md bg-[#252528]/80 border border-[#374151]/30 rounded-2xl px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-medium">Circl</div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`text-sm transition-colors ${
                      item.disabled ? "text-[#94a3b8] cursor-not-allowed" : "text-[#f8fafc] hover:text-[#3b82f6]"
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
                <Button asChild className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  <a href="/dashboard">Request Access</a>
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-[#f8fafc]">
                <List size={24} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#252528]/95 backdrop-blur-md border-l border-[#374151]/30"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-[#374151]/30">
                <div className="text-xl font-medium">Circl</div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-[#f8fafc]">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 px-6 py-8 space-y-6">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`block text-lg transition-colors ${
                      item.disabled ? "text-[#94a3b8] cursor-not-allowed" : "text-[#f8fafc] hover:text-[#3b82f6]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}

                <Button asChild className="w-full bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white px-4 py-3 rounded-lg font-medium mt-8">
                  <a href="/dashboard">Request Access</a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

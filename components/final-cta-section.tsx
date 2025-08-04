"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "@phosphor-icons/react"

export function FinalCTASection() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission
    console.log("Email submitted:", email)
    setEmail("")
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-medium">Ready to Build Agents That Deliver?</h2>

            <p className="text-xl text-[#94a3b8] leading-relaxed max-w-2xl mx-auto">
              Join our private beta and be the first to build on the Action Layer.
            </p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-[#252528]/60 border-[#374151]/30 text-[#f8fafc] placeholder-[#94a3b8] focus:border-[#3b82f6]/50 focus:ring-[#3b82f6]/20"
            />

            <Button
              type="submit"
              className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white px-6 py-3 rounded-lg font-medium group relative overflow-hidden"
            >
              <span className="flex items-center space-x-2">
                <span>Request Early Access</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>

              <motion.div
                className="absolute inset-0 bg-[#3b82f6]/30 rounded-lg blur-xl"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </Button>
          </motion.form>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-8 text-sm text-[#94a3b8] pt-8"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>
              <span>Early access only</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>Developer-first</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

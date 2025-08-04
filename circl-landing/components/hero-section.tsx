"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { HeroVisual } from "@/components/hero-visual"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-medium leading-tight">
              Build Agents That Actually{" "}
              <span className="text-[#3b82f6] relative">
                Do
                <motion.div
                  className="absolute -inset-2 bg-[#3b82f6]/20 rounded-lg blur-lg"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </span>{" "}
              Things.
            </h1>

            <p className="text-xl text-[#94a3b8] leading-relaxed max-w-2xl">
              Stop wrestling with brittle integrations. Circl unifies your SQL, Vector, and Graph data into an
              intelligent Action Layer, instantly generating robust tools for your AI agents.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white px-8 py-4 rounded-xl text-lg font-medium relative overflow-hidden group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.05 }}
              />
              <span className="relative z-10">Request Early Access</span>
              <motion.div
                className="absolute inset-0 bg-[#3b82f6]/30 rounded-xl blur-xl"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </Button>
          </motion.div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative"
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  )
}

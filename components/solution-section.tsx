"use client"

import { motion } from "framer-motion"
import { Database, VectorThree, Graph, ArrowRight, Sparkle, ArrowDown } from "@phosphor-icons/react"

export function SolutionSection() {
  const features = [
    {
      title: "Unified Data Hub",
      description: "Connect your data once. We handle the rest.",
      Icon: Database,
    },
    {
      title: "Canonical Entity Model",
      description: "A single, version-controlled source of truth for your agent.",
      Icon: Sparkle,
    },
    {
      title: "Auto-Generated Tools",
      description: "Instantly get robust, production-ready tools, not just CRUD wrappers.",
      Icon: VectorThree,
    },
    {
      title: "Smart Toolbelt",
      description: "Drastically reduce prompt size and improve accuracy.",
      Icon: Graph,
    },
  ]

  return (
    <section className="py-24 px-6" id="features">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-medium mb-6">The Action Layer for Intelligent Agents.</h2>
        </motion.div>

        {/* Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="relative flex flex-col items-center space-y-8 mb-12">
            {/* Data Sources */}
            <div className="flex items-center justify-center space-x-12">
              {[
                { Icon: Database, color: "#336791", label: "SQL" },
                { Icon: VectorThree, color: "#00D4AA", label: "Vector" },
                { Icon: Graph, color: "#008CC1", label: "Graph" },
              ].map((source, index) => (
                <motion.div
                  key={source.label}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="w-16 h-16 rounded-xl backdrop-blur-md bg-[#252528]/60 border border-[#374151]/30 flex items-center justify-center">
                    <source.Icon size={24} style={{ color: source.color }} />
                  </div>
                  <span className="text-xs text-[#94a3b8] font-medium">{source.label}</span>

                  {/* Connection lines to the layer above */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    whileInView={{ opacity: 1, height: 24 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="w-px bg-gradient-to-t from-[#3b82f6]/40 to-transparent"
                  ></motion.div>
                </motion.div>
              ))}
            </div>

            {/* Circl Engine Layer - spans over data sources */}
            <div className="relative">
              {/* Circl Engine */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                viewport={{ once: true }}
                className="relative z-10 mx-auto"
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(59, 130, 246, 0.3)",
                      "0 0 40px rgba(59, 130, 246, 0.6)",
                      "0 0 20px rgba(59, 130, 246, 0.3)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="w-80 h-20 rounded-2xl backdrop-blur-md bg-[#3b82f6]/20 border border-[#3b82f6]/50 flex items-center justify-center"
                >
                  <div className="text-xl font-bold text-[#3b82f6]">Circl Engine</div>
                </motion.div>
              </motion.div>

              {/* Fabric/Layer effect - subtle connecting lines */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                viewport={{ once: true }}
                className="absolute inset-0 flex justify-center items-center pointer-events-none"
              >
                <div className="w-96 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/30 to-transparent"></div>
              </motion.div>
            </div>

            {/* Arrow pointing up */}
            {/* <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              viewport={{ once: true }}
              className="-rotate-180"
            > */}
            <ArrowDown size={32} className="text-[#3b82f6]" />
            {/* </motion.div> */}

            {/* API Endpoint */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="backdrop-blur-md bg-[#252528]/80 border border-[#374151]/30 rounded-xl px-6 py-4"
            >
              <div className="text-sm font-mono text-[#3b82f6]">/api/tools</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="backdrop-blur-md bg-[#252528]/60 border border-[#374151]/30 rounded-xl p-6 text-center group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#3b82f6]/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#3b82f6]/30 transition-colors">
                <feature.Icon size={24} className="text-[#3b82f6]" />
              </div>

              <h3 className="text-lg font-medium mb-3 text-[#f8fafc]">{feature.title}</h3>

              <p className="text-sm text-[#94a3b8] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

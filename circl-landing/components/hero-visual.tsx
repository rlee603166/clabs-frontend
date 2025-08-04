"use client"

import { motion } from "framer-motion"
import { Database, Graph, VectorThree, Code, Wrench } from "@phosphor-icons/react"

export function HeroVisual() {
  const leftIcons = [
    { Icon: Database, label: "Postgres", color: "#336791" },
    { Icon: VectorThree, label: "Pinecone", color: "#00D4AA" },
    { Icon: Graph, label: "Neo4j", color: "#008CC1" },
  ]

  const rightIcons = [
    { Icon: Code, label: "Tool 1" },
    { Icon: Wrench, label: "Tool 2" },
    { Icon: Code, label: "Tool 3" },
  ]

  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      {/* Left side - Chaotic database icons */}
      <div className="absolute left-0 space-y-8">
        {leftIcons.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            className="relative"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.5,
              }}
              className="w-16 h-16 rounded-xl backdrop-blur-md bg-[#252528]/60 border border-[#374151]/30 flex items-center justify-center"
            >
              <item.Icon size={32} style={{ color: item.color }} />
            </motion.div>

            {/* Tangled lines */}
            <motion.div
              className="absolute top-8 left-16 w-32 h-0.5 bg-gradient-to-r from-[#374151] to-transparent"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Center - Circl monolith */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="relative z-10"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 20px rgba(59, 130, 246, 0.3)",
              "0 0 40px rgba(59, 130, 246, 0.5)",
              "0 0 20px rgba(59, 130, 246, 0.3)",
            ],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          className="w-24 h-32 rounded-2xl backdrop-blur-md bg-[#3b82f6]/20 border border-[#3b82f6]/30 flex items-center justify-center"
        >
          <div className="text-2xl font-bold text-[#3b82f6]">C</div>
        </motion.div>
      </motion.div>

      {/* Right side - Clean tool icons */}
      <div className="absolute right-0 space-y-6">
        {rightIcons.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2 + index * 0.15, duration: 0.6 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 rounded-lg backdrop-blur-md bg-[#252528]/80 border border-[#374151]/30 flex items-center justify-center cursor-pointer"
            >
              <item.Icon size={24} className="text-[#f8fafc]" />
            </motion.div>

            {/* Clean lines */}
            <motion.div
              className="absolute top-7 right-14 w-24 h-0.5 bg-gradient-to-l from-[#3b82f6]/50 to-transparent"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1.5 + index * 0.2 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

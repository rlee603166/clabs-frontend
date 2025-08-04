"use client"

import { motion } from "framer-motion"
import { Database, Graph, VectorThree, Code, Wrench, CirclesThree, File, Cube, Leaf, Circle, Folder, OpenAiLogo } from "@phosphor-icons/react"

export function HeroVisual() {
  // Various data stores that get ingested
  const leftIcons = [
    { Icon: Database, label: "PostgreSQL", color: "#336791" },
    { Icon: Leaf, label: "MongoDB", color: "#47A248" },
    { Icon: Cube, label: "Redis", color: "#DC382D" },
    { Icon: File, label: "JSON/CSV", color: "#F7DF1E" },
    { Icon: Folder, label: "MySQL", color: "#4479A1" },
  ]

  // Core data representations inside Circl
  const coreNodes = [
    { Icon: Database, label: "SQL", color: "#336791", position: { x: -50, y: -20, z: 1000 } },
    { Icon: VectorThree, label: "Vector", color: "#00D4AA", position: { x: 50, y: -20, z: 1000 } },
    { Icon: Graph, label: "Graph", color: "#008CC1", position: { x: 0, y: 55, z: 1000 } },
  ]

  const rightIcons = [
    { Icon: OpenAiLogo, label: "Tool 1" },
    // { Icon: Wrench, label: "Tool 2" },
    { Icon: Code, label: "Tool 3" },
  ]

  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      {/* Left side - Various data store icons */}
      <div className="absolute left-0 space-y-4">
        {leftIcons.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            className="relative"
          >
            <motion.div
              animate={{
                rotate: [0, 3, -3, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                delay: 5,
              }}
              className="w-12 h-12 rounded-lg backdrop-blur-md bg-[#252528]/60 border border-[#374151]/30 flex items-center justify-center"
            >
              <item.Icon size={24} style={{ color: item.color }} />
            </motion.div>

            {/* Connection lines to center with proper curves */}
            <motion.svg
              className="absolute top-6 left-12 w-64 h-12 pointer-events-none"
              style={{ overflow: 'visible' }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.5, delay: 0.5 }}
            >
              <motion.path
                d={
                  index === 0 ? "M 0 6 Q 60 -20 120 6" : // Top - funnel in
                    index === 1 ? "M 0 6 Q 60 -15 120 6" : // Second - funnel in
                      index === 2 ? "M 0 6 L 120 6" :       // Redis - straight
                        index === 3 ? "M 0 6 Q 60 25 120 6" : // Fourth - funnel in
                          "M 0 6 Q 60 30 120 6" // Bottom - funnel in
                }
                stroke="#374151"
                strokeWidth="1.5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.5,
                  delay: 0.2 + index * 0.1,
                }}
              />
            </motion.svg>
          </motion.div>
        ))}
      </div>

      {/* Center - Circl with core data nodes */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="relative z-10"
      >
        {/* Main Circl container */}
        <motion.div
          animate={{
            scale: [1, 1.02],
            boxShadow: [
              "0 0 20px rgba(59, 130, 246, 0.3)",
              "0 0 40px rgba(59, 130, 246, 0.5)",
            ],
          }}
          transition={{ duration: 1, delay: 2.25 }}
          className="w-48 h-48 rounded-2xl backdrop-blur-md bg-[#3b82f6]/20 border border-[#3b82f6]/30 flex items-center justify-center relative"
        >
          <div className="absolute top-0 left-0 w-full h-full flex items-start justify-center">
            <div className="text-xl pt-5 font-bold text-[#3b82f6]">Circl Data Engine</div>
          </div>
          {/* Core data type nodes inside/around the C */}
          {coreNodes.map((node, index) => (
            <motion.div
              key={node.label}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2 + index * 0.2, duration: 0.6 }}
              className="absolute"
              style={{
                x: node.position.x,
                y: node.position.y,
                zIndex: 10
              }}
            >
              {/* Connection lines between nodes */}
              {index === 0 && (
                <>
                  {/* Line to Vector node (SQL to Vector) - horizontal */}
                  <motion.svg
                    className="absolute top-4 left-5 w-24 h-4 pointer-events-none"
                    style={{ zIndex: 1 }}
                    animate={{ opacity: [0.4, 1] }}
                    transition={{ duration: 2.5, delay: 1.8 }}
                  >
                    <motion.path
                      d="M 0 2 L 100 2"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 1.8 }}
                    />
                  </motion.svg>

                  {/* Line to Graph node (SQL to Graph) - diagonal down */}
                  <motion.svg
                    className="absolute top-4 left-5 w-16 h-24 pointer-events-none"
                    style={{ zIndex: 1 }}
                    animate={{ opacity: [0.4, 1] }}
                    transition={{ duration: 2.5, delay: 1.8 }}
                  >
                    <motion.path
                      d="M 0 2 L 50 90"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 1.8 }}
                    />
                  </motion.svg>
                </>
              )}
              {index === 1 && (
                /* Line from Vector to Graph - diagonal down */
                <motion.svg
                  className="absolute top-4 -left-11 w-16 h-24 pointer-events-none"
                  style={{ zIndex: 1 }}
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2.5, delay: 1.1 }}
                >
                  <motion.path
                    d="M 0 2 L -50 90"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                  />
                </motion.svg>
              )}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  boxShadow: [
                    `0 0 8px ${node.color}40`,
                    `0 0 16px ${node.color}60`,
                    `0 0 8px ${node.color}40`,
                  ],
                }}
                transition={{
                  duration: 3,
                  delay: index * 0.7
                }}
                className="w-10 h-10 rounded-lg backdrop-blur-md bg-[#252528]/90 border-2 border-[#374151]/60 flex items-center justify-center relative"
                style={{ zIndex: 2 }}
              >
                <node.Icon size={18} style={{ color: node.color }} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right side - Clean AI tool outputs */}
      <div className="absolute right-0 space-y-6">
        {rightIcons.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.8 + index * 0.15, duration: 0.6 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 rounded-lg backdrop-blur-md bg-[#252528]/80 border border-[#374151]/30 flex items-center justify-center cursor-pointer"
            >
              <item.Icon size={24} className="text-[#f8fafc]" />
            </motion.div>

            <motion.svg
              className="absolute top-7 right-14 w-28 h-1 pointer-events-none"
              style={{ overflow: 'visible' }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.5, delay: 2 + index * 0.15 }}
            >
              <defs>
                <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'rgba(59, 130, 246, 0)' }} />
                  <stop offset="100%" style={{ stopColor: 'rgba(59, 130, 246, 0.6)' }} />
                </linearGradient>
              </defs>
              <motion.path
                d="M 0 0.5 L 112 0.5"
                stroke={"#3b82f6"}
                strokeWidth="1.5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1,
                  delay: 2 + index * 0.15,
                }}
              />
            </motion.svg>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

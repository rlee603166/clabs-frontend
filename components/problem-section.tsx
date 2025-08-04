"use client"

import { motion } from "framer-motion"
import { Database, VectorThree, Graph } from "@phosphor-icons/react"

export function ProblemSection() {
  const problems = [
    {
      title: "Structured SQL",
      description: "Complex joins, migrations, and schema changes make your agents brittle and slow.",
      Icon: Database,
      logo: "Postgres",
      color: "#336791",
    },
    {
      title: "Semantic Vector",
      description: "Embedding drift, index management, and similarity search complexity.",
      Icon: VectorThree,
      logo: "Pinecone",
      color: "#00D4AA",
    },
    {
      title: "Relational Graph",
      description: "Query optimization, relationship modeling, and traversal performance issues.",
      Icon: Graph,
      logo: "Neo4j",
      color: "#008CC1",
    },
  ]

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-medium mb-6">Stuck in Syncing Hell?</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="backdrop-blur-md bg-[#252528]/60 border border-[#374151]/30 rounded-2xl p-8 h-full relative overflow-hidden">
                {/* Chaotic background effect */}
                <motion.div
                  className="absolute inset-0 opacity-10"
                  animate={{
                    rotate: [0, 2, -2, 0],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.5,
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl" />
                </motion.div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-lg bg-[#374151]/50 flex items-center justify-center">
                      <problem.Icon size={24} style={{ color: problem.color }} />
                    </div>
                    <div className="text-sm text-[#94a3b8] opacity-60">{problem.logo}</div>
                  </div>

                  <h3 className="text-xl font-medium mb-4 text-[#f8fafc]">{problem.title}</h3>

                  <p className="text-[#94a3b8] leading-relaxed">{problem.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { PlugsConnected, Cube, Wrench } from "@phosphor-icons/react"

export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Connect Sources",
      description: "Link your SQL, Vector, and Graph databases with simple configuration.",
      Icon: PlugsConnected,
    },
    {
      number: "2",
      title: "Define Entities",
      description: "Create a unified entity model that spans all your data sources.",
      Icon: Cube,
    },
    {
      number: "3",
      title: "Use Tools",
      description: "Get auto-generated, production-ready tools for your AI agents.",
      Icon: Wrench,
    },
  ]

  const codeExample = `// An agent needs to find at-risk customers
const atRiskCustomers = await circl.tools.find_customers_with_decreasing_usage();

for (const customer of atRiskCustomers) {
  // Now, find the right person to contact at that company
  const contact = await circl.tools.get_internal_champion({ 
    companyId: customer.companyId 
  });
  
  // ... alert the sales team
}`

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
          <h2 className="text-4xl lg:text-5xl font-medium mb-6">From Data to Action in 3 Steps.</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex items-start space-x-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#3b82f6]/20 border border-[#3b82f6]/30 flex items-center justify-center">
                    <span className="text-[#3b82f6] font-medium">{step.number}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <step.Icon size={24} className="text-[#3b82f6]" />
                    <h3 className="text-xl font-medium text-[#f8fafc]">{step.title}</h3>
                  </div>

                  <p className="text-[#94a3b8] leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Code Example */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="backdrop-blur-md bg-[#1a1a1a]/80 border border-[#374151]/30 rounded-2xl overflow-hidden">
              {/* Code Editor Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#374151]/30">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm text-[#94a3b8] font-mono">agent.ts</div>
              </div>

              {/* Code Content */}
              <div className="p-6">
                <pre className="text-sm font-mono text-[#f8fafc] leading-relaxed overflow-x-auto">
                  <code className="language-typescript">{codeExample}</code>
                </pre>
              </div>
            </div>

            {/* Glow effect */}
            <motion.div
              className="absolute -inset-4 bg-[#3b82f6]/10 rounded-3xl blur-2xl -z-10"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

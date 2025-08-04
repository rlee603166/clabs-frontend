"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Headset, TrendUp } from "@phosphor-icons/react"

export function UseCasesSection() {
  const [activeTab, setActiveTab] = useState(0)

  const useCases = [
    {
      title: "Autonomous Customer Support",
      icon: Headset,
      description: "AI agents that can resolve customer issues end-to-end",
      simulation: {
        query: 'Customer: "I was charged twice for my subscription this month"',
        steps: [
          { tool: "get_customer", action: "Retrieved customer profile and billing history" },
          { tool: "get_billing_history", action: "Found duplicate charge on 2024-01-15" },
          { tool: "create_refund", action: "Processed $29.99 refund automatically" },
        ],
        result: "Issue resolved in 12 seconds with full audit trail",
      },
    },
    {
      title: "Proactive Sales Intelligence",
      icon: TrendUp,
      description: "Identify opportunities and risks before they become problems",
      simulation: {
        query: "Daily analysis: Find accounts at risk of churn",
        steps: [
          { tool: "analyze_usage_patterns", action: "Identified 3 accounts with 40% usage drop" },
          { tool: "find_similar_successful_customers", action: "Found expansion patterns in similar accounts" },
          { tool: "alert_sales_team", action: "Sent targeted alerts to account managers" },
        ],
        result: "Prevented $180K in potential churn, identified $45K expansion opportunity",
      },
    },
  ]

  return (
    <section className="py-24 px-6" id="use-cases">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-medium mb-6">Powering Next-Generation Agents.</h2>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="backdrop-blur-md bg-[#252528]/60 border border-[#374151]/30 rounded-2xl p-2 flex">
              {useCases.map((useCase, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all ${activeTab === index
                    ? "bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30"
                    : "text-[#94a3b8] hover:text-[#f8fafc]"
                    }`}
                >
                  <useCase.icon size={20} />
                  <span className="font-medium">{useCase.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-md bg-[#252528]/60 border border-[#374151]/30 rounded-2xl p-8"
            >
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Description */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    {(() => {
                      const IconComponent = useCases[activeTab].icon
                      return <IconComponent size={32} className="text-[#3b82f6]" />
                    })()}
                    <h3 className="text-2xl font-medium text-[#f8fafc]">{useCases[activeTab].title}</h3>
                  </div>

                  <p className="text-[#94a3b8] text-lg leading-relaxed mb-6">{useCases[activeTab].description}</p>
                </div>

                {/* Simulation */}
                <div className="space-y-6">
                  {/* Query */}
                  <div className="backdrop-blur-md bg-[#1a1a1a]/60 border border-[#374151]/30 rounded-xl p-4">
                    <div className="text-sm text-[#3b82f6] font-medium mb-2">Input</div>
                    <div className="text-[#f8fafc] font-mono text-sm">{useCases[activeTab].simulation.query}</div>
                  </div>

                  {/* Steps Timeline */}
                  <div className="relative">
                    {/* Animated connecting line */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(useCases[activeTab].simulation.steps.length - 1) * 80 + 12}px` }}
                      transition={{ duration: 1, delay: 0.9 }}
                      className="absolute left-3 top-3 w-0.5 bg-gradient-to-b from-[#3b82f6] to-[#3b82f6]/30"
                    />

                    <div className="space-y-6">
                      {useCases[activeTab].simulation.steps.map((step, stepIndex) => (
                        <motion.div
                          key={stepIndex}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: stepIndex * 0.3 + 0.5,
                            duration: 0.6,
                            ease: "easeOut"
                          }}
                          className="flex items-start space-x-4 relative"
                        >
                          {/* Animated dot */}
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: stepIndex * 0.3 + 0.7,
                              duration: 0.4,
                              type: "spring",
                              stiffness: 200
                            }}
                            className="flex-shrink-0 w-6 h-6 rounded-full bg-[#3b82f6] border-2 border-[#1e293b] shadow-lg shadow-[#3b82f6]/25 z-10 relative"
                          >
                            {/* Inner glow */}
                            <div className="absolute inset-1 rounded-full bg-[#60a5fa] opacity-60" />
                          </motion.div>

                          {/* Content */}
                          <div className="flex-1 pt-0.5">
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: stepIndex * 0.3 + 0.9,
                                duration: 0.5
                              }}
                              className="text-sm font-mono text-[#3b82f6] mb-1"
                            >
                              {step.tool}
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: stepIndex * 0.3 + 1.1,
                                duration: 0.5
                              }}
                              className="text-sm text-[#94a3b8]"
                            >
                              {step.action}
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Result */}
                  <div className="backdrop-blur-md bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="text-sm text-green-400 font-medium mb-2">Result</div>
                    <div className="text-[#f8fafc] text-sm">{useCases[activeTab].simulation.result}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

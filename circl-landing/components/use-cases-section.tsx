"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Headset, TrendUp, ArrowRight } from "@phosphor-icons/react"

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
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all ${
                    activeTab === index
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

                  {/* Steps */}
                  <div className="space-y-3">
                    {useCases[activeTab].simulation.steps.map((step, stepIndex) => (
                      <motion.div
                        key={stepIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: stepIndex * 0.2 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#3b82f6]/20 border border-[#3b82f6]/30 flex items-center justify-center mt-1">
                          <ArrowRight size={12} className="text-[#3b82f6]" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-mono text-[#3b82f6] mb-1">{step.tool}</div>
                          <div className="text-sm text-[#94a3b8]">{step.action}</div>
                        </div>
                      </motion.div>
                    ))}
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

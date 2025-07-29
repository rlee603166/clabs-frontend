"use client"

import { useState } from "react"
import { Send, Trash2, Database, Network, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChatMessage } from "@/components/chat-message"

const demoMessages = [
  {
    id: "1",
    type: "user" as const,
    content: "Show me customers similar to Acme Corp",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "2",
    type: "bot" as const,
    content: "Found 12 similar customers based on industry and company size...",
    data: [
      { name: "TechFlow Inc", industry: "Technology", size: "Medium", similarity: "94%" },
      { name: "DataCorp Solutions", industry: "Technology", size: "Medium", similarity: "89%" },
      { name: "CloudTech Systems", industry: "Technology", size: "Large", similarity: "87%" },
    ],
    latency: { sql: "45ms", vector: "120ms" },
    functions: ["find_similar_customer_by_profile", "get_customer_details"],
    timestamp: new Date(Date.now() - 280000),
  },
  {
    id: "3",
    type: "user" as const,
    content: "Which of these have recent support tickets?",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: "4",
    type: "bot" as const,
    content: "3 customers have tickets in the last 30 days...",
    data: [
      { customer: "TechFlow Inc", tickets: "5", last_ticket: "2 days ago", priority: "High" },
      { customer: "DataCorp Solutions", tickets: "2", last_ticket: "1 week ago", priority: "Medium" },
      { customer: "CloudTech Systems", tickets: "8", last_ticket: "3 days ago", priority: "High" },
    ],
    latency: { sql: "23ms", graph: "67ms" },
    functions: ["get_customer_support_tickets", "traverse_customer_relationships"],
    timestamp: new Date(Date.now() - 100000),
  },
]

export function RightPane() {
  const [messages, setMessages] = useState(demoMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newUserMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot" as const,
        content: "I'm analyzing your request across all connected data stores...",
        latency: { sql: "34ms", vector: "89ms", graph: "156ms" },
        functions: ["analyze_query", "cross_store_search"],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 2000)
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="fixed right-4 top-20 w-80 h-96 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex flex-col z-40">
      {/* Header */}
      <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="text-gray-600 text-xs font-medium">Ask Circl...</div>
          <div className="flex items-center space-x-1">
            <Badge className="border-blue-500/30 text-blue-700 bg-blue-500/10 backdrop-blur-sm text-xs px-1 py-0">
              <Database className="h-2 w-2 mr-1" />
              SQL
            </Badge>
            <Badge className="border-green-500/30 text-green-700 bg-green-500/10 backdrop-blur-sm text-xs px-1 py-0">
              <Search className="h-2 w-2 mr-1" />
              Vector
            </Badge>
            <Badge className="border-purple-500/30 text-purple-700 bg-purple-500/10 backdrop-blur-sm text-xs px-1 py-0">
              <Network className="h-2 w-2 mr-1" />
              Graph
            </Badge>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="text-gray-600 hover:text-gray-800 hover:bg-white/20 h-6 w-6 p-0"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-sm font-bold">
              C
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 max-w-xs border border-white/20">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-6 flex-shrink-0">
        <div className="flex space-x-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What would you like to know about your data?"
            className="flex-1 bg-white/10 border-white/20 text-gray-800 placeholder-gray-600 backdrop-blur-sm rounded-xl"
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            onClick={handleSend}
            className="bg-blue-500/80 hover:bg-blue-600/80 text-white backdrop-blur-sm rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

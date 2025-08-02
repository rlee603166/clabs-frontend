"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Trash2, MessageSquare, Database, Network, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  StreamingConversation, 
  StreamChunk,
  StreamingMessage,
  FunctionResultChunk
} from "@/lib/streaming-types"
import {
  TextChunkRenderer,
  FunctionCallChunkRenderer,
  FunctionResultChunkRenderer,
  TableChunkRenderer,
  ThinkingChunkRenderer,
  ErrorChunkRenderer
} from "@/components/chunk-renderers"

// Demo streaming conversation
const demoConversation: StreamingConversation = {
  id: "demo-conv-1",
  is_streaming: false,
  messages: [
    {
      id: "msg-1",
      chunks: [
        {
          id: "chunk-1",
          type: "text",
          timestamp: Date.now() - 300000,
          status: "complete",
          content: {
            text: "Show me customers similar to Acme Corp"
          }
        }
      ],
      status: "complete",
      created_at: Date.now() - 300000
    },
    {
      id: "msg-2", 
      chunks: [
        {
          id: "chunk-2a",
          type: "function_call",
          timestamp: Date.now() - 280000,
          status: "complete",
          content: {
            name: "find_similar_customers",
            args: { company: "Acme Corp", criteria: ["industry", "size"] },
            description: "Finding customers with similar profiles"
          }
        },
        {
          id: "chunk-2b",
          type: "function_result",
          timestamp: Date.now() - 270000,
          status: "complete",
          content: {
            function_call_id: "chunk-2a",
            result: { found: 12, processing_time: "45ms" },
            success: true
          }
        },
        {
          id: "chunk-2c",
          type: "text",
          timestamp: Date.now() - 265000,
          status: "complete",
          content: {
            text: "Found 12 similar customers based on industry and company size. Here are the top matches:"
          }
        },
        {
          id: "chunk-2d",
          type: "table",
          timestamp: Date.now() - 260000,
          status: "complete",
          content: {
            title: "Similar Customers",
            headers: ["Company", "Industry", "Size", "Similarity"],
            rows: [
              ["TechFlow Inc", "Technology", "Medium", "94%"],
              ["DataCorp Solutions", "Technology", "Medium", "89%"],
              ["CloudTech Systems", "Technology", "Large", "87%"]
            ],
            description: "Customers ranked by similarity score using industry and company size metrics"
          }
        }
      ],
      status: "complete",
      created_at: Date.now() - 280000
    }
  ]
}

export function RightPane() {
  const [conversation, setConversation] = useState<StreamingConversation>(demoConversation)
  const [inputValue, setInputValue] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new chunks arrive
  useEffect(() => {
    if (scrollRef.current && conversation?.messages) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversation?.messages])

  const handleSend = () => {
    if (!inputValue.trim() || isStreaming) return

    const newUserMessage: StreamingMessage = {
      id: `msg-${Date.now()}`,
      chunks: [{
        id: `chunk-${Date.now()}`,
        type: "text",
        timestamp: Date.now(),
        status: "complete",
        content: { text: inputValue }
      }],
      status: "complete",
      created_at: Date.now()
    }

    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, newUserMessage],
      is_streaming: true
    }))
    setInputValue("")
    setIsStreaming(true)

    // Simulate streaming AI response
    setTimeout(() => {
      const aiMessage: StreamingMessage = {
        id: `msg-${Date.now() + 1}`,
        chunks: [{
          id: `chunk-${Date.now() + 1}`,
          type: "text",
          timestamp: Date.now(),
          status: "complete",
          content: { text: "I'm analyzing your request across all connected data stores..." }
        }],
        status: "complete",
        created_at: Date.now()
      }
      setConversation(prev => ({
        ...prev, 
        messages: [...prev.messages, aiMessage],
        is_streaming: false
      }))
      setIsStreaming(false)
    }, 2000)
  }

  const clearChat = () => {
    setConversation({
      id: `conv-${Date.now()}`,
      messages: [],
      is_streaming: false
    })
  }

  const renderChunk = (chunk: StreamChunk, messageIndex: number, chunkIndex: number) => {
    const isLatest = conversation?.messages && messageIndex === conversation.messages.length - 1 && 
                    chunkIndex === conversation.messages[messageIndex].chunks.length - 1

    const key = `${chunk.id}-${chunkIndex}`

    // For function calls, find the corresponding result
    if (chunk.type === 'function_call') {
      const message = conversation.messages[messageIndex]
      const functionResult = message.chunks.find(c => 
        c.type === 'function_result' && 
        c.content.function_call_id === chunk.id
      ) as FunctionResultChunk | undefined

      return <FunctionCallChunkRenderer key={key} chunk={chunk} functionResult={functionResult} isLatest={isLatest} />
    }

    switch (chunk.type) {
      case 'text':
        return <TextChunkRenderer key={key} chunk={chunk} isLatest={isLatest} />
      case 'function_result':
        // Skip rendering function results separately since they're now part of function calls
        return null
      case 'table':
        return <TableChunkRenderer key={key} chunk={chunk} isLatest={isLatest} />
      case 'thinking':
        return <ThinkingChunkRenderer key={key} chunk={chunk} isLatest={isLatest} />
      case 'error':
        return <ErrorChunkRenderer key={key} chunk={chunk} isLatest={isLatest} />
      default:
        return null
    }
  }

  return (
    <div className="fixed right-4 top-[10%] w-1/3 h-[80%] bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex flex-col z-40">
      {/* Header */}
      <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="text-gray-200 text-xs font-medium">Ask Circl...</div>
          <div className="flex items-center space-x-1">
            <Badge className="border-blue-500/30 text-blue-300 bg-blue-500/10 backdrop-blur-sm text-xs px-1 py-0">
              <Database className="h-2 w-2 mr-1" />
              SQL
            </Badge>
            <Badge className="border-green-500/30 text-green-300 bg-green-500/10 backdrop-blur-sm text-xs px-1 py-0">
              <Search className="h-2 w-2 mr-1" />
              Vector
            </Badge>
            <Badge className="border-purple-500/30 text-purple-300 bg-purple-500/10 backdrop-blur-sm text-xs px-1 py-0">
              <Network className="h-2 w-2 mr-1" />
              Graph
            </Badge>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="text-gray-400 hover:text-gray-200 hover:bg-white/20 h-6 w-6 p-0"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-3">
            {!conversation?.messages || conversation.messages.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                <MessageSquare className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p>Start a conversation with the AI</p>
                <p className="text-xs mt-1">See function calls and results in real-time</p>
              </div>
            ) : (
              conversation.messages.map((message, messageIndex) => (
                <div key={message.id} className="space-y-2">
                  {message.chunks.map((chunk, chunkIndex) => 
                    renderChunk(chunk, messageIndex, chunkIndex)
                  )}
                  {/* Message status indicator */}
                  {message.status === 'streaming' && (
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span>Processing...</span>
                    </div>
                  )}
                </div>
              ))
            )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-6 flex-shrink-0">
        <div className="flex space-x-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isStreaming ? "AI is responding..." : "What would you like to know about your data?"}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 backdrop-blur-sm rounded-xl"
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            disabled={isStreaming}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isStreaming}
            className="bg-blue-500/80 hover:bg-blue-600/80 disabled:bg-gray-400/50 text-white backdrop-blur-sm rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Connection Status */}
        <div className="mt-3 flex justify-between items-center text-xs">
          <Badge className="bg-green-500/20 text-green-200 border-green-500/30 backdrop-blur-sm">
            {conversation?.messages?.length || 0} messages
          </Badge>
          <span className="text-gray-400">
            {isStreaming ? "Connected & streaming" : "Ready"}
          </span>
        </div>
      </div>
    </div>
  )
}

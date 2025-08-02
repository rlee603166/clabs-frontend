"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Clock, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DataTable } from "@/components/data-table"

interface ChatMessageProps {
  message: {
    id: string
    type: "user" | "bot"
    content: string
    timestamp: Date
    data?: any[]
    latency?: Record<string, string>
    functions?: string[]
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [showQuery, setShowQuery] = useState(false)

  if (message.type === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-blue-500/80 text-white rounded-2xl p-3 max-w-xs backdrop-blur-sm border border-blue-500/30">
          <div className="text-sm">{message.content}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-blue-500/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-sm font-bold">
        C
      </div>

      <div className="flex-1 space-y-3">
        <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <div className="text-sm text-white mb-3">{message.content}</div>

          {/* Data Table */}
          {message.data && (
            <div className="mb-3">
              <DataTable data={message.data} />
            </div>
          )}

          {/* Latency Badges */}
          {message.latency && (
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-3 w-3 text-gray-400" />
              {Object.entries(message.latency).map(([store, time]) => (
                <Badge key={store} className="text-xs border-white/20 text-gray-300 bg-white/10 backdrop-blur-sm hover:bg-white/20">
                  {store.toUpperCase()}: {time}
                </Badge>
              ))}
            </div>
          )}

          {/* Functions */}
          {message.functions && (
            <Collapsible open={showQuery} onOpenChange={setShowQuery}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 px-2 py-1 h-auto space-x-2"
                >
                  {showQuery ? <ChevronDown className="h-3 w-3 mr-1" /> : <ChevronRight className="h-3 w-3 mr-1" />}
                  Show Query ({message.functions.length} functions)
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-3">
                  <div className="space-y-2">
                    {message.functions.map((func, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <code className="text-blue-200 font-mono bg-blue-500/20 px-2 py-1 rounded-md border border-blue-400/30">{func}()</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 text-gray-200 hover:text-white hover:bg-white/20"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    </div>
  )
}

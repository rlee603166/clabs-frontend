"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Play, CheckCircle, XCircle, Brain, AlertCircle, Copy, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  TextChunk,
  FunctionCallChunk,
  FunctionResultChunk,
  TableChunk,
  ThinkingChunk,
  ErrorChunk,
  ChunkRendererProps
} from "@/lib/streaming-types"

export function TextChunkRenderer({ chunk, isLatest }: ChunkRendererProps<TextChunk>) {
  return (
    <div className={cn(
      "prose prose-sm prose-invert max-w-none",
      isLatest && chunk.status === 'pending' && "animate-pulse"
    )}>
      <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
        {chunk.content.text}
        {isLatest && chunk.status === 'pending' && <span className="animate-pulse">▊</span>}
      </div>
    </div>
  )
}

interface FunctionCallRendererProps extends ChunkRendererProps<FunctionCallChunk> {
  functionResult?: FunctionResultChunk
}

export function FunctionCallChunkRenderer({ chunk, functionResult, isLatest }: FunctionCallRendererProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // TODO: Add toast notification
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg backdrop-blur-sm w-full max-h-[300px] overflow-hidden">
      {/* Header */}
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between p-3 h-auto text-left hover:bg-blue-500/5 transition-all duration-200"
      >
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 text-blue-400" />
          <span className="font-medium text-sm text-blue-300">{chunk.content.name}</span>
          {chunk.status === 'pending' && (
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          )}
        </div>
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-blue-400 transition-transform duration-200",
            !isExpanded && "rotate-180"
          )} 
        />
      </Button>
      
      {/* Collapsible Content */}
      <div className={cn(
        "max-h-[250px] overflow-y-auto transition-all duration-300 ease-in-out overflow-hidden relative",
        isExpanded ? "max-h-[250px] opacity-100" : "max-h-0 opacity-0"
      )}>
        {/* Fade overlay */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none z-10" />
        <div className="overflow-y-auto max-h-[230px]">
          {/* Request Section */}
          <div className="p-3 border-b border-blue-500/10">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-blue-300">Request</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(JSON.stringify(chunk.content.args, null, 2))}
                className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="bg-blue-900/20 rounded p-2 font-mono text-xs text-blue-200 overflow-x-auto">
              <pre>{JSON.stringify(chunk.content.args, null, 2)}</pre>
            </div>
          </div>
          
          {/* Response Section */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-blue-300">Response</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(functionResult ? JSON.stringify(functionResult.content.result, null, 2) : 'No response yet')}
                className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="bg-blue-900/20 rounded p-2 font-mono text-xs text-blue-200 overflow-x-auto">
              {!functionResult ? (
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-blue-300">Executing...</span>
                </div>
              ) : functionResult.content.success ? (
                <pre>{JSON.stringify(functionResult.content.result, null, 2)}</pre>
              ) : (
                <div>
                  <div className="text-red-300 mb-2">Function failed</div>
                  {functionResult.content.error_message && (
                    <div className="text-red-300 bg-red-900/20 rounded p-2">
                      {functionResult.content.error_message}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FunctionResultChunkRenderer({ chunk, isLatest }: ChunkRendererProps<FunctionResultChunk>) {
  // This component is now integrated into the function call dropdown
  // It should not render as a separate component but update the parent function call
  return null
}

export function TableChunkRenderer({ chunk, isLatest }: ChunkRendererProps<TableChunk>) {
  return (
    <div className="border border-white/20 rounded-lg backdrop-blur-sm bg-white/5 overflow-hidden">
      {chunk.content.title && (
        <div className="px-3 py-2 border-b border-white/10">
          <h4 className="font-medium text-white text-sm">{chunk.content.title}</h4>
        </div>
      )}
      
      <div className="overflow-x-auto max-h-64 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="bg-white/5 sticky top-0">
            <tr>
              {chunk.content.headers.map((header, i) => (
                <th key={i} className="text-left p-2 font-medium text-gray-300 border-b border-white/10">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chunk.content.rows.map((row, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                {row.map((cell, j) => (
                  <td key={j} className="p-2 text-gray-200">
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {(chunk.content.description || chunk.content.caption) && (
        <div className="px-3 py-2 border-t border-white/10 text-xs text-gray-400">
          {chunk.content.description || chunk.content.caption}
        </div>
      )}
    </div>
  )
}

export function ThinkingChunkRenderer({ chunk, isLatest }: ChunkRendererProps<ThinkingChunk>) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!chunk.content.visible) return null
  
  return (
    <div className="border border-purple-500/30 bg-purple-500/5 rounded-lg backdrop-blur-sm">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between p-2 h-auto text-left hover:bg-white/5"
      >
        <div className="flex items-center space-x-2">
          <Brain className="h-3 w-3 text-purple-400" />
          <span className="text-xs text-purple-300">Thinking...</span>
        </div>
        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </Button>
      
      {isExpanded && (
        <div className="px-2 pb-2 border-t border-purple-500/10">
          <div className="mt-2 text-xs text-purple-200 font-mono whitespace-pre-wrap">
            {chunk.content.text}
          </div>
        </div>
      )}
    </div>
  )
}

export function ErrorChunkRenderer({ chunk, isLatest }: ChunkRendererProps<ErrorChunk>) {
  return (
    <div className="border border-red-500/30 bg-red-500/10 rounded-lg backdrop-blur-sm p-3">
      <div className="flex items-center space-x-2 mb-2">
        <AlertCircle className="h-4 w-4 text-red-400" />
        <span className="font-medium text-red-300 text-sm">Error</span>
        {chunk.content.code && (
          <Badge variant="outline" className="text-xs border-red-500/30 text-red-400">
            {chunk.content.code}
          </Badge>
        )}
      </div>
      <div className="text-sm text-red-200">{chunk.content.message}</div>
      {chunk.content.details && (
        <div className="mt-2 bg-black/20 rounded p-2 font-mono text-xs text-red-300 overflow-x-auto">
          <pre>{JSON.stringify(chunk.content.details, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
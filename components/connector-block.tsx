"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ConnectorBlockProps {
  node: {
    id: string
    name: string
    icon: string
    type: string
    fields: string[]
    x: number
    y: number
  }
  isSelected: boolean
  onSelect: () => void
  onMove: (nodeId: string, x: number, y: number) => void
}

export function ConnectorBlock({ node, isSelected, onSelect, onMove }: ConnectorBlockProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - node.x,
        y: e.clientY - node.y,
      })
    },
    [node.x, node.y],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        onMove(node.id, newX, newY)
      }
    },
    [isDragging, dragStart, node.id, onMove],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Proper event listener management
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!isDragging) {
        onSelect()
      }
    },
    [isDragging, onSelect],
  )

  return (
    <div
      className={cn(
        "absolute bg-white/15 backdrop-blur-md rounded-2xl border-2 transition-all duration-200 cursor-move select-none shadow-lg",
        isSelected ? "border-blue-500/60 shadow-blue-500/20" : "border-white/30",
        isDragging && "scale-105 shadow-xl z-50",
      )}
      style={{
        left: node.x,
        top: node.y,
        width: 200,
        height: 120,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center space-x-3 mb-3">
          <div className="text-2xl">{node.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-800 text-sm truncate">{node.name}</div>
            <div className="text-xs text-gray-600">{node.type}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-600 hover:text-gray-800 hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation()
              // Handle config
            }}
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex-1 text-xs text-gray-600">
          <div className="font-medium mb-1">Fields:</div>
          <div className="space-y-1">
            {node.fields.slice(0, 3).map((field) => (
              <div key={field} className="truncate">
                • {field}
              </div>
            ))}
            {node.fields.length > 3 && <div className="text-gray-500">+{node.fields.length - 3} more</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

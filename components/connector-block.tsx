"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef, memo } from "react"
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
  canvasRef: React.RefObject<HTMLDivElement>
  panOffset: { x: number; y: number }
}

export const ConnectorBlock = memo(function ConnectorBlock({ node, isSelected, onSelect, onMove, canvasRef, panOffset }: ConnectorBlockProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, nodeX: 0, nodeY: 0 })
  const isDraggingRef = useRef(false)
  const nodeRef = useRef<HTMLDivElement>(null)
  const lastPositionRef = useRef({ x: node.x, y: node.y })
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update lastPositionRef when node position changes from props
  useEffect(() => {
    lastPositionRef.current = { x: node.x, y: node.y }
  }, [node.x, node.y])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isDraggingRef.current) return

      e.stopPropagation()
      e.preventDefault()

      // Clear any existing timeout
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current)
      }

      // Skip drag initiation on double-click
      if (e.detail > 1) {
        return
      }

      // Calculate mouse position relative to canvas, accounting for pan offset
      const canvasRect = canvasRef.current?.getBoundingClientRect()
      if (!canvasRect) return

      const canvasRelativeX = e.clientX - canvasRect.left - panOffset.x
      const canvasRelativeY = e.clientY - canvasRect.top - panOffset.y

      // Add small delay to prevent double-click interference
      dragTimeoutRef.current = setTimeout(() => {
        isDraggingRef.current = true
        setIsDragging(true)

        dragStartRef.current = {
          mouseX: canvasRelativeX,
          mouseY: canvasRelativeY,
          nodeX: lastPositionRef.current.x,
          nodeY: lastPositionRef.current.y,
        }
      }, 100)
    },
    [canvasRef, panOffset],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDraggingRef.current && nodeRef.current && canvasRef.current) {
        e.preventDefault()

        // Calculate current mouse position relative to canvas
        const canvasRect = canvasRef.current.getBoundingClientRect()
        const canvasRelativeX = e.clientX - canvasRect.left - panOffset.x
        const canvasRelativeY = e.clientY - canvasRect.top - panOffset.y

        // Calculate deltas using canvas-relative coordinates
        const deltaX = canvasRelativeX - dragStartRef.current.mouseX
        const deltaY = canvasRelativeY - dragStartRef.current.mouseY
        const newX = dragStartRef.current.nodeX + deltaX
        const newY = dragStartRef.current.nodeY + deltaY

        // Update the DOM directly for smooth dragging
        nodeRef.current.style.transform = `translate(${newX}px, ${newY}px)`

        // Store the last position
        lastPositionRef.current = { x: newX, y: newY }
      }
    },
    [canvasRef, panOffset],
  )

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
      setIsDragging(false)

      // Update the React state with the final position
      onMove(node.id, lastPositionRef.current.x, lastPositionRef.current.y)

      // Reset the transform since the position will be updated via props
      if (nodeRef.current) {
        nodeRef.current.style.transform = ''
      }
    }

    // Clear any pending drag timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current)
      dragTimeoutRef.current = null
    }
  }, [node.id, onMove])

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current)
      }
    }
  }, [])

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
      ref={nodeRef}
      className={cn(
        "absolute bg-white/15 backdrop-blur-md rounded-2xl border-2 cursor-move select-none shadow-lg pointer-events-auto z-30",
        isSelected ? "border-blue-500/60 shadow-blue-500/20" : "border-white/30",
        isDragging && "scale-105 shadow-xl z-50 transition-none",
        !isDragging && "transition-all duration-200",
      )}
      style={{
        left: 0,
        top: 0,
        transform: `translate(${node.x}px, ${node.y}px)`,
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
            <div className="font-medium text-white text-sm truncate">{node.name}</div>
            <div className="text-xs text-white">{node.type}</div>
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

        <div className="flex-1 text-xs text-white">
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
}, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.node.id === nextProps.node.id &&
    prevProps.node.x === nextProps.node.x &&
    prevProps.node.y === nextProps.node.y &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.onSelect === nextProps.onSelect &&
    prevProps.onMove === nextProps.onMove &&
    prevProps.canvasRef === nextProps.canvasRef &&
    prevProps.panOffset.x === nextProps.panOffset.x &&
    prevProps.panOffset.y === nextProps.panOffset.y
  )
})

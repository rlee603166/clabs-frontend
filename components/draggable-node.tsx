"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { Settings, Ellipsis, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DraggableNodeProps {
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
  onDeselect: () => void
  onDelete: (nodeId: string) => void
  onMove: (nodeId: string, x: number, y: number) => void
}

export function DraggableNode({ node, isSelected, onSelect, onDeselect, onDelete, onMove }: DraggableNodeProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialNodeX: 0,
    initialNodeY: 0
  })

  // Separate PK and FK fields
  const pkFields = (node.fields || []).filter(field =>
    field.toLowerCase().includes('id') || field.toLowerCase().includes('pk')
  )
  const fkFields = (node.fields || []).filter(field =>
    field.toLowerCase().includes('fk') ||
    (field.toLowerCase().includes('id') && !pkFields.includes(field))
  )
  const otherFields = (node.fields || []).filter(field =>
    !pkFields.includes(field) && !fkFields.includes(field)
  )

  // Calculate dynamic height
  const headerHeight = 40 // Header with icon, name, type, and button
  const columnsLabelHeight = 16 // "Columns:" label
  const fieldHeight = 16 // Each field row
  const paddingHeight = 44 // Total padding (16px top + 32px bottom)
  const extraLineHeight = 16 // For "+X more" line

  const totalVisibleFields = pkFields.length + fkFields.length
  const hasMoreFields = otherFields.length > 0

  const calculatedHeight = headerHeight + columnsLabelHeight +
    (totalVisibleFields * fieldHeight) +
    (hasMoreFields ? extraLineHeight : 0) +
    paddingHeight

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Prevent drag on double-click
    if (e.detail > 1) return

    e.preventDefault()
    e.stopPropagation()

    // Store initial drag state
    dragState.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialNodeX: node.x,
      initialNodeY: node.y
    }

    setIsDragging(true)

    // Add global mouse event listeners
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.current.isDragging) return

      const deltaX = e.clientX - dragState.current.startX
      const deltaY = e.clientY - dragState.current.startY

      const newX = dragState.current.initialNodeX + deltaX
      const newY = dragState.current.initialNodeY + deltaY

      // Update position immediately
      onMove(node.id, newX, newY)
    }

    const handleMouseUp = () => {
      dragState.current.isDragging = false
      setIsDragging(false)

      // Remove global listeners
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    // Add global listeners
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [node.x, node.y, node.id, onMove])

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    // Only trigger select if not dragging
    if (!isDragging) {
      onSelect()
    }
  }, [isDragging, onSelect])

  // Handle click outside to deselect
  useEffect(() => {
    if (!isSelected) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      const nodeElement = document.getElementById(`draggable-node-${node.id}`)
      
      if (nodeElement && !nodeElement.contains(target)) {
        onDeselect()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isSelected, node.id, onDeselect])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(node.id)
  }, [onDelete, node.id])

  return (
    <div
      id={`draggable-node-${node.id}`}
      className={cn(
        "absolute bg-white/15 backdrop-blur-md rounded-2xl border-2 cursor-move select-none shadow-lg pointer-events-auto",
        isSelected ? "border-blue-500/60 shadow-blue-500/20" : "border-white/30",
        isDragging && "scale-105 shadow-xl z-50",
        !isDragging && "transition-all duration-200"
      )}
      style={{
        left: node.x,
        top: node.y,
        width: 200,
        height: Math.max(120, calculatedHeight), // Minimum height of 120px
        zIndex: isDragging ? 50 : 30
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {isSelected && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 border-2 border-white shadow-lg"
          onClick={handleDelete}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center space-x-3 mb-1">
          <div className="text-2xl">{node.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-white text-sm truncate">{node.name}</div>
            <div className="text-xs text-gray-400">{node.type}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-gray-200 hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation()
              // Handle config
            }}
          >
            <Ellipsis className="h-3 w-3" />
            {/* <Settings className="h-3 w-3" /> */}
          </Button>
        </div>

        <div className="flex-1 text-xs text-white">
          <div className="font-medium mb-1">Columns:</div>
          <div className="space-y-1">
            {/* Show all PK fields */}
            {pkFields.map((field) => (
              <div key={field} className="truncate flex items-center">
                <span className="w-2 h-2 rounded-full mr-2 bg-green-400" />
                {field}
              </div>
            ))}
            {/* Show all FK fields */}
            {fkFields.map((field) => (
              <div key={field} className="truncate flex items-center">
                <span className="w-2 h-2 rounded-full mr-2 bg-green-400" />
                {field}
              </div>
            ))}
            {/* Show count of other fields */}
            {otherFields.length > 0 && (
              <div className="text-gray-400">+ {otherFields.length} more</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
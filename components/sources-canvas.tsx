"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { useDrop } from "react-dnd"
import { ConnectorBlock } from "@/components/connector-block"

interface DroppedNode {
  id: string
  name: string
  icon: string
  type: string
  fields: string[]
  x: number
  y: number
}

interface SourcesCanvasProps {
  selectedNodes: string[]
  setSelectedNodes: (nodes: string[]) => void
}

export function SourcesCanvas({ selectedNodes, setSelectedNodes }: SourcesCanvasProps) {
  const [droppedNodes, setDroppedNodes] = useState<DroppedNode[]>([])
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "table",
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset()
      const canvasRect = canvasRef.current?.getBoundingClientRect()

      if (offset && canvasRect) {
        const x = offset.x - canvasRect.left - pan.x
        const y = offset.y - canvasRect.top - pan.y

        const newNode: DroppedNode = {
          ...item,
          x: Math.max(50, Math.min(x - 100, canvasRect.width - 200)),
          y: Math.max(50, Math.min(y - 60, canvasRect.height - 120)),
        }

        setDroppedNodes((prev) => [...prev.filter((n) => n.id !== item.id), newNode])
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only start panning if clicking directly on the canvas background
      if (e.target === canvasRef.current || (e.target as Element).closest(".canvas-background")) {
        e.preventDefault()
        setIsPanning(true)
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      }
    },
    [pan],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isPanning) {
        e.preventDefault()
        setPan({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        })
      }
    },
    [isPanning, panStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  // Proper event listener management
  useEffect(() => {
    if (isPanning) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isPanning, handleMouseMove, handleMouseUp])

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodes(
      selectedNodes.includes(nodeId) ? selectedNodes.filter((id) => id !== nodeId) : [...selectedNodes, nodeId],
    )
  }

  const handleNodeMove = (nodeId: string, x: number, y: number) => {
    setDroppedNodes((prev) => prev.map((node) => (node.id === nodeId ? { ...node, x, y } : node)))
  }

  return (
    <div
      ref={(node) => {
        drop(node)
        canvasRef.current = node
      }}
      className={`w-screen h-screen relative transition-colors duration-200 overflow-hidden ${
        isPanning ? "cursor-grabbing" : "cursor-grab"
      } ${isOver ? "bg-white/5" : ""}`}
      onMouseDown={handleMouseDown}
      style={{
        backgroundColor: "#374151",
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
        backgroundPosition: `${pan.x}px ${pan.y}px`,
      }}
    >
      {/* Canvas background layer for panning */}
      <div className="canvas-background absolute inset-0 z-0" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Connection lines */}
      <svg
        className="absolute inset-0 pointer-events-none z-10"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        {droppedNodes.map((node, index) =>
          droppedNodes.slice(index + 1).map((otherNode) => {
            const startX = node.x + 100
            const startY = node.y + 60
            const endX = otherNode.x + 100
            const endY = otherNode.y + 60

            return (
              <line
                key={`${node.id}-${otherNode.id}`}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="rgba(59, 130, 246, 0.6)"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.8"
              >
                <animate attributeName="stroke-dashoffset" values="0;10" dur="1s" repeatCount="indefinite" />
              </line>
            )
          }),
        )}
      </svg>

      {/* Dropped nodes */}
      <div className="relative z-20" style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
        {droppedNodes.map((node) => (
          <ConnectorBlock
            key={`${node.id}-${node.x}-${node.y}`}
            node={node}
            isSelected={selectedNodes.includes(node.id)}
            onSelect={() => handleNodeSelect(node.id)}
            onMove={handleNodeMove}
          />
        ))}
      </div>

      {/* Drop hint */}
      {droppedNodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="text-center text-gray-600">
            <div className="text-6xl mb-4">📊</div>
            <div className="text-xl font-medium mb-2">Drag tables here</div>
            <div className="text-sm">Build your data pipeline by connecting tables</div>
          </div>
        </div>
      )}
    </div>
  )
}

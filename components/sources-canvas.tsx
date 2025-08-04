"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { useDrop } from "react-dnd"
import { DraggableNode } from "@/components/draggable-node"
import { ConnectionDetector, type TableNode, type Connection } from "@/lib/connection-detector"

interface DroppedNode {
  id: string
  name: string
  icon: string
  type: string
  fields: string[]
  columns: string[]
  x: number
  y: number
  // Additional backend data
  source_file?: string
  record_count?: number
  description?: string
  sample_data?: Record<string, any>
}

interface SourcesCanvasProps {
  selectedNodes: string[]
  setSelectedNodes: (nodes: string[]) => void
  connectedSources: string[]
  setConnectedSources: (sources: string[]) => void
}

export function SourcesCanvas({ selectedNodes, setSelectedNodes, connectedSources, setConnectedSources }: SourcesCanvasProps) {
  const [droppedNodes, setDroppedNodes] = useState<DroppedNode[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
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
          columns: item.fields || item.columns || [], // Handle both old and new formats
        }

        setDroppedNodes((prev) => {
          const updatedNodes = [...prev.filter((n) => n.id !== item.id), newNode]

          // Auto-detect connections when nodes change
          console.log('Nodes for connection detection:', updatedNodes.map(n => ({ name: n.name, columns: n.columns })))
          const detectedConnections = ConnectionDetector.detectConnections(updatedNodes as TableNode[])
          console.log('Detected connections:', detectedConnections)
          setConnections(detectedConnections)

          return updatedNodes
        })

        // Add to connected sources when dropped on canvas
        if (!connectedSources.includes(item.id)) {
          setConnectedSources([...connectedSources, item.id])
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [pan.x, pan.y, connectedSources, setConnectedSources])

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

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      
      if (e.ctrlKey || e.metaKey) {
        // Zoom functionality with Ctrl/Cmd + wheel
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return
        
        // Use smaller, more controlled zoom increments
        const zoomSensitivity = 0.02
        const deltaY = Math.sign(e.deltaY) // Normalize to -1, 0, or 1
        const zoomDelta = -deltaY * zoomSensitivity
        
        const newZoom = Math.max(0.1, Math.min(3, zoom + zoomDelta))
        
        // Get mouse position relative to canvas
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        
        // Calculate the point in the canvas coordinate system
        const canvasPointX = (mouseX - pan.x) / zoom
        const canvasPointY = (mouseY - pan.y) / zoom
        
        // Calculate new pan to keep the same point under the mouse
        const newPanX = mouseX - canvasPointX * newZoom
        const newPanY = mouseY - canvasPointY * newZoom
        
        setZoom(newZoom)
        setPan({ x: newPanX, y: newPanY })
      } else {
        // Pan functionality
        const sensitivity = 1
        setPan(prev => ({
          x: prev.x - e.deltaX * sensitivity,
          y: prev.y - e.deltaY * sensitivity,
        }))
      }
    },
    [zoom, pan],
  )

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

  // Wheel event listener for trackpad scrolling
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false })
      return () => {
        canvas.removeEventListener("wheel", handleWheel)
      }
    }
  }, [handleWheel])

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodes(
      selectedNodes.includes(nodeId) ? selectedNodes.filter((id) => id !== nodeId) : [...selectedNodes, nodeId],
    )
  }

  const handleNodeMove = (nodeId: string, x: number, y: number) => {
    setDroppedNodes((prev) => prev.map((node) => (node.id === nodeId ? { ...node, x, y } : node)))
  }

  const handleNodeDeselect = () => {
    setSelectedNodes([])
  }

  const handleNodeDelete = (nodeId: string) => {
    setDroppedNodes((prev) => prev.filter((node) => node.id !== nodeId))
    setSelectedNodes((prev) => prev.filter((id) => id !== nodeId))
    setConnectedSources((prev) => prev.filter((source) => source !== nodeId))
  }

  return (
    <div
      ref={(node) => {
        drop(node)
        canvasRef.current = node
      }}
      className={`w-screen h-screen relative transition-colors duration-200 overflow-hidden ${isPanning ? "cursor-grabbing" : "cursor-grab"
        } ${isOver ? "bg-white/5" : ""}`}
      style={{
        overflow: 'hidden',
        backgroundColor: "#242629",
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        backgroundPosition: `${pan.x}px ${pan.y}px`,
        backgroundAttachment: 'fixed'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Canvas background layer for panning */}
      <div className="canvas-background absolute inset-0 z-0" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
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

      {/* Connection Lines - Glassmorphic Style */}
      <svg
        className="absolute pointer-events-none z-15"
        style={{
          left: 0,
          top: 0,
          width: '200vw',
          height: '200vh',
          overflow: 'visible'
        }}
      >
        <defs>
          {/* Gradient definitions for different connection types */}
          <linearGradient id="pkfk-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.8)" />
            <stop offset="100%" stopColor="rgba(34, 197, 94, 0.4)" />
          </linearGradient>
          <linearGradient id="fkfk-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.7)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.3)" />
          </linearGradient>
          <linearGradient id="inferred-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(156, 163, 175, 0.6)" />
            <stop offset="100%" stopColor="rgba(156, 163, 175, 0.2)" />
          </linearGradient>

          {/* Glow filters for glassmorphic effect */}
          <filter id="connection-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {connections.map((connection, index) => {
          const sourceNode = droppedNodes.find(n => n.id === connection.sourceTable)
          const targetNode = droppedNodes.find(n => n.id === connection.targetTable)

          if (!sourceNode || !targetNode) return null

          // Group connections by node pairs to handle multiple connections
          const connectionKey = [connection.sourceTable, connection.targetTable].sort().join('-')
          const sameNodePairConnections = connections.filter(conn => {
            const connKey = [conn.sourceTable, conn.targetTable].sort().join('-')
            return connKey === connectionKey
          })
          const connectionIndex = sameNodePairConnections.findIndex(conn => conn.id === connection.id)
          const totalConnectionsForPair = sameNodePairConnections.length

          // Calculate field-specific connection points
          const calculateFieldConnections = (node1: any, node2: any, sourceField: string, targetField: string) => {
            // Node dimensions and layout constants (matching DraggableNode)
            const nodeWidth = 200
            const headerHeight = 40
            const columnsLabelHeight = 16
            const fieldHeight = 16
            const paddingTop = 16

            // Helper function to get field position within a node
            const getFieldY = (node: any, fieldName: string) => {
              const fields = node.fields || node.columns || []

              // Separate PK and FK fields (matching DraggableNode logic)
              const pkFields = fields.filter((field: string) =>
                field.toLowerCase().includes('id') || field.toLowerCase().includes('pk')
              )
              const fkFields = fields.filter((field: string) =>
                field.toLowerCase().includes('fk') ||
                (field.toLowerCase().includes('id') && !pkFields.includes(field))
              )

              // Find field index in the rendered order (PK first, then FK)
              const allVisibleFields = [...pkFields, ...fkFields]
              const fieldIndex = allVisibleFields.findIndex((f: string) => f === fieldName)

              if (fieldIndex === -1) {
                // Field not found in visible fields, use center
                return headerHeight + columnsLabelHeight + (allVisibleFields.length * fieldHeight) / 2
              }

              // Calculate Y position: header + columns label + field index * field height + half field height
              return headerHeight + columnsLabelHeight + (fieldIndex * fieldHeight) + (fieldHeight / 2)
            }

            const node1CenterX = node1.x + pan.x + nodeWidth / 2
            const node2CenterX = node2.x + pan.x + nodeWidth / 2

            // Get field-specific Y positions
            const sourceFieldY = node1.y + pan.y + paddingTop + getFieldY(node1, sourceField)
            const targetFieldY = node2.y + pan.y + paddingTop + getFieldY(node2, targetField)

            // Calculate direction vector for horizontal positioning
            const dx = node2CenterX - node1CenterX

            let startX, startY, endX, endY

            if (dx > 0) {
              // Connect from right edge of source to left edge of target
              startX = node1.x + pan.x + nodeWidth
              startY = sourceFieldY
              endX = node2.x + pan.x
              endY = targetFieldY
            } else {
              // Connect from left edge of source to right edge of target
              startX = node1.x + pan.x
              startY = sourceFieldY
              endX = node2.x + pan.x + nodeWidth
              endY = targetFieldY
            }

            return { startX, startY, endX, endY }
          }

          const { startX, startY, endX, endY } = calculateFieldConnections(sourceNode, targetNode, connection.sourceField, connection.targetField)

          // Generate smooth curved path using Bézier curves with separation for multiple connections
          const generateCurvedPath = (x1: number, y1: number, x2: number, y2: number, connectionIndex: number, totalConnections: number) => {
            const dx = x2 - x1
            const dy = y2 - y1

            // Calculate control points for smooth curves
            const distance = Math.sqrt(dx * dx + dy * dy)
            const curvature = Math.min(distance * 0.3, 150) // Adaptive curvature

            // Calculate separation offset for multiple connections
            let separationOffset = 0
            if (totalConnections > 1) {
              const maxOffset = 40 // Maximum separation distance
              const step = totalConnections > 1 ? (2 * maxOffset) / (totalConnections - 1) : 0
              separationOffset = connectionIndex * step - maxOffset
            }

            // Calculate the midpoint for applying separation
            const midX = (x1 + x2) / 2
            const midY = (y1 + y2) / 2

            // Calculate perpendicular direction for separation
            const length = Math.sqrt(dx * dx + dy * dy)
            const perpX = length > 0 ? -dy / length : 0
            const perpY = length > 0 ? dx / length : 0

            let cp1x, cp1y, cp2x, cp2y

            if (Math.abs(dx) > Math.abs(dy)) {
              // Horizontal-dominant curve
              cp1x = x1 + curvature
              cp1y = y1 + separationOffset * perpY * 0.5
              cp2x = x2 - curvature
              cp2y = y2 + separationOffset * perpY * 0.5
            } else {
              // Vertical-dominant curve
              cp1x = x1 + (dy > 0 ? curvature : -curvature) + separationOffset * perpX * 0.5
              cp1y = y1 + separationOffset * perpY * 0.5
              cp2x = x2 - (dy > 0 ? curvature : -curvature) + separationOffset * perpX * 0.5
              cp2y = y2 + separationOffset * perpY * 0.5
            }

            // Apply separation to control points
            const separationFactor = 0.7 // How much separation to apply
            cp1x += separationOffset * perpX * separationFactor
            cp1y += separationOffset * perpY * separationFactor
            cp2x += separationOffset * perpX * separationFactor
            cp2y += separationOffset * perpY * separationFactor

            return `M ${x1},${y1} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`
          }

          const pathData = generateCurvedPath(startX, startY, endX, endY, connectionIndex, totalConnectionsForPair)

          // Calculate label position on the curved path
          const calculateLabelPosition = (x1: number, y1: number, x2: number, y2: number, connectionIndex: number, totalConnections: number) => {
            const dx = x2 - x1
            const dy = y2 - y1

            // Calculate control points (same logic as in generateCurvedPath)
            const distance = Math.sqrt(dx * dx + dy * dy)
            const curvature = Math.min(distance * 0.3, 150)

            // Calculate separation offset
            let separationOffset = 0
            if (totalConnections > 1) {
              const maxOffset = 40
              const step = totalConnections > 1 ? (2 * maxOffset) / (totalConnections - 1) : 0
              separationOffset = connectionIndex * step - maxOffset
            }

            // Calculate perpendicular direction for separation
            const length = Math.sqrt(dx * dx + dy * dy)
            const perpX = length > 0 ? -dy / length : 0
            const perpY = length > 0 ? dx / length : 0

            let cp1x, cp1y, cp2x, cp2y

            if (Math.abs(dx) > Math.abs(dy)) {
              // Horizontal-dominant curve
              cp1x = x1 + curvature
              cp1y = y1 + separationOffset * perpY * 0.5
              cp2x = x2 - curvature
              cp2y = y2 + separationOffset * perpY * 0.5
            } else {
              // Vertical-dominant curve
              cp1x = x1 + (dy > 0 ? curvature : -curvature) + separationOffset * perpX * 0.5
              cp1y = y1 + separationOffset * perpY * 0.5
              cp2x = x2 - (dy > 0 ? curvature : -curvature) + separationOffset * perpX * 0.5
              cp2y = y2 + separationOffset * perpY * 0.5
            }

            // Apply separation to control points
            const separationFactor = 0.7
            cp1x += separationOffset * perpX * separationFactor
            cp1y += separationOffset * perpY * separationFactor
            cp2x += separationOffset * perpX * separationFactor
            cp2y += separationOffset * perpY * separationFactor

            // Calculate point at t=0.5 on the Bézier curve for label position
            const t = 0.5
            const labelX = Math.pow(1-t, 3) * x1 + 3 * Math.pow(1-t, 2) * t * cp1x + 3 * (1-t) * Math.pow(t, 2) * cp2x + Math.pow(t, 3) * x2
            const labelY = Math.pow(1-t, 3) * y1 + 3 * Math.pow(1-t, 2) * t * cp1y + 3 * (1-t) * Math.pow(t, 2) * cp2y + Math.pow(t, 3) * y2

            return { labelX, labelY }
          }

          const { labelX, labelY } = calculateLabelPosition(startX, startY, endX, endY, connectionIndex, totalConnectionsForPair)

          // Styling based on connection type
          const getConnectionStyle = (type: Connection['type'], confidence: number) => {
            switch (type) {
              case 'primary-foreign':
                return {
                  stroke: 'url(#pkfk-gradient)',
                  strokeWidth: Math.max(2, confidence * 4),
                  strokeDasharray: 'none',
                  opacity: confidence,
                  filter: 'url(#connection-glow)'
                }
              case 'foreign-foreign':
                return {
                  stroke: 'url(#fkfk-gradient)',
                  strokeWidth: Math.max(2, confidence * 3),
                  strokeDasharray: '8,8',
                  opacity: confidence * 0.9,
                  filter: 'url(#connection-glow)'
                }
              case 'inferred':
                return {
                  stroke: 'url(#inferred-gradient)',
                  strokeWidth: Math.max(1, confidence * 2),
                  strokeDasharray: '6,8',
                  opacity: confidence * 0.7,
                  filter: 'url(#connection-glow)'
                }
            }
          }

          const style = getConnectionStyle(connection.type, connection.confidence)

          return (
            <g key={connection.id}>
              {/* Smooth curved connection with glassmorphic styling */}
              <path
                d={pathData}
                fill="none"
                {...style}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Flowing animations based on connection type */}
                {connection.type === 'primary-foreign' && connection.confidence > 0.8 && (
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-20"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                )}
                {connection.type === 'foreign-foreign' && (
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-16"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                )}
                {connection.type === 'inferred' && (
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-14"
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                )}
              </path>

              {/* Connection field label with glassmorphic background */}
              {connection.confidence > 0.8 && (
                <g>
                  {/* Background blur for text readability */}
                  <rect
                    x={labelX - 25}
                    y={labelY - 10}
                    width="50"
                    height="16"
                    fill="rgba(0, 0, 0, 0.3)"
                    rx="8"
                    style={{
                      backdropFilter: 'blur(8px)',
                    }}
                  />
                  {/* Field name label */}
                  <text
                    x={labelX}
                    y={labelY + 2}
                    fill="rgba(255, 255, 255, 0.9)"
                    fontSize="9"
                    fontWeight="500"
                    textAnchor="middle"
                    className="pointer-events-none"
                    style={{
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  >
                    {connection.sourceField}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>

      {/* Dropped nodes */}
      <div className="relative z-20" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
        {droppedNodes.map((node) => (
          <DraggableNode
            key={node.id}
            node={node}
            isSelected={selectedNodes.includes(node.id)}
            onSelect={() => handleNodeSelect(node.id)}
            onDeselect={handleNodeDeselect}
            onDelete={handleNodeDelete}
            onMove={handleNodeMove}
          />
        ))}
      </div>

      {/* Drop hint */}
      {droppedNodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="text-center text-gray-300">
            <div className="text-6xl mb-4">🔗</div>
            <div className="text-xl font-medium mb-2">Drag tables here</div>
            <div className="text-sm">Build your data graph by connecting tables</div>
          </div>
        </div>
      )}
    </div>
  )
}

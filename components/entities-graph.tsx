"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

const entities = [
  { id: "customer", name: "Customer", fields: ["id", "name", "industry", "size"], sources: ["SQL", "Vector"] },
  { id: "order", name: "Order", fields: ["id", "customer_id", "amount", "date"], sources: ["SQL"] },
  {
    id: "support_ticket",
    name: "Support_Ticket",
    fields: ["id", "customer_id", "description", "sentiment"],
    sources: ["Vector", "Graph"],
  },
  { id: "employee", name: "Employee", fields: ["id", "name", "department", "manager_id"], sources: ["SQL", "Graph"] },
  { id: "product", name: "Product", fields: ["id", "name", "category", "price"], sources: ["SQL"] },
  { id: "department", name: "Department", fields: ["id", "name", "budget"], sources: ["SQL"] },
]

const relationships = [
  { source: "customer", target: "order", label: "places" },
  { source: "customer", target: "support_ticket", label: "creates" },
  { source: "employee", target: "support_ticket", label: "handles" },
  { source: "employee", target: "department", label: "belongs_to" },
  { source: "order", target: "product", label: "contains" },
  { source: "employee", target: "employee", label: "manages" },
]

export function EntitiesGraph() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only start panning if clicking on the SVG background, not on nodes
      if (e.target === svgRef.current || (e.target as Element).tagName === "svg") {
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

  useEffect(() => {
    if (!svgRef.current) return

    const svg = svgRef.current
    const width = svg.clientWidth
    const height = svg.clientHeight

    // Improved force simulation with better spacing
    const nodes = entities.map((entity, i) => ({
      ...entity,
      x: width / 2 + Math.cos((i * 2 * Math.PI) / entities.length) * 250, // Increased radius from 150 to 250
      y: height / 2 + Math.sin((i * 2 * Math.PI) / entities.length) * 250,
      vx: 0,
      vy: 0,
    }))

    const links = relationships.map((rel) => ({
      ...rel,
      sourceNode: nodes.find((n) => n.id === rel.source)!,
      targetNode: nodes.find((n) => n.id === rel.target)!,
    }))

    // Simple animation loop with better force parameters
    const animate = () => {
      // Apply forces
      nodes.forEach((node) => {
        // Center force (weaker)
        const centerX = width / 2
        const centerY = height / 2
        const dx = centerX - node.x
        const dy = centerY - node.y
        node.vx += dx * 0.0005 // Reduced from 0.001
        node.vy += dy * 0.0005

        // Repulsion between nodes (stronger and longer range)
        nodes.forEach((other) => {
          if (node !== other) {
            const dx = node.x - other.x
            const dy = node.y - other.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 300) {
              // Increased from 200
              const force = 200 / (distance * distance) // Increased force
              node.vx += (dx / distance) * force
              node.vy += (dy / distance) * force
            }
          }
        })

        // Link forces (keep connected nodes at reasonable distance)
        links.forEach((link) => {
          if (link.sourceNode === node) {
            const dx = link.targetNode.x - node.x
            const dy = link.targetNode.y - node.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const targetDistance = 150 // Desired distance between connected nodes
            if (distance > targetDistance) {
              const force = (distance - targetDistance) * 0.001
              node.vx += (dx / distance) * force
              node.vy += (dy / distance) * force
            }
          }
          if (link.targetNode === node) {
            const dx = link.sourceNode.x - node.x
            const dy = link.sourceNode.y - node.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const targetDistance = 150
            if (distance > targetDistance) {
              const force = (distance - targetDistance) * 0.001
              node.vx += (dx / distance) * force
              node.vy += (dy / distance) * force
            }
          }
        })

        // Damping
        node.vx *= 0.95 // Increased damping
        node.vy *= 0.95

        // Update position
        node.x += node.vx
        node.y += node.vy

        // Boundary constraints with more padding
        node.x = Math.max(80, Math.min(width - 80, node.x))
        node.y = Math.max(80, Math.min(height - 80, node.y))
      })

      // Update SVG
      const nodeElements = svg.querySelectorAll(".entity-node")
      const linkElements = svg.querySelectorAll(".entity-link")

      nodeElements.forEach((element, i) => {
        element.setAttribute("transform", `translate(${nodes[i].x}, ${nodes[i].y})`)
      })

      linkElements.forEach((element, i) => {
        const link = links[i]
        element.setAttribute("x1", link.sourceNode.x.toString())
        element.setAttribute("y1", link.sourceNode.y.toString())
        element.setAttribute("x2", link.targetNode.x.toString())
        element.setAttribute("y2", link.targetNode.y.toString())
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <div className="w-full h-full relative bg-white/5 backdrop-blur-sm overflow-hidden">
      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-10">
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-gray-700"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-gray-700"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-gray-700"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Graph SVG */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        onMouseDown={handleMouseDown}
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(107, 114, 128, 0.8)" />
          </marker>
        </defs>

        <g style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
          {/* Links */}
          {relationships.map((rel, i) => (
            <g key={`${rel.source}-${rel.target}`}>
              <line
                className="entity-link"
                stroke="rgba(107, 114, 128, 0.6)"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
              <text
                className="entity-link-label"
                fill="rgba(107, 114, 128, 0.8)"
                fontSize="12"
                textAnchor="middle"
                dy="-5"
                pointerEvents="none"
              >
                {rel.label}
              </text>
            </g>
          ))}

          {/* Nodes */}
          {entities.map((entity) => (
            <g key={entity.id} className="entity-node cursor-pointer">
              <circle
                r="50"
                fill="rgba(255, 255, 255, 0.2)"
                stroke="rgba(139, 92, 246, 0.8)"
                strokeWidth="2"
                className="hover:fill-white/30 transition-colors backdrop-blur-sm"
              />
              <text
                textAnchor="middle"
                dy="0"
                fill="rgb(55, 65, 81)"
                fontSize="12"
                fontWeight="600"
                pointerEvents="none"
              >
                {entity.name}
              </text>
              <text textAnchor="middle" dy="15" fill="rgb(107, 114, 128)" fontSize="10" pointerEvents="none">
                {entity.sources.join(", ")}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

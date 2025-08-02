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
  { source: "employee", target: "employee", label: "manages" }, // Self-reference for manager relationships
]

export function EntitiesGraph() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
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

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      
      if (e.ctrlKey || e.metaKey) {
        // Zoom functionality with Ctrl/Cmd + wheel
        const container = svgRef.current?.parentElement
        const rect = container?.getBoundingClientRect()
        if (!rect) return
        
        // Use smaller, more controlled zoom increments
        const zoomSensitivity = 0.02
        const deltaY = Math.sign(e.deltaY) // Normalize to -1, 0, or 1
        const zoomDelta = -deltaY * zoomSensitivity
        
        const newZoom = Math.max(0.1, Math.min(3, zoom + zoomDelta))
        
        // Get mouse position relative to container
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
    const container = svgRef.current?.parentElement
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
      return () => {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [handleWheel])

  useEffect(() => {
    if (!svgRef.current) return

    const svg = svgRef.current
    const width = svg.clientWidth
    const height = svg.clientHeight

    // Force-directed graph: Initialize nodes with slight randomization to avoid local minima
    const nodes = entities.map((entity, i) => ({
      ...entity,
      x: width / 2 + (Math.random() - 0.5) * 100 + Math.cos((i * 2 * Math.PI) / entities.length) * 150,
      y: height / 2 + (Math.random() - 0.5) * 100 + Math.sin((i * 2 * Math.PI) / entities.length) * 150,
      vx: 0,
      vy: 0,
    }))

    const links = relationships.map((rel) => ({
      ...rel,
      sourceNode: nodes.find((n) => n.id === rel.source)!,
      targetNode: nodes.find((n) => n.id === rel.target)!,
    }))

    // Helper function to calculate edge endpoints at circle boundaries
    const getEdgeEndpoints = (sourceNode: any, targetNode: any, radius: number) => {
      const dx = targetNode.x - sourceNode.x
      const dy = targetNode.y - sourceNode.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance === 0) return null

      const unitX = dx / distance
      const unitY = dy / distance

      return {
        x1: sourceNode.x + unitX * radius,
        y1: sourceNode.y + unitY * radius,
        x2: targetNode.x - unitX * radius,
        y2: targetNode.y - unitY * radius,
      }
    }

    // Force-directed graph animation loop
    const animate = () => {
      // Constants for force calculations
      const COULOMB_CONSTANT = 50000 // Repulsive force strength (reduced by 20%)
      const SPRING_CONSTANT = 0.005 // Spring force strength for edges
      const SPRING_LENGTH = 120 // Natural length of springs (edges)
      const DAMPING = 0.9 // Velocity damping factor
      const CENTER_FORCE = 0.0001 // Very weak centering force
      const CIRCLE_RADIUS = 50

      // Apply forces to each node
      nodes.forEach((node) => {
        // Reset forces
        let fx = 0
        let fy = 0

        // 1. Coulomb's law repulsive forces between all nodes
        nodes.forEach((other) => {
          if (node !== other) {
            const dx = node.x - other.x
            const dy = node.y - other.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            // Avoid division by zero and very small distances
            if (distance > 0.1) {
              // Coulomb's law: F = k * q1 * q2 / r^2
              // Here we treat all nodes as having unit charge
              const force = COULOMB_CONSTANT / (distance * distance)
              const forceX = (dx / distance) * force
              const forceY = (dy / distance) * force

              fx += forceX
              fy += forceY
            }
          }
        })

        // 2. Spring forces (Hooke's law) for connected nodes (exclude self-loops)
        links.forEach((link) => {
          // Skip self-loops - they should only react to forces, not generate them
          if (link.sourceNode === link.targetNode) return

          if (link.sourceNode === node || link.targetNode === node) {
            const other = link.sourceNode === node ? link.targetNode : link.sourceNode
            const dx = other.x - node.x
            const dy = other.y - node.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance > 0.1) {
              // Hooke's law: F = k * (distance - natural_length)
              const displacement = distance - SPRING_LENGTH
              const force = SPRING_CONSTANT * displacement
              const forceX = (dx / distance) * force
              const forceY = (dy / distance) * force

              fx += forceX
              fy += forceY
            }
          }
        })

        // 3. Invisible containment barrier to force compact layouts
        const containerRadius = Math.min(width, height) * 0.25 // 25% of screen size
        const containerCenterX = width / 2
        const containerCenterY = height / 2

        const distanceFromCenter = Math.sqrt(
          (node.x - containerCenterX) ** 2 + (node.y - containerCenterY) ** 2
        )

        if (distanceFromCenter > containerRadius) {
          // Strong force pushing back toward center
          const pushForce = (distanceFromCenter - containerRadius) * 0.02
          const directionX = (containerCenterX - node.x) / distanceFromCenter
          const directionY = (containerCenterY - node.y) / distanceFromCenter

          fx += directionX * pushForce
          fy += directionY * pushForce
        }

        // 4. Update velocity based on forces
        node.vx += fx
        node.vy += fy

        // 5. Apply damping to prevent oscillation
        node.vx *= DAMPING
        node.vy *= DAMPING

        // 6. Update position
        node.x += node.vx
        node.y += node.vy

        // 7. Boundary constraints to keep nodes visible
        const margin = 100
        node.x = Math.max(margin, Math.min(width - margin, node.x))
        node.y = Math.max(margin, Math.min(height - margin, node.y))
      })

      // Update SVG
      const nodeElements = svg.querySelectorAll(".entity-node")
      const linkElements = svg.querySelectorAll(".entity-link")

      nodeElements.forEach((element, i) => {
        element.setAttribute("transform", `translate(${nodes[i].x}, ${nodes[i].y})`)
      })

      // Update self-loop paths
      const selfLoopPaths = svg.querySelectorAll("path.self-loop")
      const selfLoopLinks = links.filter(link => link.sourceNode === link.targetNode)

      selfLoopPaths.forEach((element, i) => {
        if (i < selfLoopLinks.length) {
          const node = selfLoopLinks[i].sourceNode
          const loopRadius = 35 // Slightly larger radius for smoother appearance
          const offset = CIRCLE_RADIUS + 8 // A bit more distance from node edge

          // Create a perfect circular loop using cubic Bezier curves
          // Start and end points at the top of the node
          const startX = node.x - 2
          const startY = node.y - CIRCLE_RADIUS
          const endX = node.x + 2
          const endY = node.y - CIRCLE_RADIUS

          // Calculate the center of the loop circle
          const centerX = node.x
          const centerY = node.y - CIRCLE_RADIUS - loopRadius

          // Use cubic Bezier curves to create a smooth circular arc
          // This creates approximately 3/4 of a circle for a clean loop
          const cp1X = centerX - loopRadius * 1.2 // Left control point
          const cp1Y = centerY - loopRadius * 0.2
          const cp2X = centerX - loopRadius * 0.8 // Top-left control point
          const cp2Y = centerY - loopRadius * 1.1
          const cp3X = centerX + loopRadius * 0.8 // Top-right control point
          const cp3Y = centerY - loopRadius * 1.1
          const cp4X = centerX + loopRadius * 1.2 // Right control point
          const cp4Y = centerY - loopRadius * 0.2

          // Create smooth circular path using two cubic Bezier curves
          const loopPath = `M ${startX},${startY} 
                           C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${centerX},${centerY - loopRadius}
                           C ${cp3X},${cp3Y} ${cp4X},${cp4Y} ${endX},${endY}`
          element.setAttribute("d", loopPath)
        }
      })

      // Update regular links (lines only, exclude self-loop components)
      const regularLinks = svg.querySelectorAll("line.entity-link")
      const regularLinkData = links.filter(link => link.sourceNode !== link.targetNode)
      regularLinks.forEach((element, i) => {
        if (i < regularLinkData.length) {
          const link = regularLinkData[i]
          const endpoints = getEdgeEndpoints(link.sourceNode, link.targetNode, CIRCLE_RADIUS)
          if (endpoints) {
            element.setAttribute("x1", endpoints.x1.toString())
            element.setAttribute("y1", endpoints.y1.toString())
            element.setAttribute("x2", endpoints.x2.toString())
            element.setAttribute("y2", endpoints.y2.toString())
          }
        }
      })

      // Update relationship labels to be positioned on top of edges and aligned parallel
      const labelElements = svg.querySelectorAll(".entity-link-label")
      labelElements.forEach((element, i) => {
        const link = links[i]
        const isSelfLoop = link.sourceNode === link.targetNode

        if (isSelfLoop) {
          // Position label for self-loop at the top of the circular arc
          const node = link.sourceNode
          const loopRadius = 35
          const offset = CIRCLE_RADIUS + 8

          // Position label at the peak of the loop (top center)
          const labelX = node.x
          const labelY = node.y - CIRCLE_RADIUS - loopRadius * 2 - 4 // Slightly above the loop peak

          element.setAttribute("x", labelX.toString())
          element.setAttribute("y", labelY.toString())
          element.setAttribute("transform", "") // No rotation for self-loop labels
        } else {
          // Position label for regular edge
          const endpoints = getEdgeEndpoints(link.sourceNode, link.targetNode, CIRCLE_RADIUS)

          if (endpoints) {
            // Calculate edge direction and angle
            const dx = endpoints.x2 - endpoints.x1
            const dy = endpoints.y2 - endpoints.y1
            const length = Math.sqrt(dx * dx + dy * dy)

            if (length > 0) {
              // Midpoint of the edge
              const midX = (endpoints.x1 + endpoints.x2) / 2
              const midY = (endpoints.y1 + endpoints.y2) / 2

              // Perpendicular offset to position label consistently "above" the line (toward screen top)
              let perpX = -dy / length // Perpendicular to edge direction
              let perpY = dx / length

              // Ensure the perpendicular vector always points "up" (negative Y direction)
              if (perpY > 0) {
                // If pointing down, flip to point up
                perpX = -perpX
                perpY = -perpY
              }

              const offsetDistance = 4 // Distance above the line (closer positioning)
              const labelX = midX + perpX * offsetDistance
              const labelY = midY + perpY * offsetDistance

              // Calculate rotation angle to align parallel with the edge
              let angle = Math.atan2(dy, dx) * (180 / Math.PI)

              // Keep text readable (don't flip upside down)
              if (angle > 90 || angle < -90) {
                angle += 180
              }

              element.setAttribute("x", labelX.toString())
              element.setAttribute("y", labelY.toString())
              element.setAttribute("transform", `rotate(${angle}, ${labelX}, ${labelY})`)
            }
          }
        }
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <div
      className="w-screen h-screen relative overflow-hidden"
      style={{
        backgroundColor: "#242629",
        // backgroundColor: "#FFF",
        // backgroundImage: `
        //   linear-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 1px),
        //   linear-gradient(90deg, rgba(0, 0, 0, 0.15) 1px, transparent 1px)
        // `,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        backgroundPosition: `${pan.x}px ${pan.y}px`,
      }}
    >
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

        <g style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
          {/* Links */}
          {relationships.map((rel, i) => {
            const isSelfLoop = rel.source === rel.target

            if (isSelfLoop) {
              // Self-loop: circular arc positioned above the node
              return (
                <g key={`${rel.source}-${rel.target}-${i}`}>
                  <path
                    className="entity-link self-loop"
                    stroke="rgba(107, 114, 128, 0.6)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    markerEnd="url(#arrowhead)"
                    d="M -2,-50 C -42,-52 -28,-120 0,-85 C 28,-120 42,-52 2,-50" // Will be updated by animation
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
              )
            } else {
              // Regular link: render as straight line
              return (
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
              )
            }
          })}

          {/* Nodes */}
          {entities.map((entity) => (
            <g key={entity.id} className="entity-node cursor-pointer">
              <circle
                r="50"
                fill="rgba(255, 255, 255, 0.2)"
                stroke="rgba(59, 130, 246, 0.8)"
                strokeWidth="2"
                className="hover:fill-white/30 transition-colors backdrop-blur-sm"
              />
              <text
                textAnchor="middle"
                dy="0.35em"
                fill="rgb(255, 255, 255)"
                fontSize="12"
                fontWeight="600"
                pointerEvents="none"
                dominantBaseline="middle"
              >
                {entity.name}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

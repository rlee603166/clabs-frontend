"use client"

import { useState } from "react"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NodePalette } from "@/components/node-palette"
import { SourcesCanvas } from "@/components/sources-canvas"
import { EntitiesGraph } from "@/components/entities-graph"
import { cn } from "@/lib/utils"

interface LeftPaneProps {
  activeView: "sources" | "entities"
  setActiveView: (view: "sources" | "entities") => void
  selectedNodes: string[]
  setSelectedNodes: (nodes: string[]) => void
  connectedSources: string[]
  setConnectedSources: (sources: string[]) => void
}

export function LeftPane({
  activeView,
  setActiveView,
  selectedNodes,
  setSelectedNodes,
  connectedSources,
  setConnectedSources,
}: LeftPaneProps) {
  const [paletteCollapsed, setPaletteCollapsed] = useState(false)

  return (
    <div className="flex-1 flex min-h-0">
      {/* Node Palette */}
      <div
        className={cn(
          "bg-white/5 backdrop-blur-sm border-r border-white/10 transition-all duration-300 flex-shrink-0",
          paletteCollapsed ? "w-12" : "w-64",
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            {!paletteCollapsed && <h3 className="font-medium text-gray-800">Tables</h3>}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPaletteCollapsed(!paletteCollapsed)}
              className="h-8 w-8 text-gray-600 hover:text-gray-800 hover:bg-white/20"
            >
              {paletteCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          {!paletteCollapsed && (
            <NodePalette connectedSources={connectedSources} setConnectedSources={setConnectedSources} />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-16 bg-white/5 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center space-x-6">
            {/* Toggle Switch */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-1 flex">
              <button
                onClick={() => setActiveView("sources")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeView === "sources"
                    ? "bg-white/20 text-gray-800 shadow-lg backdrop-blur-sm"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/10",
                )}
              >
                Sources
              </button>
              <button
                onClick={() => setActiveView("entities")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeView === "entities"
                    ? "bg-white/20 text-gray-800 shadow-lg backdrop-blur-sm"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/10",
                )}
              >
                Entities
              </button>
            </div>

            {/* Ingest Button */}
            <Button
              disabled={selectedNodes.length === 0}
              className="bg-blue-500/80 hover:bg-blue-600/80 disabled:bg-gray-400/50 disabled:text-gray-600 text-white backdrop-blur-sm rounded-xl"
            >
              <Play className="h-4 w-4 mr-2" />
              Ingest
            </Button>
          </div>

          {/* Status */}
          <Badge className="bg-green-500/20 text-green-700 border-green-500/30 backdrop-blur-sm">
            {connectedSources.length} tables connected
          </Badge>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative min-h-0">
          {activeView === "sources" ? (
            <SourcesCanvas selectedNodes={selectedNodes} setSelectedNodes={setSelectedNodes} />
          ) : (
            <EntitiesGraph />
          )}
        </div>
      </div>
    </div>
  )
}

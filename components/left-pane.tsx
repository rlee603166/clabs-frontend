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
  selectedNodes: string[]
  setSelectedNodes: (nodes: string[]) => void
  connectedSources: string[]
  setConnectedSources: (sources: string[]) => void
}

export function LeftPane({
  selectedNodes,
  setSelectedNodes,
  connectedSources,
  setConnectedSources,
}: LeftPaneProps) {
  const [paletteCollapsed, setPaletteCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "fixed left-4 top-[10%] bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 z-40",
        paletteCollapsed ? "w-12 h-12" : "w-72 h-[80%]",
      )}
    >
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          {!paletteCollapsed && <h3 className="font-medium text-white text-sm">Tables</h3>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPaletteCollapsed(!paletteCollapsed)}
            className="h-6 w-6 text-gray-400 hover:text-white hover:bg-white/20"
          >
            {paletteCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        </div>
        {!paletteCollapsed && (
          <NodePalette connectedSources={connectedSources} setConnectedSources={setConnectedSources} />
        )}

        {/* Ingest Button and Status */}
        {!paletteCollapsed && (
          <div className="p-3 border-t border-white/10 flex flex-col space-y-2 mt-auto">
            <Button
              disabled={connectedSources.length === 0}
              className="bg-blue-500/80 hover:bg-blue-600/80 disabled:bg-gray-400/50 disabled:text-gray-600 text-white backdrop-blur-sm rounded-xl text-xs py-2"
            >
              <Play className="h-3 w-3 mr-1" />
              Ingest
            </Button>
            <Badge className="bg-green-400/20 text-green-500 border-green-500/30 backdrop-blur-sm self-start text-xs">
              {connectedSources.length} tables
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}

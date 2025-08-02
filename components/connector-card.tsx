"use client"

import { useDrag } from "react-dnd"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Connector {
  id: string
  name: string
  icon: string
  type: string
  fields: string[]
  record_count?: number
  description?: string
  source_file?: string
}

interface ConnectorCardProps {
  connector: Connector
  isConnected: boolean
}

export function ConnectorCard({ connector, isConnected }: ConnectorCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "table",
    item: { ...connector },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={cn(
        "p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 cursor-move transition-all duration-200 hover:bg-white/15 hover:border-white/30 hover:shadow-lg",
        isDragging && "opacity-50 scale-95",
        isConnected && "ring-2 ring-green-500/50 bg-green-500/10",
      )}
    >
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{connector.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-white truncate">{connector.name}</div>
          <div className="text-xs text-white">{connector.type}</div>
          <div className="text-xs text-white/50 mt-1">
            {connector.fields.slice(0, 3).join(", ")}
            {connector.fields.length > 3 && "..."}
            {connector.record_count && (
              <div className="text-xs text-white/40 mt-1">
                {connector.record_count.toLocaleString()} records
              </div>
            )}
          </div>
        </div>
        {isConnected && <Badge className="bg-green-500/20 text-green-200 border-green-500/30 text-xs">Connected</Badge>}
      </div>
    </div>
  )
}

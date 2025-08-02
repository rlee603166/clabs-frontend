"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ConnectorCard } from "@/components/connector-card"

interface ApiConnector {
  name: string
  type: string
  source_file: string
  record_count: number
  columns: string[]
  description: string
  sample_data: Record<string, any>
}

interface ApiResponse {
  total_connectors: number
  connectors: ApiConnector[]
  postgresql_sources: number
  mongodb_sources: number
}

const getIconForType = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'postgresql':
      return '🗄️'
    case 'mongodb':
      return '🍃'
    case 'neo4j':
      return '🔗'
    case 'mysql':
      return '🐬'
    case 'sqlite':
      return '📋'
    default:
      return '📊'
  }
}

const formatType = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'postgresql':
      return 'PostgreSQL'
    case 'mongodb':
      return 'MongoDB'
    default:
      return type.charAt(0).toUpperCase() + type.slice(1)
  }
}

interface NodePaletteProps {
  connectedSources: string[]
  setConnectedSources: (sources: string[]) => void
}

export function NodePalette({ connectedSources, setConnectedSources }: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [tables, setTables] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConnectors = async () => {
      try {
        setLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await fetch(`${apiUrl}/api/v1/connectors/available`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: ApiResponse = await response.json()
        
        const transformedTables = data.connectors.map((connector) => ({
          id: connector.name.toLowerCase().replace(/\s+/g, '_'),
          name: connector.name,
          icon: getIconForType(connector.type),
          type: formatType(connector.type),
          fields: connector.columns,
          record_count: connector.record_count,
          description: connector.description,
          source_file: connector.source_file
        }))
        
        setTables(transformedTables)
        setError(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch connectors'
        setError(`${errorMessage}. Make sure the API server is running on port 8000.`)
        console.error('Error fetching connectors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConnectors()
  }, [])

  // Filter tables based on search query
  const filteredTables = tables.filter((table) => {
    const query = searchQuery.toLowerCase()
    return (
      table.name.toLowerCase().includes(query) ||
      table.type.toLowerCase().includes(query) ||
      table.fields.some(field => field.toLowerCase().includes(query))
    )
  })

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Search */}
      <div className="p-4 border-b border-white/10 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 backdrop-blur-sm rounded-xl"
          />
        </div>
      </div>

      {/* Table Cards */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-400 py-8">
            <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white/60 rounded-full mx-auto mb-2"></div>
            <p>Loading connectors...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-8">
            <p className="mb-2">Failed to load connectors</p>
            <p className="text-sm text-red-300 mb-3">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm hover:bg-red-500/30 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No tables found matching "{searchQuery}"</p>
          </div>
        ) : (
          filteredTables.map((table) => (
            <ConnectorCard
              key={table.id}
              connector={table}
              isConnected={connectedSources.includes(table.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

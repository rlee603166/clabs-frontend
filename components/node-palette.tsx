"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ConnectorCard } from "@/components/connector-card"

const tables = [
  { id: "customers", name: "Customers", icon: "👥", type: "PostgreSQL", fields: ["id", "name", "email", "industry"] },
  { id: "orders", name: "Orders", icon: "📦", type: "PostgreSQL", fields: ["id", "customer_id", "amount", "date"] },
  { id: "products", name: "Products", icon: "🛍️", type: "PostgreSQL", fields: ["id", "name", "price", "category"] },
  {
    id: "support_tickets",
    name: "Support Tickets",
    icon: "🎫",
    type: "Neo4j",
    fields: ["id", "customer_id", "description"],
  },
  {
    id: "employees",
    name: "Employees",
    icon: "👨‍💼",
    type: "PostgreSQL",
    fields: ["id", "name", "department", "manager_id"],
  },
  {
    id: "user_embeddings",
    name: "User Embeddings",
    icon: "🧠",
    type: "Pinecone",
    fields: ["id", "vector", "metadata"],
  },
  {
    id: "product_reviews",
    name: "Product Reviews",
    icon: "⭐",
    type: "MongoDB",
    fields: ["id", "product_id", "rating", "text"],
  },
  {
    id: "sales_data",
    name: "Sales Data",
    icon: "📊",
    type: "Salesforce",
    fields: ["id", "opportunity", "amount", "stage"],
  },
]

interface NodePaletteProps {
  connectedSources: string[]
  setConnectedSources: (sources: string[]) => void
}

export function NodePalette({ connectedSources, setConnectedSources }: NodePaletteProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Search */}
      <div className="p-4 border-b border-white/10 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tables..."
            className="pl-10 bg-white/10 border-white/20 text-gray-800 placeholder-gray-500 backdrop-blur-sm rounded-xl"
          />
        </div>
      </div>

      {/* Table Cards */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {tables.map((table) => (
          <ConnectorCard
            key={table.id}
            connector={table}
            isConnected={connectedSources.includes(table.id)}
            onToggleConnection={(id, connected) => {
              if (connected) {
                setConnectedSources([...connectedSources, id])
              } else {
                setConnectedSources(connectedSources.filter((s) => s !== id))
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}

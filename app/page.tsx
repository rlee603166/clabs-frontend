"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { LeftPane } from "@/components/left-pane"
import { RightPane } from "@/components/right-pane"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

export default function Home() {
  const [activeView, setActiveView] = useState<"sources" | "entities">("sources")
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])
  const [connectedSources, setConnectedSources] = useState<string[]>(["customers", "orders", "support_tickets"])

  return (
    <div className="min-h-screen bg-[#E8E2F7] p-2">
      <DndProvider backend={HTML5Backend}>
        <div className="h-[calc(100vh-16px)] bg-white/15 backdrop-blur-[40px] rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex-1 flex min-h-0">
            <LeftPane
              activeView={activeView}
              setActiveView={setActiveView}
              selectedNodes={selectedNodes}
              setSelectedNodes={setSelectedNodes}
              connectedSources={connectedSources}
              setConnectedSources={setConnectedSources}
            />
            <RightPane />
          </div>
        </div>
      </DndProvider>
    </div>
  )
}

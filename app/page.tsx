"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { LeftPane } from "@/components/left-pane"
import { RightPane } from "@/components/right-pane"
import { SourcesCanvas } from "@/components/sources-canvas"
import { EntitiesGraph } from "@/components/entities-graph"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

export default function Home() {
  const [activeView, setActiveView] = useState<"sources" | "entities">("sources")
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])
  const [connectedSources, setConnectedSources] = useState<string[]>([])

  return (
    <DndProvider backend={HTML5Backend}>
      {/* FULLSCREEN CANVAS - THE MAP */}
      {activeView === "sources" ? (
        <SourcesCanvas 
          selectedNodes={selectedNodes} 
          setSelectedNodes={setSelectedNodes}
          connectedSources={connectedSources}
          setConnectedSources={setConnectedSources}
        />
      ) : (
        <EntitiesGraph />
      )}

      {/* FLOATING HUD ELEMENTS */}
      <Navbar 
        activeView={activeView}
        setActiveView={setActiveView}
      />
      
      <LeftPane
        selectedNodes={selectedNodes}
        setSelectedNodes={setSelectedNodes}
        connectedSources={connectedSources}
        setConnectedSources={setConnectedSources}
      />
      
      <RightPane />
    </DndProvider>
  )
}

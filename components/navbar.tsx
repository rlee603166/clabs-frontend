"use client"

import { Settings, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface NavbarProps {
  activeView: "sources" | "entities"
  setActiveView: (view: "sources" | "entities") => void
}

export function Navbar({ activeView, setActiveView }: NavbarProps) {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl px-6 py-3 flex items-center space-x-6 z-50">
      <div className="text-xl font-semibold text-white">Circl</div>

      {/* View Toggle Switch */}
      <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-1 flex">
        <button
          onClick={() => setActiveView("sources")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            activeView === "sources"
              ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
              : "text-gray-400 hover:text-white hover:bg-white/10",
          )}
        >
          Sources
        </button>
        <button
          onClick={() => setActiveView("entities")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            activeView === "entities"
              ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
              : "text-gray-400 hover:text-white hover:bg-white/10",
          )}
        >
          Entities
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/20">
          <Settings className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-white/20"
            >
              <User className="h-5 w-5" />
              <span>Admin</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-md border-white/20">
            <DropdownMenuItem className="text-gray-700 hover:text-gray-900 hover:bg-white/30">Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-700 hover:text-gray-900 hover:bg-white/30">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-700 hover:text-gray-900 hover:bg-white/30">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

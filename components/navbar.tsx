"use client"

import { Settings, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navbar() {
  return (
    <nav className="h-16 bg-white/10 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-semibold text-gray-800">Circl</div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-800 hover:bg-white/20">
          <Settings className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 hover:bg-white/20"
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

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 frontend application built with React 19, TypeScript, and Tailwind CSS. The app is a data visualization and analysis tool featuring a GPS-style interface with a fullscreen canvas for drag-and-drop data source connections and entity relationship exploration, overlaid with floating HUD (heads-up display) panels.

## Development Commands

- **Development server**: `npm run dev` or `pnpm dev`
- **Build**: `npm run build` 
- **Production server**: `npm run start`
- **Linting**: `npm run lint`

## Architecture

### GPS-Style Layout Architecture
The application uses a unique GPS/map-style layout where:
- **Canvas Layer**: SourcesCanvas/EntitiesGraph components fill the entire viewport (`w-screen h-screen`) as the base layer
- **HUD Overlays**: UI components float as fixed overlays using absolute/fixed positioning with high z-indexes
- **No Layout Containers**: Canvas renders directly without wrapper constraints to enable true fullscreen interaction

### Core Layout Structure (`app/page.tsx`)
```jsx
<DndProvider backend={HTML5Backend}>
  {/* FULLSCREEN CANVAS - THE MAP */}
  {activeView === "sources" ? <SourcesCanvas /> : <EntitiesGraph />}
  
  {/* FLOATING HUD ELEMENTS */}
  <Navbar />     // Floating top-center bar with view toggle
  <LeftPane />   // Floating left panel with node palette  
  <RightPane />  // Floating right chat panel
</DndProvider>
```

### Component Architecture

#### Canvas Components (Base Layer)
- **SourcesCanvas**: Fullscreen drag-and-drop canvas with pannable grid background for data source connections
- **EntitiesGraph**: Fullscreen entity relationship visualization with interactive node simulation

#### HUD Components (Floating Overlays)
- **Navbar**: Compact floating bar (`fixed top-4 left-1/2`) containing app title and view toggle controls
- **LeftPane**: Collapsible floating panel (`fixed left-4 top-20`) with:
  - Node palette for draggable data tables
  - Ingest button and connection status
  - Glassmorphic styling with rounded corners
- **RightPane**: Floating chat interface (`fixed right-4 top-20`) with:
  - Message history and data query capabilities
  - Simulated latency metrics and function call displays
  - Compact HUD-style design

### State Management
React state with props drilling for:
- `activeView`: Controls which canvas is rendered ("sources" | "entities")
- `selectedNodes`: Tracks selected nodes across the interface
- `connectedSources`: Array of connected data source names
- View switching handled at main level, passed to navbar

### Visual Design System
- **Glassmorphism**: All HUD elements use `bg-white/15 backdrop-blur-md` with rounded corners and shadows
- **Grid Background**: Dark gray canvas with white grid lines that move with pan interactions
- **Z-Index Layering**: Canvas (z-0), HUD panels (z-40), Navbar (z-50)
- **GPS-Style Positioning**: Fixed positioning creates true overlay effect where canvas moves but HUD stays fixed

### Drag and Drop System
- Uses `react-dnd` with HTML5 backend across the fullscreen canvas
- Drop targets work seamlessly across the entire viewport
- Canvas panning and DnD interactions coexist without interference

### Key Architectural Patterns
- **Fullscreen Canvas Pattern**: Canvas components take full viewport without layout constraints
- **HUD Overlay Pattern**: UI elements positioned absolutely with glass styling
- **State Lifting**: Canvas switching logic lifted to main component level
- **Props Drilling**: Simple state management through component props (no global state needed)

### Key Configuration
- **TypeScript**: Configured with strict mode
- **Next.js**: Build errors and ESLint ignored (configured for rapid prototyping)
- **Path Aliases**: `@/components`, `@/lib`, `@/hooks`, `@/ui`
- **Shadcn/ui**: Extensive component library with Tailwind CSS integration

### Canvas Interaction Patterns
1. **Pan Interaction**: Grid background moves with mouse drag while HUD elements remain fixed
2. **Drop Zones**: Entire canvas surface accepts dragged nodes from left panel
3. **View Switching**: Navbar controls toggle between SourcesCanvas and EntitiesGraph as background
4. **State Persistence**: Selected nodes and connections persist across view switches

## Dependencies Notes
- Built on Next.js 15 with React 19 (latest versions)
- Uses shadcn/ui component library extensively
- Drag-and-drop with react-dnd and HTML5 backend
- UI styling with Tailwind CSS and glassmorphism effects
- Icons with Lucide React library
- Fonts: Geist Sans and Geist Mono
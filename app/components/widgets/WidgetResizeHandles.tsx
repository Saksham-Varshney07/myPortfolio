"use client"

import React from "react"
import { ResizeDir } from "./useWidgetResize"

interface WidgetResizeHandlesProps {
  onResizeStart: (e: React.PointerEvent, dir: ResizeDir) => void
  showGrip?: boolean
}

export default function WidgetResizeHandles({
  onResizeStart,
  showGrip = true,
}: WidgetResizeHandlesProps) {
  return (
    <>
      {/* 4 Edges */}
      {/* Top Edge */}
      <div
        className="absolute -top-1.5 left-2 right-2 h-3 cursor-ns-resize z-40 select-none"
        title="Resize"
        onPointerDown={(e) => onResizeStart(e, "n")}
      />
      {/* Bottom Edge */}
      <div
        className="absolute -bottom-1.5 left-2 right-2 h-3 cursor-ns-resize z-40 select-none"
        title="Resize"
        onPointerDown={(e) => onResizeStart(e, "s")}
      />
      {/* Left Edge */}
      <div
        className="absolute -left-1.5 top-2 bottom-2 w-3 cursor-ew-resize z-40 select-none"
        title="Resize"
        onPointerDown={(e) => onResizeStart(e, "w")}
      />
      {/* Right Edge */}
      <div
        className="absolute -right-1.5 top-2 bottom-2 w-3 cursor-ew-resize z-40 select-none"
        title="Resize"
        onPointerDown={(e) => onResizeStart(e, "e")}
      />

      {/* 4 Corners */}
      {/* Top Left */}
      <div
        className="absolute -top-2 -left-2 w-4 h-4 cursor-nwse-resize z-50 select-none"
        title="Resize"
        onPointerDown={(e) => onResizeStart(e, "nw")}
      />
      {/* Top Right */}
      <div
        className="absolute -top-2 -right-2 w-4 h-4 cursor-nesw-resize z-50 select-none"
        title="Resize"
        onPointerDown={(e) => onResizeStart(e, "ne")}
      />
      {/* Bottom Left */}
      <div
        className="absolute -bottom-2 -left-2 w-4 h-4 cursor-nesw-resize z-50 select-none"
        title="Resize"
        onPointerDown={(e) => onResizeStart(e, "sw")}
      />
      {/* Bottom Right (with subtle visual resize grip) */}
      <div
        className="absolute -bottom-2 -right-2 w-5 h-5 cursor-nwse-resize z-50 select-none flex items-end justify-end p-1 group/grip"
        title="Resize"
        onPointerDown={(e) => onResizeStart(e, "se")}
      >
        {showGrip && (
          <svg
            className="w-2.5 h-2.5 opacity-30 group-hover/grip:opacity-80 transition-opacity pointer-events-none"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="8" y1="2" x2="2" y2="8" />
            <line x1="8" y1="5.5" x2="5.5" y2="8" />
          </svg>
        )}
      </div>
    </>
  )
}

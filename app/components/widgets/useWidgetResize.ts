"use client"

import { useState, useRef, useCallback } from "react"

export type ResizeDir = "e" | "w" | "s" | "n" | "se" | "sw" | "ne" | "nw"

interface UseWidgetResizeOptions {
  initialWidth: number
  initialHeight?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

export function useWidgetResize({
  initialWidth,
  initialHeight,
  minWidth = 180,
  minHeight = 100,
  maxWidth = 750,
  maxHeight = 650,
}: UseWidgetResizeOptions) {
  const [size, setSize] = useState<{ width: number; height?: number }>({
    width: initialWidth,
    height: initialHeight,
  })

  const sizeRef = useRef(size)
  sizeRef.current = size

  const isResizingRef = useRef(false)

  const handleResizeStart = useCallback(
    (e: React.PointerEvent, dir: ResizeDir) => {
      e.preventDefault()
      e.stopPropagation()

      const startX = e.clientX
      const startY = e.clientY
      const startW = sizeRef.current.width
      const containerEl = e.currentTarget.parentElement
      const startH = sizeRef.current.height ?? (containerEl ? containerEl.offsetHeight : minHeight)

      isResizingRef.current = true

      const cursorMap: Record<ResizeDir, string> = {
        e: "ew-resize",
        w: "ew-resize",
        s: "ns-resize",
        n: "ns-resize",
        se: "nwse-resize",
        sw: "nesw-resize",
        ne: "nesw-resize",
        nw: "nwse-resize",
      }
      document.body.style.cursor = cursorMap[dir]
      document.body.style.userSelect = "none"

      const onPointerMove = (moveEvt: PointerEvent) => {
        const deltaX = moveEvt.clientX - startX
        const deltaY = moveEvt.clientY - startY

        let newW = startW
        let newH = startH

        if (dir.includes("e")) {
          newW = Math.max(minWidth, Math.min(maxWidth, startW + deltaX))
        } else if (dir.includes("w")) {
          newW = Math.max(minWidth, Math.min(maxWidth, startW - deltaX))
        }

        if (dir.includes("s")) {
          newH = Math.max(minHeight, Math.min(maxHeight, startH + deltaY))
        } else if (dir.includes("n")) {
          newH = Math.max(minHeight, Math.min(maxHeight, startH - deltaY))
        }

        setSize({ width: Math.round(newW), height: Math.round(newH) })
      }

      const onPointerUp = () => {
        isResizingRef.current = false
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
        window.removeEventListener("pointermove", onPointerMove)
        window.removeEventListener("pointerup", onPointerUp)
      }

      window.addEventListener("pointermove", onPointerMove)
      window.addEventListener("pointerup", onPointerUp)
    },
    [minWidth, minHeight, maxWidth, maxHeight]
  )

  return {
    width: size.width,
    height: size.height,
    handleResizeStart,
  }
}

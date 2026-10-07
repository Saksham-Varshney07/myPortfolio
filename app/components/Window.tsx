"use client"

import { useEffect, useId, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Square, X } from "lucide-react"
import { playClickSound } from "@/lib/sound"

interface WindowProps {
  windowId?: string
  title: string
  isOpen: boolean
  isFocused: boolean
  isMinimized?: boolean
  onClose: () => void
  onMinimize?: () => void
  onFocus: () => void
  zIndex: number
  children: React.ReactNode
  width?: number
  height?: number
  offsetX?: number
  offsetY?: number
}

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"

const MIN_WIDTH = 320
const MIN_HEIGHT = 200

export default function Window({
  windowId,
  title,
  isOpen,
  isFocused,
  isMinimized = false,
  onClose,
  onMinimize,
  onFocus,
  zIndex,
  children,
  width = 640,
  height = 520,
  offsetX = 0,
  offsetY = 0,
}: WindowProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const reactId = useId()
  const titleId = `window-title-${windowId ?? reactId}`

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [size, setSize] = useState<{ width: number; height: number }>({
    width,
    height,
  })
  const [isMaximized, setIsMaximized] = useState(false)
  const preMaximizeState = useRef<{ x: number; y: number; width: number; height: number } | null>(null)
  const isHydrated = useRef(false)

  // Initialize once on mount with accurate viewport measurements
  useEffect(() => {
    if (!isHydrated.current && typeof window !== "undefined") {
      isHydrated.current = true
      const actualWidth = Math.min(width, window.innerWidth - 32)
      const actualHeight = Math.min(height, window.innerHeight - 140)
      setSize({ width: actualWidth, height: actualHeight })
    }
  }, [width, height])

  // ESC key listener
  useEffect(() => {
    if (!isOpen || !isFocused) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, isFocused, onClose])

  // Focus trap prevention
  useEffect(() => {
    if (isOpen && isFocused) dialogRef.current?.focus({ preventScroll: true })
  }, [isOpen, isFocused])

  // Toggle Maximize
  const toggleMaximize = useCallback(() => {
    playClickSound()
    if (isMaximized) {
      if (preMaximizeState.current) {
        setPosition({ x: preMaximizeState.current.x, y: preMaximizeState.current.y })
        setSize({ width: preMaximizeState.current.width, height: preMaximizeState.current.height })
      } else {
        setPosition(null)
      }
      setIsMaximized(false)
    } else {
      const rect = dialogRef.current?.getBoundingClientRect()
      const currX = position ? position.x : (rect ? rect.left : 12)
      const currY = position ? position.y : (rect ? rect.top : 36)
      preMaximizeState.current = { x: currX, y: currY, width: size.width, height: size.height }
      const maxWidth = window.innerWidth - 24
      const maxHeight = window.innerHeight - 84
      setPosition({ x: 12, y: 36 })
      setSize({ width: maxWidth, height: maxHeight })
      setIsMaximized(true)
    }
  }, [isMaximized, position, size])

  // Window Titlebar Drag Handler
  const handleTitlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest("button")) return

    e.preventDefault()
    onFocus()

    const rect = dialogRef.current?.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const startPosX = position ? position.x : (rect ? rect.left : 0)
    const startPosY = position ? position.y : (rect ? rect.top : 0)

    document.body.style.userSelect = "none"

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY

      const maxX = window.innerWidth - 80
      const maxY = window.innerHeight - 40
      const minTop = 28 // MenuBar clearance

      const newX = Math.max(10 - size.width + 80, Math.min(maxX, startPosX + deltaX))
      const newY = Math.max(minTop, Math.min(maxY, startPosY + deltaY))

      if (isMaximized) {
        setIsMaximized(false)
      }

      setPosition({ x: newX, y: newY })
    }

    const onPointerUp = () => {
      document.body.style.userSelect = ""
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
  }

  // Window Edge Resize Handler
  const handleResizeStart = (e: React.PointerEvent, direction: ResizeDirection) => {
    e.preventDefault()
    e.stopPropagation()
    onFocus()

    const rect = dialogRef.current?.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const startW = size.width
    const startH = size.height
    const startPosX = position !== null ? position.x : (rect ? rect.left : Math.round((window.innerWidth - size.width) / 2 + offsetX))
    const startPosY = position !== null ? position.y : (rect ? rect.top : Math.round((window.innerHeight - size.height) / 2 + offsetY + 30))

    const cursorMap: Record<ResizeDirection, string> = {
      e: "ew-resize",
      w: "ew-resize",
      s: "ns-resize",
      n: "ns-resize",
      se: "nwse-resize",
      sw: "nesw-resize",
      ne: "nesw-resize",
      nw: "nwse-resize",
    }
    document.body.style.cursor = cursorMap[direction]
    document.body.style.userSelect = "none"

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY

      let newWidth = startW
      let newHeight = startH
      let newPosX = startPosX
      let newPosY = startPosY

      // Horizontal adjustments
      if (direction.includes("e")) {
        newWidth = Math.max(MIN_WIDTH, Math.min(window.innerWidth - newPosX - 10, startW + deltaX))
      } else if (direction.includes("w")) {
        const maxExpandLeft = startPosX - 10
        const clampedDeltaX = Math.max(-maxExpandLeft, Math.min(startW - MIN_WIDTH, deltaX))
        newWidth = startW - clampedDeltaX
        newPosX = startPosX + clampedDeltaX
      }

      // Vertical adjustments
      if (direction.includes("s")) {
        newHeight = Math.max(MIN_HEIGHT, Math.min(window.innerHeight - newPosY - 10, startH + deltaY))
      } else if (direction.includes("n")) {
        const maxExpandTop = startPosY - 28 // MenuBar clearance
        const clampedDeltaY = Math.max(-maxExpandTop, Math.min(startH - MIN_HEIGHT, deltaY))
        newHeight = startH - clampedDeltaY
        newPosY = startPosY + clampedDeltaY
      }

      if (isMaximized) setIsMaximized(false)
      setSize({ width: Math.round(newWidth), height: Math.round(newHeight) })
      setPosition({ x: Math.round(newPosX), y: Math.round(newPosY) })
    }

    const onPointerUp = () => {
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          tabIndex={-1}
          style={{
            position: "fixed",
            left: position
              ? position.x
              : `calc(50% - ${size.width / 2}px + ${offsetX}px)`,
            top: position
              ? position.y
              : `clamp(115px, calc(50% - ${size.height / 2}px + ${offsetY}px + 30px), calc(100vh - ${size.height}px - 20px))`,
            width: size.width,
            height: size.height,
            zIndex,
            outline: "none",
            pointerEvents: isMinimized ? "none" : "auto",
          }}
          initial={{
            scale: 0.92,
            opacity: 0,
            y: 14,
          }}
          animate={{
            scale: isMinimized ? 0.92 : 1,
            opacity: isMinimized ? 0 : 1,
            y: isMinimized ? 14 : 0,
          }}
          exit={{
            scale: 0.92,
            opacity: 0,
            y: 14,
          }}
          transition={{
            type: "spring",
            damping: 28,
            stiffness: 380,
            opacity: { duration: 0.18, ease: "easeInOut" },
          }}
          onPointerDown={onFocus}
        >
          {/* ========================================================= */}
          {/* 8-Direction Resizing Hover Hitboxes                       */}
          {/* ========================================================= */}
          {/* Top Edge */}
          <div
            onPointerDown={(e) => handleResizeStart(e, "n")}
            className="absolute -top-1.5 left-3 right-3 h-3 cursor-ns-resize z-30"
            title="Resize window"
          />
          {/* Bottom Edge */}
          <div
            onPointerDown={(e) => handleResizeStart(e, "s")}
            className="absolute -bottom-1.5 left-3 right-3 h-3 cursor-ns-resize z-30"
            title="Resize window"
          />
          {/* Left Edge */}
          <div
            onPointerDown={(e) => handleResizeStart(e, "w")}
            className="absolute -left-1.5 top-3 bottom-3 w-3 cursor-ew-resize z-30"
            title="Resize window"
          />
          {/* Right Edge */}
          <div
            onPointerDown={(e) => handleResizeStart(e, "e")}
            className="absolute -right-1.5 top-3 bottom-3 w-3 cursor-ew-resize z-30"
            title="Resize window"
          />
          {/* Corners */}
          <div
            onPointerDown={(e) => handleResizeStart(e, "nw")}
            className="absolute -top-1.5 -left-1.5 w-4 h-4 cursor-nwse-resize z-30"
            title="Resize window"
          />
          <div
            onPointerDown={(e) => handleResizeStart(e, "ne")}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 cursor-nesw-resize z-30"
            title="Resize window"
          />
          <div
            onPointerDown={(e) => handleResizeStart(e, "sw")}
            className="absolute -bottom-1.5 -left-1.5 w-4 h-4 cursor-nesw-resize z-30"
            title="Resize window"
          />
          <div
            onPointerDown={(e) => handleResizeStart(e, "se")}
            className="absolute -bottom-1.5 -right-1.5 w-4 h-4 cursor-nwse-resize z-30"
            title="Resize window"
          />

          {/* ========================================================= */}
          {/* Window Body & Titlebar                                    */}
          {/* ========================================================= */}
          <div
            data-mac-window
            className="retroui-card flex flex-col overflow-hidden w-full h-full relative"
            style={{
              transition: "box-shadow 0.2s ease, border-color 0.2s ease",
            }}
          >
            {/* Title Bar */}
            <div
              className="flex-none flex items-center justify-between h-10 px-0 relative select-none cursor-grab active:cursor-grabbing"
              style={{
                background: "var(--titlebar-bg)",
                borderBottom: "1px solid var(--window-border-unfocused)",
              }}
              onPointerDown={handleTitlePointerDown}
              onDoubleClick={toggleMaximize}
            >
              {/* Perfectly centered title with Minecraft font */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h2
                  id={titleId}
                  className="font-minecraft-bold text-[14px] uppercase tracking-[0.14em] m-0 font-bold select-none"
                  style={{
                    color: isFocused ? "var(--text-primary)" : "var(--text-muted)",
                    transition: "color 0.2s",
                  }}
                >
                  {title}
                </h2>
              </div>

              {/* Titlebar Control Buttons */}
              <div className="ml-auto flex items-center h-full relative z-10" style={{ color: "var(--text-secondary)" }}>
                {/* Minimize */}
                <button
                  type="button"
                  aria-hidden="true"
                  className="h-full w-11 sm:w-12 flex items-center justify-center transition-colors cursor-pointer"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-subtle)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "inherit"; }}
                  onClick={(e) => { e.stopPropagation(); playClickSound(); onMinimize?.(); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  title="Minimize"
                >
                  <Minus size={17} strokeWidth={2} />
                </button>
                {/* Maximize / Restore */}
                <button
                  type="button"
                  aria-label={isMaximized ? "Restore window" : "Maximize window"}
                  className="h-full w-11 sm:w-12 flex items-center justify-center transition-colors cursor-pointer"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-subtle)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "inherit"; }}
                  onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  title={isMaximized ? "Restore" : "Maximize"}
                >
                  <Square size={14} strokeWidth={2} />
                </button>
                {/* Close */}
                <button
                  type="button"
                  aria-label={`Close ${title}`}
                  className="h-full w-11 sm:w-12 flex items-center justify-center transition-colors cursor-pointer"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#E81123"; e.currentTarget.style.color = "#ffffff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "inherit"; }}
                  onClick={(e) => { e.stopPropagation(); playClickSound(); onClose() }}
                  onPointerDown={(e) => e.stopPropagation()}
                  title="Close"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Window Content Area */}
            <div
              className="flex-1 overflow-y-auto overflow-x-hidden mac-scrollbar relative flex flex-col min-h-0"
              style={{ background: "var(--window-bg)" }}
            >
              {children}
            </div>

            {/* Retro Corner Resize Grip Indicator in Bottom-Right */}
            <div
              className="absolute bottom-1 right-1 pointer-events-none opacity-30 select-none z-10"
              style={{ color: "var(--text-primary)" }}
              aria-hidden="true"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M7 1L1 7M7 4L4 7M7 7L7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

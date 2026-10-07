"use client"

import { useEffect, useId, useRef } from "react"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
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
  const dragControls = useDragControls()
  const dialogRef = useRef<HTMLDivElement>(null)
  const reactId = useId()
  const titleId = `window-title-${windowId ?? reactId}`

  const savedOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    if (!isOpen || !isFocused) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, isFocused, onClose])

  useEffect(() => {
    if (isOpen && isFocused) dialogRef.current?.focus({ preventScroll: true })
  }, [isOpen, isFocused])

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
            left: `calc(50% - min(${width}px, calc(100vw - 32px)) / 2 + ${offsetX}px)`,
            top: `clamp(115px, calc(50% - ${height / 2}px + ${offsetY}px + 30px), calc(100vh - min(${height}px, calc(100vh - 140px)) - 20px))`,
            width: `min(${width}px, calc(100vw - 32px))`,
            zIndex,
            outline: "none",
            pointerEvents: isMinimized ? "none" : "auto",
          }}
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0}
          initial={{ 
            scale: 0.92, 
            opacity: 0, 
            y: (savedOffset.current.y || 0) + 14, 
            x: savedOffset.current.x 
          }}
          animate={{ 
            scale: isMinimized ? 0.92 : 1, 
            opacity: isMinimized ? 0 : 1, 
            x: savedOffset.current.x, 
            y: isMinimized ? (savedOffset.current.y || 0) + 14 : (savedOffset.current.y || 0) 
          }}
          exit={{ 
            scale: 0.92, 
            opacity: 0, 
            y: (savedOffset.current.y || 0) + 14 
          }}
          transition={{ 
            type: "spring", 
            damping: 28, 
            stiffness: 380,
            opacity: { duration: 0.18, ease: "easeInOut" }
          }}
          onPointerDown={onFocus}
          onDragEnd={(_, info) => {
            savedOffset.current = { x: info.offset.x + savedOffset.current.x, y: info.offset.y + savedOffset.current.y }
          }}
        >
          <div
            data-mac-window
            className="retroui-card flex flex-col overflow-hidden"
            style={{
              height: `min(${height}px, calc(100vh - 140px))`,
              transition: "box-shadow 0.2s ease, border-color 0.2s ease",
            }}
          >
            <div
              className="flex-none flex items-center justify-between h-10 px-0 relative select-none cursor-grab active:cursor-grabbing"
              style={{
                background: "var(--titlebar-bg)",
                borderBottom: "1px solid var(--window-border-unfocused)",
              }}
              onPointerDown={(e) => dragControls.start(e)}
            >
              {/* Perfectly centered title with Minecraft font */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h2
                  id={titleId}
                  className="font-minecraft text-[13px] uppercase tracking-[0.14em] m-0 font-bold select-none"
                  style={{
                    color: isFocused ? "var(--text-primary)" : "var(--text-muted)",
                    transition: "color 0.2s",
                  }}
                >
                  {title}
                </h2>
              </div>

              <div className="ml-auto flex items-center h-full relative z-10" style={{ color: "var(--text-secondary)" }}>
                <button
                  type="button"
                  aria-hidden="true"
                  className="h-full w-11 sm:w-12 flex items-center justify-center transition-colors cursor-pointer"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-subtle)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "inherit"; }}
                  onClick={(e) => { e.stopPropagation(); playClickSound(); onMinimize?.(); }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <Minus size={17} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  aria-hidden="true"
                  className="h-full w-11 sm:w-12 flex items-center justify-center transition-colors cursor-pointer"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-subtle)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "inherit"; }}
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <Square size={14} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  aria-label={`Close ${title}`}
                  className="h-full w-11 sm:w-12 flex items-center justify-center transition-colors cursor-pointer"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#E81123"; e.currentTarget.style.color = "#ffffff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "inherit"; }}
                  onClick={(e) => { e.stopPropagation(); playClickSound(); onClose() }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto overflow-x-hidden mac-scrollbar"
              style={{ background: "var(--window-bg)" }}
            >
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

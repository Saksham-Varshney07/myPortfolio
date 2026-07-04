"use client"

import { useEffect, useId, useRef } from "react"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import { Minus, Square, X } from "lucide-react"

interface MacWindowProps {
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


export default function MacWindow({
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
}: MacWindowProps) {
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
            top: `clamp(80px, calc(50% - ${height / 2}px + ${offsetY}px - 16px), calc(100vh - min(${height}px, calc(100vh - 72px)) - 40px))`,
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
          initial={{ scale: 0.94, opacity: 0, y: 8, x: savedOffset.current.x, ...(savedOffset.current.y ? { y: savedOffset.current.y } : {}) }}
          animate={{ 
            scale: isMinimized ? 0.4 : 1, 
            opacity: isMinimized ? 0 : 1, 
            x: savedOffset.current.x, 
            y: isMinimized ? (savedOffset.current.y || 0) + 200 : savedOffset.current.y 
          }}
          exit={{ scale: 0.94, opacity: 0, y: (savedOffset.current.y || 0) + 8, transition: { duration: 0.12 } }}
          transition={{ 
            type: "spring", damping: 32, stiffness: 420,
            opacity: { duration: 0.15, ease: "easeOut" }
          }}
          onPointerDown={onFocus}
          onDragEnd={(_, info) => {
            savedOffset.current = { x: info.offset.x + savedOffset.current.x, y: info.offset.y + savedOffset.current.y }
          }}
        >
          <div
            data-mac-window
            className="flex flex-col overflow-hidden"
            style={{
              height: `min(${height}px, calc(100vh - 72px))`,
              borderRadius: 8,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              filter: isFocused ? "none" : "blur(1.5px)",
              border: isFocused
                ? "1px solid var(--window-border-focused)"
                : "1px solid var(--window-border-unfocused)",
              boxShadow: isFocused
                ? "0 40px 80px rgba(0,0,0,0.9), 0 0 0 0.5px rgba(0,0,0,1)"
                : "0 16px 40px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(0,0,0,1)",
              transition: "box-shadow 0.2s ease, border-color 0.2s ease, filter 0s",
            }}
          >
            <div
              className="flex-none flex items-center h-9 pl-3 relative select-none cursor-grab active:cursor-grabbing"
              style={{
                background: "var(--titlebar-bg)",
                borderBottom: "1px solid var(--window-border-unfocused)",
              }}
              onPointerDown={(e) => dragControls.start(e)}
            >
              <h2
                id={titleId}
                className="absolute left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.1em] pointer-events-none m-0 font-normal"
                style={{
                  color: isFocused ? "var(--text-secondary)" : "var(--text-faint)",
                  transition: "color 0.2s",
                }}
              >
                {title}
              </h2>

              <div className="ml-auto flex items-center h-full z-10" style={{ color: "var(--text-secondary)" }}>
                <button
                  type="button"
                  aria-hidden="true"
                  className="h-full px-3.5 flex items-center justify-center transition-colors"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--window-border-focused)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "inherit"; }}
                  onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <Minus size={15} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  aria-hidden="true"
                  className="h-full px-3.5 flex items-center justify-center transition-colors"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--window-border-focused)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "inherit"; }}
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <Square size={13} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  aria-label={`Close ${title}`}
                  className="h-full px-3.5 flex items-center justify-center transition-colors"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#E81123"; e.currentTarget.style.color = "#ffffff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "inherit"; }}
                  onClick={(e) => { e.stopPropagation(); onClose() }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <X size={16} strokeWidth={1.5} />
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

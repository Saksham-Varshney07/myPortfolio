"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface MenuItem {
  label: string
  shortcut?: string
  onClick: () => void
  dividerAfter?: boolean
}

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  items: MenuItem[]
}

export function ContextMenu({ x, y, onClose, items }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const down = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("mousedown", down)
    document.addEventListener("keydown", key)
    return () => {
      document.removeEventListener("mousedown", down)
      document.removeEventListener("keydown", key)
    }
  }, [onClose])

  const menuWidth = 220
  const menuHeight = items.length * 32 + 16
  const cx = Math.min(x, window.innerWidth - menuWidth - 8)
  const cy = Math.min(y, window.innerHeight - menuHeight - 8)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -4 }}
      transition={{ duration: 0.1 }}
      className="fixed z-[500] py-1"
      style={{
        left: cx,
        top: cy,
        width: menuWidth,
        background: "var(--tooltip-bg)",
        border: "1px solid var(--widget-border)",
        borderRadius: 8,
        boxShadow: "0 16px 48px rgba(0,0,0,0.8)",
      }}
    >
      {items.map((item, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-subtle)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            onClick={() => { item.onClick(); onClose() }}
          >
            <span className="text-[12px]">{item.label}</span>
            {item.shortcut && (
              <span className="font-mono text-[10px]" style={{ color: "var(--text-faint)" }}>
                {item.shortcut}
              </span>
            )}
          </button>
          {item.dividerAfter && (
            <div className="my-1 mx-2" style={{ height: 1, background: "var(--separator)" }} />
          )}
        </div>
      ))}
    </motion.div>
  )
}

export type { MenuItem }

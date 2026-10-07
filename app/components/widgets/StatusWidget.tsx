"use client"

import { motion, useDragControls } from "framer-motion"
import { Send } from "lucide-react"
import { status } from "@/config/status"

import { useWidgetResize } from "./useWidgetResize"
import WidgetResizeHandles from "./WidgetResizeHandles"

const STATUS = { available: status.available, label: status.label }

export default function StatusWidget({ onContactClick }: { onContactClick?: () => void }) {
  const dragControls = useDragControls()
  const { width, height, handleResizeStart } = useWidgetResize({
    initialWidth: 232,
    initialHeight: 145,
    minWidth: 195,
    minHeight: 115,
    maxWidth: 450,
    maxHeight: 350,
  })

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      className="relative select-none group"
      style={{ zIndex: 5, width, height }}
    >
      <WidgetResizeHandles onResizeStart={handleResizeStart} />
      {/* Main Card Frame with Rotating Chipped Border */}
      <div
        className="relative w-full h-full rounded-[6px] overflow-hidden"
        style={{
          boxShadow: "2px 2px 0 0px var(--card-custom-shadow, var(--shadow-card, #000000))",
        }}
      >

        {/* Rotating border line with a chipped (missing) segment */}
        <div className="absolute inset-0 rounded-[6px] overflow-hidden pointer-events-none z-0">
          <div 
            className="absolute inset-[-150%] animate-[spin_4s_linear_infinite]"
            style={{
              background: "conic-gradient(from 0deg, var(--status-border-color, var(--border-card, #000000)) 0deg, var(--status-border-color, var(--border-card, #000000)) 250deg, transparent 250deg, transparent 360deg)",
            }}
          />
        </div>

        {/* Solid inner background masking out the center to reveal a crisp 2.5px rotating border */}
        <div 
          className="absolute inset-[2.5px] rounded-[4px] z-10 flex flex-col overflow-hidden" 
          style={{ background: "var(--card-custom-bg, var(--bg-card, #ffffff))" }} 
        >
          {/* Drag Handle */}
          <div 
            className="flex-none flex items-center justify-center cursor-grab active:cursor-grabbing select-none" 
            onPointerDown={(e) => dragControls.start(e)}
            style={{ 
              border: "none",
              borderBottom: "1px solid var(--separator)", 
              background: "var(--drag-handle-bg, transparent)", 
              height: 22 
            }}
          >
            <div style={{ width: 24, height: 2, borderRadius: 1, background: "var(--text-faint)" }} />
          </div>

        <div 
          className="flex-1 min-h-0 flex flex-col justify-between overflow-y-auto mac-scrollbar px-4 pb-3 pt-1"
          style={{ border: "none", background: "transparent" }}
        >
          <div
            className="flex items-center justify-between pb-2 mb-2 flex-none"
            style={{ borderBottom: "1px solid var(--separator)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full flex-none animate-pulse"
                style={{ 
                  background: STATUS.available ? "#4ade80" : "var(--text-faint)", 
                  boxShadow: STATUS.available ? "0 0 8px #4ade80" : "none" 
                }}
              />
              <span
                className="font-mono text-[10px] uppercase tracking-[0.1em] font-semibold"
                style={{ color: STATUS.available ? "var(--text-primary)" : "var(--text-secondary)" }}
              >
                {STATUS.label}
              </span>
            </div>

            {onContactClick && (
              <button 
                onClick={(e) => { e.stopPropagation(); onContactClick(); }}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer focus:outline-none"
                title="Send Message"
              >
                <Send size={12} />
              </button>
            )}
          </div>

          <p className="text-[11px] leading-relaxed break-words" style={{ color: "var(--text-secondary)" }}>
            Actively looking for internships and full-time roles in <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Software Development</span> and <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>AI/ML</span>.
          </p>
        </div>
      </div>
      </div>
    </motion.div>
  )
}

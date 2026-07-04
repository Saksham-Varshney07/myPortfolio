"use client"

import { motion, useDragControls } from "framer-motion"
import { Send } from "lucide-react"
import { status } from "@/config/status"

const STATUS = { available: status.available, label: status.label }

export default function StatusWidget({ onContactClick }: { onContactClick?: () => void }) {
  const dragControls = useDragControls()

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      className="relative select-none group"
      style={{ zIndex: 5, width: 232 }}
    >
      {/* Siri-style animated neon glow (outer blur) */}
      <div className="absolute -inset-[2px] rounded-[10px] z-0 pointer-events-none blur-[10px] opacity-75 overflow-hidden">
        <div 
          className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
          style={{
            background: "conic-gradient(from 0deg, transparent 0%, rgba(255,42,133,1) 20%, rgba(138,43,226,1) 40%, rgba(65,105,225,1) 60%, rgba(0,255,255,1) 80%, transparent 100%)"
          }}
        />
      </div>

      {/* Siri-style animated neon edge (sharp border) */}
      <div className="absolute -inset-[1.5px] rounded-[9px] z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
          style={{
            background: "conic-gradient(from 0deg, transparent 0%, rgba(255,42,133,1) 20%, rgba(138,43,226,1) 40%, rgba(65,105,225,1) 60%, rgba(0,255,255,1) 80%, transparent 100%)"
          }}
        />
      </div>

      {/* Solid mask to hide the spinning gradient from the center of the widget */}
      <div 
        className="absolute inset-0 rounded-[8px] z-0 pointer-events-none" 
        style={{ background: "var(--menubar-bg)" }} 
      />

      {/* Actual Content Layers */}
      <div className="relative z-10 flex flex-col h-full rounded-[8px] overflow-hidden">
        <div 
          className="widget-handle" 
          onPointerDown={(e) => dragControls.start(e)}
          style={{ border: "none", background: "transparent" }}
        >
          <div style={{ width: 24, height: 2, borderRadius: 1, background: "var(--text-faint)" }} />
        </div>

        <div 
          className="widget-body px-4 pb-4 pt-1"
          style={{ border: "none", background: "transparent" }}
        >
          <div
            className="flex items-center justify-between pb-2.5 mb-3"
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

          <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Actively looking for internships and full-time roles in <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Software Development</span> and <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>AI/ML</span>.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

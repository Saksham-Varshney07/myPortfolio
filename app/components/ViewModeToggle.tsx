"use client"

import { motion } from "framer-motion"
import { Monitor, Sparkles } from "lucide-react"

interface ViewModeToggleProps {
  currentMode: "desktop" | "plain"
  onModeChange: (mode: "desktop" | "plain") => void
  className?: string
  compact?: boolean
}

export default function ViewModeToggle({
  currentMode,
  onModeChange,
  className = "",
  compact = false,
}: ViewModeToggleProps) {
  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      {/* Ambient background glow behind active pill (inspired by perryw-2023.webflow.io) */}
      <div
        className="absolute -inset-1 rounded-full opacity-40 blur-md pointer-events-none transition-all duration-500"
        style={{
          background:
            currentMode === "plain"
              ? "radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, rgba(168, 85, 247, 0.2) 60%, transparent 100%)"
              : "radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 70%, transparent 100%)",
        }}
      />

      {/* Pill Outer Container */}
      <div
        className="relative flex items-center p-1 rounded-full backdrop-blur-xl transition-all duration-300"
        style={{
          background: "var(--dock-bg, rgba(18, 18, 20, 0.75))",
          border: "1px solid var(--window-border-unfocused, rgba(255, 255, 255, 0.15))",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Desktop UI Option */}
        <button
          type="button"
          onClick={() => onModeChange("desktop")}
          className={`relative z-10 flex items-center gap-1.5 rounded-full font-mono transition-colors duration-200 cursor-pointer ${
            compact ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-1.5 text-[11px]"
          }`}
          style={{
            color: currentMode === "desktop" ? "var(--text-primary, #ffffff)" : "var(--text-muted, rgba(255, 255, 255, 0.55))",
          }}
          aria-label="Switch to Retro Desktop Window UI"
        >
          {currentMode === "desktop" && (
            <motion.div
              layoutId="view-toggle-indicator"
              className="absolute inset-0 rounded-full"
              style={{
                background: "var(--item-separator, rgba(255, 255, 255, 0.15))",
                border: "1px solid var(--window-border-focused, rgba(255, 255, 255, 0.3))",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              }}
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Monitor size={compact ? 11 : 13} />
            <span className="tracking-wide uppercase font-semibold">Desktop OS</span>
          </span>
        </button>

        {/* Plain View Option */}
        <button
          type="button"
          onClick={() => onModeChange("plain")}
          className={`relative z-10 flex items-center gap-1.5 rounded-full font-mono transition-colors duration-200 cursor-pointer ${
            compact ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-1.5 text-[11px]"
          }`}
          style={{
            color: currentMode === "plain" ? "var(--text-primary, #ffffff)" : "var(--text-muted, rgba(255, 255, 255, 0.55))",
          }}
          aria-label="Switch to Single-Page Plain View"
        >
          {currentMode === "plain" && (
            <motion.div
              layoutId="view-toggle-indicator"
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(168, 85, 247, 0.35) 100%)",
                border: "1px solid rgba(168, 85, 247, 0.6)",
                boxShadow: "0 2px 10px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
              }}
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Sparkles size={compact ? 11 : 13} className="text-indigo-400" />
            <span className="tracking-wide uppercase font-semibold">Plain View</span>
          </span>
        </button>
      </div>
    </div>
  )
}

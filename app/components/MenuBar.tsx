"use client"

import { useState, useEffect } from "react"
import { Eye, CalendarDays, Clock, Monitor, FileText } from "lucide-react"
import { siteConfig } from "@/config/siteConfig"

interface MenuBarProps {
  focusedApp: string | null
  onModeChange?: (mode: "desktop" | "plain") => void
}

export default function MenuBar({
  focusedApp,
  onModeChange,
}: MenuBarProps) {
  const [timeStr, setTimeStr] = useState("")
  const [dateStr, setDateStr] = useState("")
  const [visits, setVisits] = useState<number | null>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTimeStr(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }))
      setDateStr(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }))
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetch("/api/views")
      .then((r) => r.json())
      .then((d) => { if (d.count !== null) setVisits(d.count) })
      .catch(() => {})
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 h-7 z-[100] flex items-center justify-between px-3 sm:px-4 select-none"
      style={{
        background: "var(--menubar-bg)",
        borderBottom: "var(--menubar-border-bottom, 1px solid var(--window-border-unfocused))",
      }}
    >
      {/* Left: Brand & Focused App */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-widest cursor-pointer" style={{ color: "var(--text-primary)" }}>
          {siteConfig.personal.fullName}
        </span>
        <span style={{ color: "var(--separator)", fontSize: 10 }}>|</span>
        <span className="hidden xs:flex items-center gap-1.5 font-mono text-[11px] tracking-wide" style={{ color: "var(--text-muted)" }}>
          {focusedApp ? null : <Monitor size={11} />}
          {focusedApp ?? "Desktop"}
        </span>
      </div>

      {/* Right: Page Icon (Plain View Trigger) + System Status */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 font-mono text-[11px]">
        {onModeChange && (
          <button
            type="button"
            onClick={() => onModeChange("plain")}
            className="group relative flex items-center justify-center w-6 h-6 rounded transition-all cursor-pointer hover:bg-white/10 active:scale-95"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Switch to Plain View"
          >
            <FileText size={13} className="group-hover:text-[var(--text-primary)] transition-colors" />
            <span className="custom-tooltip custom-tooltip-end absolute -bottom-7 px-2 py-0.5 text-[9.5px] font-minecraft rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Plain View
            </span>
          </button>
        )}

        {visits !== null && (
          <span className="hidden md:flex items-center gap-1.5" style={{ color: "var(--text-faint)" }}>
            <Eye size={11} /> {visits.toLocaleString()}
          </span>
        )}
        <span className="hidden sm:flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
          <CalendarDays size={11} /> {dateStr}
        </span>
        <span className="flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
          <Clock size={11} /> {timeStr}
        </span>
      </div>
    </div>
  )
}

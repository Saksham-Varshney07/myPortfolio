"use client"

import { useEffect, useState } from "react"
import { Github } from "lucide-react"
import { motion, useDragControls } from "framer-motion"
import { siteConfig } from "@/config/siteConfig"
import TetrisGame from "./TetrisGame"
import { useWidgetResize } from "./widgets/useWidgetResize"
import WidgetResizeHandles from "./widgets/WidgetResizeHandles"

export const LEVEL_COLORS = [
  "var(--heatmap-empty)",
  "rgba(0,200,100,0.25)",
  "rgba(0,200,100,0.45)",
  "rgba(0,200,100,0.70)",
  "rgba(0,200,100,0.95)",
]
export interface Contribution {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

// ─── UI Sizing Config ──────────────────────────────────────────────────────────
// Easily adjust dimensions, grid size, and weeks shown for the GitHub widget:
export const HEATMAP_CONFIG = {
  widgetWidth: 440,                  // Card width in pixels (increase to e.g. 450 or 480)
  widgetHeight: 200,                 // Default card height in pixels (ample room for all 7 rows + labels + padding)
  cell: 10,                          // Size of each contribution day square (e.g. 10, 11, 12)
  gap: 3,                            // Spacing between squares in pixels
  weeksCount: 29,                    // Number of weeks shown horizontally (e.g. 29, 32, 35)
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function GitHubHeatmap() {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loaded, setLoaded] = useState(false)
  const [isTetrisMode, setIsTetrisMode] = useState(false)
  const dragControls = useDragControls()

  const { width, height, handleResizeStart } = useWidgetResize({
    initialWidth: HEATMAP_CONFIG.widgetWidth,
    initialHeight: HEATMAP_CONFIG.widgetHeight,
    minWidth: 260,
    minHeight: 135,
    maxWidth: 700,
    maxHeight: 600,
  })

  useEffect(() => {
    // 1. Immediately hydrate from localStorage for instantaneous 0ms display
    try {
      const cached = localStorage.getItem("portfolio-gh-contributions")
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed.contributions) && parsed.contributions.length > 0) {
          setContributions(parsed.contributions)
          setTotal(parsed.total ?? 0)
          setLoaded(true)
        }
      }
    } catch {}

    // 2. Fetch fresh data from API
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.contributions) && d.contributions.length > 0) {
          setContributions(d.contributions)
          const sum = Object.values(d.total as Record<string, number>).reduce(
            (a: number, b) => a + (b as number), 0
          )
          const totalVal = sum as number
          setTotal(totalVal)
          try {
            localStorage.setItem(
              "portfolio-gh-contributions",
              JSON.stringify({ contributions: d.contributions, total: totalVal })
            )
          } catch {}
        }
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const weeks: (Contribution | null)[][] = []
  if (contributions.length > 0) {
    const sorted = [...contributions].sort((a, b) => a.date.localeCompare(b.date))
    const firstDate = new Date(sorted[0].date)
    const dayOfWeek = firstDate.getDay()
    const startDate = new Date(firstDate)
    startDate.setDate(startDate.getDate() - dayOfWeek)

    const byDate = new Map(sorted.map((c) => [c.date, c]))
    const current = new Date(startDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    while (current <= today) {
      const week: (Contribution | null)[] = []
      for (let d = 0; d < 7; d++) {
        const dateStr = current.toISOString().slice(0, 10)
        week.push(current > today ? null : (byDate.get(dateStr) ?? { date: dateStr, count: 0, level: 0 }))
        current.setDate(current.getDate() + 1)
      }
      weeks.push(week)
    }
  }

  const displayWeeks = weeks.slice(-HEATMAP_CONFIG.weeksCount)

  let monthPositions: { label: string; col: number }[] = []
  if (displayWeeks.length > 0) {
    let lastMonth = -1
    displayWeeks.forEach((week, col) => {
      const firstValid = week.find((d) => d !== null)
      if (firstValid) {
        const month = new Date(firstValid.date).getMonth()
        if (month !== lastMonth) {
          monthPositions.push({ label: MONTH_LABELS[month], col })
          lastMonth = month
        }
      }
    })

    const filteredPositions = []
    let nextCol = 10000
    for (let i = monthPositions.length - 1; i >= 0; i--) {
      if (nextCol - monthPositions[i].col >= 3) {
        filteredPositions.unshift(monthPositions[i])
        nextCol = monthPositions[i].col
      }
    }
    monthPositions = filteredPositions
  }

  const CELL = HEATMAP_CONFIG.cell
  const GAP = HEATMAP_CONFIG.gap
  const colWidth = CELL + GAP



  if (!loaded) return null

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative select-none"
      style={{
        width,
        height: isTetrisMode ? (height && height > 360 ? height : 440) : height,
        ...(isTetrisMode ? { marginRight: 351, marginTop: -255, zIndex: 5 } : { marginRight: 0, zIndex: 5 }),
      }}
    >
      <WidgetResizeHandles onResizeStart={handleResizeStart} />
      <div className="retroui-card overflow-hidden flex flex-col h-full w-full">
        <div
          className="flex-none flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          style={{ height: 22, background: "var(--drag-handle-bg)", borderBottom: "1px solid var(--separator)" }}
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div style={{ width: 24, height: 2, borderRadius: 1, background: "var(--text-faint)" }} />
        </div>

        <div className="flex-1 min-h-0 px-3.5 pt-2.5 pb-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex flex-wrap items-center justify-between mb-2 gap-2 flex-none min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Github size={11} style={{ color: "var(--text-muted)" }} />
                <span className="text-[10px] font-medium" style={{ color: "var(--text-secondary)" }}>
                  {siteConfig.social.githubUsername}
                </span>
              </div>
              {isTetrisMode ? (
                <button
                  onClick={() => setIsTetrisMode(false)}
                  className="text-[9px] px-2 py-0.5 rounded-sm font-mono transition-colors cursor-pointer"
                  style={{ background: "rgba(255,100,100,0.1)", color: "rgba(255,100,100,0.8)", border: "1px solid rgba(255,100,100,0.2)" }}
                >
                  Exit Game
                </button>
              ) : (
                <button
                  onClick={() => setIsTetrisMode(true)}
                  className="text-[9px] px-2 py-0.5 rounded-sm font-mono transition-colors hover:opacity-80 cursor-pointer"
                  style={{ background: "var(--accent-subtle)", color: "var(--accent)", border: "1px solid var(--accent-subtle)" }}
                >
                  Play Tetris
                </button>
              )}
            </div>
            {!isTetrisMode && total > 0 && (
              <span className="text-[10px] font-mono truncate" style={{ color: "var(--text-muted)" }}>
                {total.toLocaleString()} contributions
              </span>
            )}
          </div>

          {isTetrisMode ? (
            <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
              <TetrisGame />
            </div>
          ) : displayWeeks.length === 0 ? (
            <div className="text-[10px] py-2 font-mono flex items-center justify-center gap-2" style={{ color: "var(--text-muted)" }}>
              <span>Loading contributions...</span>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden mac-scrollbar pb-1">
              <div style={{ width: displayWeeks.length * colWidth }}>
                <div style={{ position: "relative", height: 14, marginBottom: 2, width: displayWeeks.length * colWidth }}>
                  {monthPositions.map(({ label, col }) => (
                    <span
                      key={`${label}-${col}`}
                      style={{
                        position: "absolute",
                        left: col * colWidth,
                        fontSize: 9,
                        color: "var(--text-muted)",
                        lineHeight: "14px",
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: GAP }}>
                  {displayWeeks.map((week, wi) => (
                    <div key={wi} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                      {week.map((day, di) => (
                        <div
                          key={di}
                          title={day ? `${day.date}: ${day.count} contributions` : ""}
                          style={{
                            width: CELL,
                            height: CELL,
                            borderRadius: 2,
                            background: day ? LEVEL_COLORS[day.level] : "transparent",
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

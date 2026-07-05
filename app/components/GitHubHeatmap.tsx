"use client"

import { useEffect, useState } from "react"
import { Github } from "lucide-react"
import { motion, useDragControls } from "framer-motion"
import { siteConfig } from "@/config/siteConfig"
import TetrisGame from "./TetrisGame"

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



const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

export default function GitHubHeatmap() {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loaded, setLoaded] = useState(false)
  const [isTetrisMode, setIsTetrisMode] = useState(false)
  const dragControls = useDragControls()

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => {
        setContributions(d.contributions ?? [])
        const sum = Object.values(d.total as Record<string, number>).reduce(
          (a: number, b) => a + (b as number), 0
        )
        setTotal(sum as number)
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

  const displayWeeks = weeks.slice(-29)

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

  const CELL = 10
  const GAP = 3
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
      style={
        isTetrisMode 
          ? { width: 409, marginRight: 351, marginTop: -255, zIndex: 5 } 
          : { width: 409, marginRight: 0, zIndex: 5 } 
      }
    >
      <div className="widget-handle" onPointerDown={(e) => dragControls.start(e)}>
        <div style={{ width: 24, height: 2, borderRadius: 1, background: "var(--text-faint)" }} />
      </div>

      <div className="widget-body px-4 pt-3 pb-3">
        <div className="flex flex-wrap items-center justify-between mb-2.5 gap-2">
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
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              {total.toLocaleString()} contributions this year
            </span>
          )}
        </div>

        {isTetrisMode ? (
          <TetrisGame />
        ) : displayWeeks.length === 0 ? (
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>No data</div>
        ) : (
          <div>
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
        )}
      </div>
    </motion.div>
  )
}

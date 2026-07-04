"use client"

import { useMemo } from "react"
import { motion, useDragControls } from "framer-motion"

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]

export default function CalendarWidget() {
  const dragControls = useDragControls()

  const { year, today, cells, monthName } = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const today = now.getDate()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDow = new Date(year, month, 1).getDay()
    const cells = [
      ...Array(firstDow).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]
    const monthName = now.toLocaleDateString("en-US", { month: "long" })
    return { year, today, cells, monthName }
  }, [])

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      className="relative select-none"
      style={{ zIndex: 5, width: 200 }}
    >
      <div className="widget-handle" onPointerDown={(e) => dragControls.start(e)}>
        <div style={{ width: 24, height: 2, borderRadius: 1, background: "var(--text-faint)" }} />
      </div>

      <div className="widget-body px-3 pt-3 pb-3">
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
            {monthName}
          </p>
          <p className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
            {year}
          </p>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map((d, i) => (
            <div
              key={i}
              className="text-center font-mono text-[9px] py-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((day, i) => (
            <div
              key={i}
              className="flex items-center justify-center font-mono text-[10px]"
              style={{
                height: 22,
                borderRadius: 4,
                background: day === today ? "var(--accent-subtle)" : "transparent",
                color: day === today
                  ? "var(--text-primary)"
                  : day
                  ? "var(--text-secondary)"
                  : "transparent",
                fontWeight: day === today ? 600 : 400,
                outline: day === today ? "1px solid var(--accent)" : "none",
                outlineOffset: -1,
              }}
            >
              {day ?? ""}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

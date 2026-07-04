"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ExperienceModal from "../modals/ExperienceModal"
import { experience as experienceData, type ExperienceItem } from "@/config/experience"

export interface Experience extends ExperienceItem {
  icon: React.ReactNode
  links?: { type: string; url: string; icon: React.ReactNode; label: string }[]
}

const experiences: Experience[] = experienceData.map((e) => ({
  ...e,
  icon: null,
  links: e.links?.map((l) => ({ ...l, icon: null })),
}))

export default function Experience({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<Experience | null>(null)

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={compact ? "px-6 py-6" : "py-20 px-6"}
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.14em] mb-5 text-[var(--text-muted)]"
        >
          Experience
        </p>

        <div>
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              layoutId={`exp-${exp.company}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-pointer py-4"
              style={{
                borderTop: i === 0 ? "1px solid var(--separator)" : undefined,
                borderBottom: "1px solid var(--separator)",
              }}
              onClick={() => setSelected(exp)}
            >
              <div className="flex items-baseline justify-between gap-4 mb-1.5">
                <div className="flex items-baseline gap-2 min-w-0">
                  <span className="text-[14px] font-semibold text-[var(--text-primary)] group-hover:opacity-80 transition-opacity truncate">
                    {exp.company}
                  </span>
                  <span className="font-mono text-[10px] truncate text-[var(--text-muted)]">
                    {exp.role}
                  </span>
                </div>
                <div className="flex items-center justify-end font-mono text-[10px] flex-none">
                  <span className="text-[var(--text-muted)] group-hover:hidden block">
                    {exp.period}
                  </span>
                  <span className="hidden group-hover:flex items-center gap-1.5 text-[var(--indicator-color)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--indicator-color)] animate-pulse" />
                    click to read more !
                  </span>
                </div>
              </div>

              <p className="text-[12px] mb-2" style={{ color: "var(--text-secondary)" }}>
                {exp.description}
              </p>

              <p className="font-mono text-[10px] text-[var(--text-muted)]">
                {exp.tech.join(" · ")}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <ExperienceModal
        experience={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  )
}

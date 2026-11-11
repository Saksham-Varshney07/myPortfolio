"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Lock, MapPin, ShieldAlert } from "lucide-react"
import ExperienceModal from "../modals/ExperienceModal"
import { experience as experienceData, type ExperienceItem } from "@/config/experience"
import { formatRevealingLabel, useRevealCountdown } from "@/lib/countdown"

export interface Experience extends ExperienceItem {
  icon: React.ReactNode
  links?: { type: string; url: string; icon: React.ReactNode; label: string }[]
}

export function getExperienceLayoutId(exp: Pick<ExperienceItem, "company" | "redacted">) {
  return `exp-${exp.redacted?.id ?? exp.company}`
}

const experiences: Experience[] = experienceData.map((e) => ({
  ...e,
  icon: null,
  links: e.links?.map((l) => ({ ...l, icon: null })),
}))

const CIPHER_GLYPHS = "#X9_K2!M7$0@%&*"
const DECRYPTION_SEGMENTS = 12

function RedactedExperienceCard({
  exp,
  index,
  isElevated,
  onSelect,
}: {
  exp: Experience
  index: number
  isElevated: boolean
  onSelect: () => void
}) {
  const redacted = exp.redacted!
  const countdown = useRevealCountdown(redacted.revealDate, redacted.cycleStartDate)
  const [cipherLabel, setCipherLabel] = useState(redacted.maskedCompany)
  const scrambleTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (scrambleTimer.current) clearInterval(scrambleTimer.current)
    }
  }, [])

  const triggerScramble = (targetText: string) => {
    if (scrambleTimer.current) clearInterval(scrambleTimer.current)
    let tick = 0
    const totalTicks = 7
    scrambleTimer.current = setInterval(() => {
      tick += 1
      if (tick >= totalTicks) {
        if (scrambleTimer.current) clearInterval(scrambleTimer.current)
        setCipherLabel(targetText)
        return
      }
      const next = Array.from({ length: targetText.length }, () =>
        CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)]
      ).join("")
      setCipherLabel(next)
    }, 35)
  }

  const litSegments = countdown
    ? Math.max(1, Math.round(countdown.progress * DECRYPTION_SEGMENTS))
    : 2

  return (
    <motion.div
      layoutId={getExperienceLayoutId(exp)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.18, delay: index * 0.06 },
        y: { duration: 0.18, delay: index * 0.06 },
        layout: { type: "spring", stiffness: 520, damping: 38, mass: 0.7 },
      }}
      onClick={onSelect}
      onMouseEnter={() => triggerScramble("[NDA_ENCRYPTED]")}
      onMouseLeave={() => triggerScramble(redacted.maskedCompany)}
      className="group relative cursor-pointer overflow-hidden"
      style={{
        background: "var(--window-bg)",
        border: "1.5px solid var(--widget-border)",
        borderRadius: 0,
        boxShadow: "var(--btn-shadow, 2px 2px 0px var(--widget-border))",
        zIndex: isElevated ? 30 : 1,
      }}
    >
      {/* Subtle diagonal classified texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, var(--text-primary) 0 1px, transparent 1px 10px)",
        }}
      />

      {/* OS Encrypted Header Strip */}
      <div
        className="relative flex items-center justify-between gap-2 px-3.5 py-1.5"
        style={{
          background: "var(--drag-handle-bg, var(--item-separator))",
          borderBottom: "1px dashed var(--separator)",
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Lock size={10} className="flex-none" style={{ color: "var(--accent)" }} />
          <span
            className="font-mono text-[9.5px] uppercase tracking-[0.1em] truncate"
            style={{ color: "var(--text-secondary)" }}
          >
            {redacted.id} {"//"} {redacted.codename}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-none">
          <span
            className="hidden sm:inline-flex items-center gap-1 font-mono text-[8.5px] uppercase tracking-[0.12em] px-1.5 py-0.5"
            style={{
              color: "var(--text-muted)",
              border: "1px solid var(--separator)",
              background: "var(--item-separator)",
            }}
          >
            <ShieldAlert size={8} />
            CLASSIFIED
          </span>
          <span className="font-mono text-[9.5px] whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
            {exp.period}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative p-3.5 flex items-start gap-3.5">
        {/* Retro Mystery / Lock Emblem */}
        <div
          className="w-11 h-11 flex-none flex items-center justify-center transition-colors"
          style={{
            background: "var(--accent-subtle)",
            border: "1.5px solid var(--accent)",
            boxShadow: "2px 2px 0px var(--shadow-card, var(--widget-border))",
            color: "var(--text-primary)",
          }}
        >
          <span className="font-press-start text-[14px] leading-none group-hover:hidden select-none">
            ?
          </span>
          <Lock size={15} className="hidden group-hover:block" />
        </div>

        {/* Role & Encrypted Company Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
                {exp.role}
              </span>
              <span
                className="font-mono text-[10px] tracking-[0.06em] px-1.5 py-0.5 select-none"
                style={{
                  background: "var(--item-separator)",
                  border: "1px solid var(--separator)",
                  color: "var(--text-muted)",
                }}
              >
                {cipherLabel}
              </span>
            </div>

            <span
              className="inline-flex items-center gap-1 font-mono text-[10px] whitespace-nowrap"
              style={{ color: "var(--text-secondary)" }}
            >
              <MapPin size={9} />
              {redacted.location} · {redacted.duration}
            </span>
          </div>

          <p className="text-[11.5px] leading-relaxed mt-1.5" style={{ color: "var(--text-secondary)" }}>
            {exp.description}
          </p>

          {/* Segmented Decryption Bar + Live Countdown */}
          <div
            className="mt-3 pt-2.5 flex flex-wrap items-center justify-between gap-2"
            style={{ borderTop: "1px dashed var(--separator)" }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center gap-[2px]" aria-hidden="true">
                {Array.from({ length: DECRYPTION_SEGMENTS }).map((_, idx) => {
                  const filled = idx < litSegments
                  return (
                    <span
                      key={idx}
                      className="inline-block w-1.5 h-2.5 transition-colors"
                      style={{
                        background: filled ? "var(--accent)" : "var(--item-separator)",
                        border: `1px solid ${filled ? "var(--accent)" : "var(--separator)"}`,
                      }}
                    />
                  )
                })}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--indicator-color)] animate-pulse flex-none" />
                <span
                  className="font-minecraft text-[11px] tracking-wide whitespace-nowrap"
                  style={{ color: "var(--text-primary)" }}
                >
                  {formatRevealingLabel(countdown)}
                </span>
              </div>
            </div>

            <span
              className="font-mono text-[10px] opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity whitespace-nowrap"
              style={{ color: "var(--indicator-color)" }}
            >
              inspect lock →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Experience({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<Experience | null>(null)
  const [elevatedId, setElevatedId] = useState<string | null>(null)
  const clearElevationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (clearElevationTimer.current) clearTimeout(clearElevationTimer.current)
    }
  }, [])

  const handleSelect = (exp: Experience) => {
    if (clearElevationTimer.current) clearTimeout(clearElevationTimer.current)
    if (exp.redacted) {
      setElevatedId(exp.redacted.id)
    } else {
      setElevatedId(null)
    }
    setSelected(exp)
  }

  const handleClose = () => {
    setSelected(null)
    if (elevatedId) {
      if (clearElevationTimer.current) clearTimeout(clearElevationTimer.current)
      clearElevationTimer.current = setTimeout(() => setElevatedId(null), 350)
    }
  }

  const upcomingOffers = experiences.filter((e) => e.redacted)
  const pastExperience = experiences.filter((e) => !e.redacted)

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={compact ? "px-6 py-6" : "py-20 px-6"}
      >
        {/* Encrypted / Upcoming Offers */}
        {upcomingOffers.length > 0 && (
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--indicator-color)] animate-pulse" />
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.14em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Encrypted Queue {"//"} Incoming
                </span>
              </div>
              <span
                className="font-mono text-[9.5px] uppercase tracking-[0.1em]"
                style={{ color: "var(--text-faint)" }}
              >
                {String(upcomingOffers.length).padStart(2, "0")} Locked
              </span>
            </div>

            <div className="space-y-3.5">
              {upcomingOffers.map((exp, i) => (
                <RedactedExperienceCard
                  key={exp.redacted!.id}
                  exp={exp}
                  index={i}
                  isElevated={elevatedId === exp.redacted!.id}
                  onSelect={() => handleSelect(exp)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Verified Experience History */}
        <div>
          {upcomingOffers.length > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color: "var(--text-muted)" }}
              >
                Verified Log {"//"} Past Roles
              </span>
              <span
                className="font-mono text-[9.5px] uppercase tracking-[0.1em]"
                style={{ color: "var(--text-faint)" }}
              >
                {String(pastExperience.length).padStart(2, "0")} Entries
              </span>
            </div>
          )}

          {pastExperience.map((exp, i) => (
            <motion.div
              key={exp.company}
              layoutId={getExperienceLayoutId(exp)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (upcomingOffers.length + i) * 0.05 }}
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
                <div className="flex items-center justify-end gap-3 font-mono text-[10px] flex-none">
                  <span className="text-[var(--text-muted)] whitespace-nowrap">
                    {exp.period}
                  </span>
                  <span className="hidden group-hover:flex items-center gap-1.5 text-[var(--indicator-color)] whitespace-nowrap">
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
        onClose={handleClose}
      />
    </>
  )
}

"use client"

import { useEffect } from "react"
import { ExternalLink, Github, Lock, ShieldAlert, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getExperienceLayoutId, type Experience } from "../sections/Experience"
import { formatRevealingLabel, useRevealCountdown } from "@/lib/countdown"

interface ExperienceModalProps {
  experience: Experience | null
  isOpen: boolean
  onClose: () => void
}

const MODAL_SEGMENTS = 18

function RedactedModalContent({
  experience,
  onClose,
}: {
  experience: Experience
  onClose: () => void
}) {
  const redacted = experience.redacted!
  const countdown = useRevealCountdown(redacted.revealDate, redacted.cycleStartDate, 1000)

  const pad2 = (n: number) => String(n).padStart(2, "0")
  const litSegments = countdown
    ? Math.max(1, Math.round(countdown.progress * MODAL_SEGMENTS))
    : 3

  const timerUnits = [
    { label: "DAYS", value: countdown ? String(countdown.days).padStart(2, "0") : "--" },
    { label: "HRS", value: countdown ? pad2(countdown.hours) : "--" },
    { label: "MIN", value: countdown ? pad2(countdown.minutes) : "--" },
    { label: "SEC", value: countdown ? pad2(countdown.seconds) : "--" },
  ]

  const dossierRows = [
    { label: "Role", value: experience.role },
    { label: "Type", value: redacted.offerType },
    { label: "Location", value: redacted.location },
    { label: "Timeline", value: experience.period },
    { label: "Company", value: `${redacted.maskedCompany} [NDA_SEALED]` },
    { label: "Status", value: redacted.statusNote },
  ]

  return (
    <>
      {/* Header */}
      <div
        className="px-6 pt-5 pb-4 flex-none flex items-start justify-between gap-4"
        style={{
          background: "var(--drag-handle-bg, var(--item-separator))",
          borderBottom: "1px dashed var(--separator)",
        }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] px-2 py-0.5"
              style={{
                background: "var(--accent-subtle)",
                border: "1px solid var(--accent)",
                color: "var(--text-primary)",
              }}
            >
              <Lock size={9} />
              {redacted.id} {"//"} CLASSIFIED
            </span>
            <span className="font-mono text-[9.5px]" style={{ color: "var(--text-muted)" }}>
              {redacted.codename}
            </span>
          </div>

          <h2 className="text-[19px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
            {experience.role}
          </h2>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] mt-1" style={{ color: "var(--text-secondary)" }}>
            [REDACTED] · {redacted.location} · {experience.period}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="p-1.5 transition-colors cursor-pointer flex-none"
          style={{
            color: "var(--text-secondary)",
            border: "1px solid var(--separator)",
            background: "var(--window-bg)",
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="px-6 py-5 overflow-y-auto mac-scrollbar space-y-5">
        {/* Live Decryption Timer Box */}
        <div
          className="p-4 space-y-3"
          style={{
            background: "var(--item-separator)",
            border: "1.5px solid var(--widget-border)",
            boxShadow: "var(--btn-shadow, none)",
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--indicator-color)] animate-pulse" />
              <span className="font-minecraft text-[11px] tracking-wide" style={{ color: "var(--text-primary)" }}>
                {formatRevealingLabel(countdown)}
              </span>
            </div>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
              Target: {countdown?.formattedTargetDate ?? redacted.revealDate}
            </span>
          </div>

          {/* 4-Unit Pixel Timer */}
          <div className="grid grid-cols-4 gap-2">
            {timerUnits.map((unit) => (
              <div
                key={unit.label}
                className="py-2.5 px-2 text-center"
                style={{
                  background: "var(--window-bg)",
                  border: "1px solid var(--widget-border)",
                }}
              >
                <div className="font-press-start text-[14px] sm:text-[16px] leading-none" style={{ color: "var(--text-primary)" }}>
                  {unit.value}
                </div>
                <div className="font-mono text-[8.5px] uppercase tracking-[0.14em] mt-1.5" style={{ color: "var(--text-muted)" }}>
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {/* Segmented Decryption Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1" aria-hidden="true">
              {Array.from({ length: MODAL_SEGMENTS }).map((_, idx) => {
                const filled = idx < litSegments
                return (
                  <span
                    key={idx}
                    className="h-2 flex-1 block"
                    style={{
                      background: filled ? "var(--accent)" : "transparent",
                      border: `1px solid ${filled ? "var(--accent)" : "var(--separator)"}`,
                    }}
                  />
                )
              })}
            </div>
            <div className="flex items-center justify-between font-mono text-[9px]" style={{ color: "var(--text-muted)" }}>
              <span>DECRYPTION_PROGRESS</span>
              <span>{countdown ? `${Math.round(countdown.progress * 100)}%` : "--%"}</span>
            </div>
          </div>
        </div>

        {/* Cleared Offer Metadata */}
        <div>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.12em] mb-2.5 flex items-center gap-1.5"
            style={{ color: "var(--text-muted)" }}
          >
            <ShieldAlert size={11} />
            Cleared Metadata
          </p>
          <div style={{ borderTop: "1px solid var(--separator)" }}>
            {dossierRows.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4 py-2 font-mono text-[11px]"
                style={{ borderBottom: "1px solid var(--separator)" }}
              >
                <span className="uppercase tracking-[0.08em] text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {row.label}
                </span>
                <span className="text-right" style={{ color: "var(--text-primary)" }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal Note */}
        <div
          className="p-3 font-mono text-[10.5px] leading-relaxed"
          style={{
            background: "var(--terminal-bg, var(--window-bg))",
            border: "1px dashed var(--separator)",
            color: "var(--text-secondary)",
          }}
        >
          <div style={{ color: "var(--text-muted)" }}>$ decrypt --node {redacted.codename}</div>
          <div className="mt-1">
            ERR_NDA_LOCKED: organization identity stays sealed until {countdown?.formattedTargetDate ?? redacted.revealDate}.
          </div>
        </div>
      </div>
    </>
  )
}

export default function ExperienceModal({ experience, isOpen, onClose }: ExperienceModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && experience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ perspective: 1000 }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={experience.redacted ? { duration: 0.14 } : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            layoutId={getExperienceLayoutId(experience)}
            transition={
              experience.redacted
                ? { layout: { type: "spring", stiffness: 520, damping: 38, mass: 0.7 } }
                : undefined
            }
            className="relative w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] shadow-2xl"
            style={{
              background: "var(--widget-bg)",
              border: "1.5px solid var(--widget-border)",
              borderRadius: experience.redacted ? 0 : 12,
              boxShadow: experience.redacted
                ? "var(--window-shadow-focused, 4px 4px 0px var(--widget-border))"
                : undefined,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {experience.redacted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.12 } }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className="flex flex-col min-h-0 flex-1 overflow-hidden"
              >
                <RedactedModalContent experience={experience} onClose={onClose} />
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="px-6 pt-6 pb-5 flex-none" style={{ borderBottom: "1px solid var(--separator)" }}>
                  <h2 className="text-[18px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                    {experience.role}
                  </h2>
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--text-secondary)" }}>
                    {experience.company} · {experience.period}
                  </p>
                </div>

                {/* Scrollable Body */}
                <div className="px-6 py-5 overflow-y-auto space-y-6">
                  {/* Tech */}
                  <div>
                    <p
                      className="font-mono text-[10px] uppercase tracking-[0.12em] mb-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Stack
                    </p>
                    <p className="font-mono text-[12px]" style={{ color: "var(--text-secondary)" }}>
                      {experience.tech.join(" · ")}
                    </p>
                  </div>

                  {/* Achievements */}
                  <div>
                    <p
                      className="font-mono text-[10px] uppercase tracking-[0.12em] mb-3"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Key work
                    </p>
                    <ul className="space-y-3">
                      {experience.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span
                            className="font-mono text-[10px] flex-none pt-[3px]"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            {a}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Links */}
                  {experience.links && experience.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {experience.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] px-3 py-1.5 rounded transition-colors"
                          style={{
                            color: "var(--text-secondary)",
                            border: "1px solid var(--widget-border)",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                        >
                          {link.label}
                          {link.type === "github" ? <Github size={9} /> : <ExternalLink size={9} />}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

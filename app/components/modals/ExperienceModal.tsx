"use client"

import { useEffect } from "react"
import { ExternalLink, Github } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Experience } from "../sections/Experience"

interface ExperienceModalProps {
  experience: Experience | null
  isOpen: boolean
  onClose: () => void
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

  return (
    <AnimatePresence>
      {isOpen && experience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ perspective: 1000 }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            layoutId={`exp-${experience.company}`}
            className="relative w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] shadow-2xl"
            style={{
              background: "var(--widget-bg)",
              border: "1px solid var(--widget-border)",
              borderRadius: 12,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-5 flex-none" style={{ borderBottom: "1px solid var(--separator)" }}>
              <h2 className="text-[18px] font-semibold text-white mb-1">
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
                  className="font-mono text-[10px] uppercase tracking-[0.12em] mb-2 text-white/60"
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
                  className="font-mono text-[10px] uppercase tracking-[0.12em] mb-3 text-white/60"
                >
                  Key work
                </p>
                <ul className="space-y-3">
                  {experience.achievements.map((a, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="font-mono text-[10px] flex-none pt-[3px] text-white/60"
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
                      {link.type === 'github' ? <Github size={9} /> : <ExternalLink size={9} />}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

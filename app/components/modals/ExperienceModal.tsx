"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink } from "lucide-react"
import type { Experience } from "../sections/Experience"

interface ExperienceModalProps {
  experience: Experience | null
  isOpen: boolean
  onClose: () => void
}

export default function ExperienceModal({ experience, isOpen, onClose }: ExperienceModalProps) {
  if (!experience) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden"
        style={{
          background: "var(--widget-bg)",
          border: "1px solid var(--widget-border)",
          borderRadius: 8,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid var(--separator)" }}>
          <DialogTitle className="text-[18px] font-semibold text-white mb-1">
            {experience.role}
          </DialogTitle>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--text-secondary)" }}>
            {experience.company} · {experience.period}
          </p>
        </div>

        <div className="px-6 py-5 space-y-5">
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
            <ul className="space-y-2.5">
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
            <div className="flex flex-wrap gap-2 pt-1">
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
                  <ExternalLink size={9} />
                </a>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

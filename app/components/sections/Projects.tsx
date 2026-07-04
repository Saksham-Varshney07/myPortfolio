"use client"

import { createPortal } from "react-dom"

import { useState, useEffect } from "react"
import { ArrowUpRight, Star, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { projects, type ProjectItem } from "@/config/projects"

function ProjectCard({ p, i, onPlayVideo }: { p: ProjectItem; i: number; onPlayVideo: (url: string) => void }) {
  const [isHovered, setIsHovered] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isHovered && p.videoUrl) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
      } else {
        onPlayVideo(p.videoUrl)
        setIsHovered(false)
        setCountdown(5)
      }
    }
    return () => clearTimeout(timer)
  }, [isHovered, countdown, p.videoUrl, onPlayVideo])

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setCountdown(5)
  }

  return (
    <motion.a
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col py-4 relative"
      style={{
        borderTop: i === 0 ? "1px solid var(--separator)" : undefined,
        borderBottom: "1px solid var(--separator)",
      }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-start justify-between gap-4 w-full">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[13px] font-semibold text-[var(--text-primary)] group-hover:opacity-75 transition-opacity">
              {p.title}
            </span>
            {p.stars !== undefined && (
              <span
                className="flex items-center gap-0.5 font-mono text-[10px]"
                style={{ color: "var(--text-faint)" }}
              >
                <Star size={9} className="fill-current" />
                {p.stars}
              </span>
            )}
            {p.status && (
              <span
                className="font-mono text-[9px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded"
                style={{
                  color: "var(--text-muted)",
                  border: "1px solid var(--widget-border)",
                }}
              >
                {p.status}
              </span>
            )}
          </div>
          <p className="text-[12px] leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
            {p.description}
          </p>
          <p className="font-mono text-[10px] text-[var(--text-muted)]">
            {p.tech.join(" · ")}
          </p>
        </div>
        <ArrowUpRight
          size={14}
          className="flex-none mt-0.5 opacity-0 group-hover:opacity-60 transition-opacity"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      <AnimatePresence>
        {isHovered && p.videoUrl && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-[var(--accent)] border-t-transparent animate-spin" />
              <span className="text-[10px] text-[var(--accent)] font-mono">
                loading preview in {countdown}...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.a>
  )
}

function ProjectList({ projects, onPlayVideo }: { projects: ProjectItem[]; onPlayVideo: (url: string) => void }) {
  return (
    <div>
      {projects.map((p, i) => (
        <ProjectCard key={i} p={p} i={i} onPlayVideo={onPlayVideo} />
      ))}
    </div>
  )
}

export default function Projects({ compact = false }: { compact?: boolean }) {
  const { personal: personalProjects } = projects
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  if (activeVideo && typeof document !== "undefined") {
    return (
      <>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={compact ? "px-6 py-6" : "py-20 px-6"}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-5 text-[var(--text-muted)]">
            Projects
          </p>
          <ProjectList projects={personalProjects} onPlayVideo={setActiveVideo} />
        </motion.section>

        {createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-md"
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-8 right-8 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
            <div className="w-full h-full flex items-center justify-center p-8">
              <video
                src={activeVideo}
                autoPlay
                controls
                className="w-full h-full object-contain max-h-[85vh] rounded-xl shadow-2xl"
              />
            </div>
          </motion.div>,
          document.body
        )}
      </>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={compact ? "px-6 py-6" : "py-20 px-6"}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-[0.14em] mb-5 text-[var(--text-muted)]"
      >
        Projects
      </p>

      <ProjectList projects={personalProjects} onPlayVideo={setActiveVideo} />
    </motion.section>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, ChevronDown } from "lucide-react"
import { siteConfig } from "@/config/siteConfig"

export default function Resume({ compact = false }: { compact?: boolean }) {
  const { resumeLink } = siteConfig
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const parent = containerRef.current?.closest(".mac-scrollbar") || containerRef.current?.parentElement
    if (!parent) return

    const handleScroll = () => {
      setHasScrolled(parent.scrollTop > 60)
    }

    parent.addEventListener("scroll", handleScroll, { passive: true })
    return () => parent.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScrollClick = () => {
    const parent = containerRef.current?.closest(".mac-scrollbar") || containerRef.current?.parentElement
    parent?.scrollBy({ top: 320, behavior: "smooth" })
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative flex flex-col ${compact ? "px-5 py-5" : "py-10"}`}
    >
      {/* Header */}
      <div className="flex justify-end mb-4">
        <a
          href={resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[11px] font-minecraft-bold px-4 py-2 rounded-lg transition-colors cursor-pointer hover:opacity-90"
          style={{
            background: "var(--item-separator)",
            border: "1px solid var(--widget-border)",
            color: "var(--text-primary)",
            boxShadow: "var(--btn-shadow, none)",
            borderRadius: "var(--widget-radius, 8px)",
          }}
        >
          <Download size={12} />
          Download PDF
        </a>
      </div>

      <div className="w-full flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/SakshamVarshney.png"
          alt="Resume"
          className="w-full h-auto rounded-lg shadow-sm"
          style={{ border: "1px solid var(--separator)", objectFit: "contain" }}
        />
      </div>

      {/* Floating Animated "Scroll to see more" Indicator */}
      <AnimatePresence>
        {!hasScrolled && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="sticky bottom-4 left-0 right-0 z-30 flex justify-center mt-3 pointer-events-none"
          >
            <button
              type="button"
              onClick={handleScrollClick}
              className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-full font-minecraft-bold text-[11px] uppercase tracking-wider whitespace-nowrap cursor-pointer transition-transform hover:scale-105 active:scale-95 select-none"
              style={{
                background: "var(--tooltip-bg, var(--menubar-bg))",
                border: "1.5px solid var(--widget-border)",
                color: "var(--text-primary)",
                boxShadow: "2px 2px 0px var(--shadow-card, rgba(0,0,0,0.4))",
              }}
              title="Click to scroll down"
            >
              <span>Scroll to see more</span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                className="flex items-center"
              >
                <ChevronDown size={14} strokeWidth={2.5} />
              </motion.div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

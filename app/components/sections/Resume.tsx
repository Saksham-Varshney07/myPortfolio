"use client"

import { motion } from "framer-motion"
import { Download } from "lucide-react"
import { siteConfig } from "@/config/siteConfig"

export default function Resume({ compact = false }: { compact?: boolean }) {
  const { resumeLink } = siteConfig

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={compact ? "px-5 py-5" : "py-10"}
    >
      {/* Header */}
      <div className="flex justify-end mb-4">
        <a
          href={resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[11px] px-4 py-2 rounded-lg transition-colors"
          style={{
            background: "var(--widget-border)",
            border: "1px solid var(--widget-border)",
            color: "var(--text-primary)",
          }}
        >
          <Download size={12} />
          Download PDF
        </a>
      </div>

      <div className="w-full flex justify-center">
        {/* Make sure to upload your resume image to public/SakshamVarshney.png */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/SakshamVarshney.png"
          alt="Resume"
          className="w-full h-auto rounded-lg"
          style={{ border: "1px solid var(--separator)", objectFit: "contain" }}
        />
      </div>
    </motion.div>
  )
}

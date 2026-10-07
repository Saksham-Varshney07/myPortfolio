"use client"

import Image from 'next/image'
import { Github, Linkedin } from 'lucide-react'
import { SiLeetcode, SiX } from "react-icons/si"
import { siteConfig } from '@/config/siteConfig'

export default function Hero({ compact = false }: { compact?: boolean }) {
  const { personal, social } = siteConfig

  return (
    <section className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-7 flex-1 flex flex-col justify-between h-full min-h-0">
      <div className="mb-4 sm:mb-6 flex justify-between items-start gap-4">
        <div className="min-w-0">
          <h1
            className="font-press-start tracking-tight mb-5"
            style={{ 
              fontSize: compact ? 29 : 34, 
              lineHeight: 1.25,
              color: "var(--text-primary)" 
            }}
          >
            {personal.firstName}<br />{personal.lastName}
          </h1>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
            {personal.role}
          </p>
        </div>
        <div className="relative w-32 h-32 rounded-full overflow-hidden flex-none shadow-xl" style={{ border: "1px solid var(--window-border-unfocused)" }}>
          <Image 
            src={personal.avatar} 
            alt="" 
            fill 
            priority 
            className="object-cover" 
            style={{ objectPosition: "50% 85%" }}
          />
        </div>
      </div>

      <div style={{ height: 1, background: "var(--separator)", marginBottom: 22 }} />

      <div className="flex flex-col gap-3.5">
        <p className="text-[14px] leading-[1.8]" style={{ color: "var(--text-secondary)" }}>
          {personal.tagline}
        </p>
        {personal.hobbies && (
          <p className="text-[14px] leading-[1.8]" style={{ color: "var(--text-secondary)" }}>
            {personal.hobbies}
          </p>
        )}
      </div>

      <div
        className="flex items-center justify-between mt-auto pt-5"
        style={{ borderTop: "1px solid var(--separator)" }}
      >
        <div className="flex items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
              {personal.username}
            </p>
            <p className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
              {personal.location.split(",")[0]} · {personal.age}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[
              { href: social.twitter, icon: <SiX size={13} />, label: "X" },
              { href: social.github,  icon: <Github size={15} />,  label: "GitHub" },
              { href: social.linkedin, icon: <Linkedin size={15} />, label: "LinkedIn" },
              { href: social.leetcode, icon: <SiLeetcode size={15} />, label: "LeetCode" },
          ].map(({ href, icon, label }, idx, arr) => {
            const isLast = idx === arr.length - 1
            return (
              <button
                key={label}
                onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
                aria-label={label}
                className="group relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {icon}
                <span
                  className={`custom-tooltip ${isLast ? "custom-tooltip-end" : "left-1/2 -translate-x-1/2"} absolute -top-8 px-2 py-1 text-[10px] font-minecraft rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50`}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

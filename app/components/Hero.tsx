"use client"

import Image from 'next/image'
import { Github, Linkedin } from 'lucide-react'
import { SiLeetcode, SiX } from "react-icons/si"
import { siteConfig } from '@/config/siteConfig'

export default function Hero({ compact = false }: { compact?: boolean }) {
  const { personal, social } = siteConfig

  return (
    <section className="px-6 pt-7 pb-6 flex flex-col h-full" style={{ minHeight: 0 }}>
      <div className="mb-5 flex justify-between items-start">
        <div>
          <h1
            className="font-semibold tracking-tight leading-[0.92] mb-3"
            style={{ fontSize: compact ? 46 : 56, color: "var(--text-primary)" }}
          >
            {personal.firstName}<br />{personal.lastName}
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
            {personal.role}
          </p>
        </div>
        <div className="relative w-28 h-28 rounded-full overflow-hidden flex-none shadow-xl" style={{ border: "1px solid var(--window-border-unfocused)" }}>
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

      <div style={{ height: 1, background: "var(--separator)", marginBottom: 20 }} />

      <div className="flex flex-col gap-3">
        <p className="text-[13px] leading-[1.75]" style={{ color: "var(--text-secondary)" }}>
          {personal.tagline}
        </p>
        {personal.hobbies && (
          <p className="text-[13px] leading-[1.75]" style={{ color: "var(--text-secondary)" }}>
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
          ].map(({ href, icon, label }) => (
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
              <span className="custom-tooltip absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-mono rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Github,
  Linkedin,
  Mail,
  Download,
  Copy,
  Check,
  ArrowUpRight,
  Code2,
  Cpu,
  GraduationCap,
  Briefcase,
  Sun,
  Moon,
  Monitor,
  Terminal,
} from "lucide-react"
import { SiLeetcode, SiX } from "react-icons/si"
import { siteConfig } from "@/config/siteConfig"
import { experience } from "@/config/experience"
import { projects } from "@/config/projects"
import { skills } from "@/config/skills"
import AnimatedRays from "@/components/ui/animated-rays"

interface PlainPortfolioProps {
  onSwitchMode: (mode: "desktop" | "plain") => void
}

export default function PlainPortfolio({ onSwitchMode }: PlainPortfolioProps) {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [isLightMode, setIsLightMode] = useState(false)

  const { personal, social, contact, resumeLink } = siteConfig

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme")
      setIsLightMode(theme === "light")
    }
    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    })
    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    const nextMode = !isLightMode
    setIsLightMode(nextMode)
    const root = document.documentElement
    if (nextMode) {
      root.setAttribute("data-theme", "light")
      root.classList.add("light")
      root.classList.remove("dark")
      root.style.setProperty("--background", "#e8e3e7")
      root.style.setProperty("--foreground", "#1a162b")
      root.style.setProperty("--text-primary", "#1a162b")
      root.style.setProperty("--text-secondary", "#3d3652")
      root.style.setProperty("--text-muted", "#7a7289")
      root.style.setProperty("--text-faint", "#a8a2b5")
      root.style.setProperty("--separator", "rgba(0, 0, 0, 0.12)")
      root.style.setProperty("--item-separator", "rgba(0, 0, 0, 0.07)")
      root.style.setProperty("--dock-bg", "rgba(240, 237, 242, 0.85)")
      root.style.setProperty("--window-border-unfocused", "rgba(0, 0, 0, 0.15)")
      root.style.setProperty("--window-border-focused", "#1a162b")
    } else {
      root.setAttribute("data-theme", "dark")
      root.classList.add("dark")
      root.classList.remove("light")
      root.removeAttribute("style")
    }
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  return (
    <div
      className="relative min-h-screen font-sans transition-colors duration-300 overflow-x-hidden selection:bg-indigo-500/30"
      style={{
        background: "var(--background, #050508)",
        color: "var(--text-primary, #ffffff)",
      }}
    >
      {/* Dynamic Animated Rays Background (VengeanceUI) */}
      <AnimatedRays className="fixed inset-0 pointer-events-none z-0" />

      {/* Floating Apple macOS Sequoia Style Capsule Header */}
      <header className="sticky top-4 z-50 px-4 sm:px-6">
        <div
          className="max-w-3xl mx-auto h-13 px-4 rounded-full flex items-center justify-between gap-3 backdrop-blur-2xl transition-all duration-300"
          style={{
            background: isLightMode
              ? "rgba(255, 255, 255, 0.72)"
              : "rgba(18, 18, 24, 0.65)",
            border: isLightMode
              ? "1px solid rgba(0, 0, 0, 0.12)"
              : "1px solid rgba(255, 255, 255, 0.16)",
            boxShadow: isLightMode
              ? "0 12px 30px -10px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.8)"
              : "0 16px 40px -10px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.22)",
          }}
        >
          {/* Left: Brand Monogram & Return to Desktop OS Button */}
          <div className="flex items-center gap-2.5">
            {/* macOS Style Return to Desktop Button */}
            <button
              type="button"
              onClick={() => onSwitchMode("desktop")}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-mono font-medium transition-all cursor-pointer group"
              style={{
                background: isLightMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)",
                border: isLightMode ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.18)",
                color: "var(--text-primary)",
              }}
              title="Return to Desktop OS Window UI"
            >
              <Monitor size={12} className="group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Desktop OS</span>
            </button>

            <span className="text-xs opacity-30">|</span>

            {/* Avatar & Name */}
            <a href="#about" className="flex items-center gap-2 group">
              <div
                className="w-7 h-7 rounded-full overflow-hidden relative shrink-0 ring-1 ring-white/20"
              >
                <Image
                  src={personal.avatar}
                  alt={personal.fullName}
                  fill
                  className="object-cover"
                  style={{ objectPosition: "50% 85%" }}
                />
              </div>
              <span className="text-xs font-semibold tracking-tight group-hover:opacity-80 transition-opacity">
                {personal.fullName}
              </span>
            </a>
          </div>

          {/* Center/Right Nav Links */}
          <nav className="hidden md:flex items-center gap-4 text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>
            <a href="#about" className="hover:text-[var(--text-primary)] transition-colors">
              About
            </a>
            <a href="#experience" className="hover:text-[var(--text-primary)] transition-colors">
              Experience
            </a>
            <a href="#projects" className="hover:text-[var(--text-primary)] transition-colors">
              Projects
            </a>
            <a href="#skills" className="hover:text-[var(--text-primary)] transition-colors">
              Skills
            </a>
            <a href="#contact" className="hover:text-[var(--text-primary)] transition-colors">
              Contact
            </a>
          </nav>

          {/* Right: Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95"
              style={{
                background: isLightMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)",
                border: isLightMode ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.18)",
                color: "var(--text-primary)",
              }}
              title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {isLightMode ? <Moon size={13} /> : <Sun size={13} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Single Page Glassmorphic Content Container */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12 sm:space-y-16">
        {/* ========================================================= */}
        {/* HERO SECTION — macOS Frosted Glass Window Card             */}
        {/* ========================================================= */}
        <section
          id="about"
          className="rounded-3xl p-6 sm:p-9 backdrop-blur-2xl transition-all duration-300 relative overflow-hidden"
          style={{
            background: isLightMode
              ? "rgba(255, 255, 255, 0.65)"
              : "rgba(15, 15, 22, 0.55)",
            border: isLightMode
              ? "1px solid rgba(255, 255, 255, 0.8)"
              : "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow: isLightMode
              ? "0 20px 45px -12px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.9)"
              : "0 25px 50px -12px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.22)",
          }}
        >
          {/* macOS Window Controls Decorator */}
          <div className="flex items-center justify-between pb-6 mb-2 border-b border-white/10 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] font-mono" style={{ color: "var(--text-muted)" }}>
              <Terminal size={11} />
              <span>profile.config.ts</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Pulsing Availability Pill */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono backdrop-blur-md"
              style={{
                background: isLightMode ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.08)",
                border: isLightMode ? "1px solid rgba(0, 0, 0, 0.08)" : "1px solid rgba(255, 255, 255, 0.15)",
                color: "var(--text-secondary)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for AI / ML & Software Engineering roles</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                {personal.fullName}
              </h1>
              <p className="text-base sm:text-lg font-mono text-indigo-400 font-medium">
                {personal.role}
              </p>
            </div>

            {/* Narrative */}
            <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              {personal.tagline}
            </p>

            {personal.hobbies && (
              <p className="text-[13.5px] leading-relaxed max-w-2xl" style={{ color: "var(--text-muted)" }}>
                {personal.hobbies}
              </p>
            )}

            {/* Action Chips & Social Links */}
            <div className="flex flex-wrap items-center gap-2.5 pt-3">
              {/* Résumé Button */}
              <a
                href={resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all group cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
                style={{
                  background: isLightMode ? "#1a162b" : "#ffffff",
                  color: isLightMode ? "#ffffff" : "#000000",
                }}
              >
                <Download size={13} />
                <span>Download Résumé</span>
                <ArrowUpRight size={12} className="opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Email Copy Chip */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer backdrop-blur-md hover:bg-white/10 active:scale-95"
                style={{
                  background: isLightMode ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.08)",
                  border: isLightMode ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(255, 255, 255, 0.16)",
                  color: "var(--text-secondary)",
                }}
                title="Click to copy email address"
              >
                {copiedEmail ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedEmail ? "Copied!" : contact.email}</span>
              </button>

              {/* Social Circles */}
              <div className="flex items-center gap-1.5 pl-1">
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
                  style={{
                    background: isLightMode ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.08)",
                    border: isLightMode ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(255, 255, 255, 0.16)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Github size={14} />
                </a>
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
                  style={{
                    background: isLightMode ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.08)",
                    border: isLightMode ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(255, 255, 255, 0.16)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Linkedin size={14} />
                </a>
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X / Twitter"
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
                  style={{
                    background: isLightMode ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.08)",
                    border: isLightMode ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(255, 255, 255, 0.16)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <SiX size={12} />
                </a>
                <a
                  href={social.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LeetCode"
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
                  style={{
                    background: isLightMode ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.08)",
                    border: isLightMode ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(255, 255, 255, 0.16)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <SiLeetcode size={13} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* EXPERIENCE — Frosted Glass Container                      */}
        {/* ========================================================= */}
        <section
          id="experience"
          className="rounded-3xl p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 space-y-7"
          style={{
            background: isLightMode
              ? "rgba(255, 255, 255, 0.65)"
              : "rgba(15, 15, 22, 0.55)",
            border: isLightMode
              ? "1px solid rgba(255, 255, 255, 0.8)"
              : "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow: isLightMode
              ? "0 20px 45px -12px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.9)"
              : "0 25px 50px -12px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.22)",
          }}
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/5">
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <Briefcase size={17} className="text-indigo-400" />
              <span>Work Experience</span>
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10" style={{ color: "var(--text-muted)" }}>
              {experience.length} Roles
            </span>
          </div>

          <div className="space-y-7">
            {experience.map((item, idx) => (
              <div
                key={item.company + idx}
                className="group relative flex flex-col space-y-3 pb-6 last:pb-0"
                style={{
                  borderBottom: idx === experience.length - 1 ? "none" : "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                {/* Header: Company, Role, Date */}
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <div className="flex items-baseline gap-2.5">
                    <h3 className="text-base font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                      {item.company}
                    </h3>
                    <span className="text-xs opacity-40">—</span>
                    <span className="text-xs font-mono font-medium text-indigo-400">
                      {item.role}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono shrink-0" style={{ color: "var(--text-muted)" }}>
                    {item.period}
                  </span>
                </div>

                {/* Achievements Bullet Points */}
                <ul className="space-y-2 text-[13px] leading-relaxed list-disc list-outside pl-4" style={{ color: "var(--text-secondary)" }}>
                  {item.achievements.map((ach, aIdx) => (
                    <li key={aIdx} className="pl-1">
                      {ach}
                    </li>
                  ))}
                </ul>

                {/* Frosted Tech Pills */}
                {item.tech && item.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-md text-[10.5px] font-mono backdrop-blur-md"
                        style={{
                          background: isLightMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
                          border: isLightMode ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.12)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* FEATURED PROJECTS — Frosted Glass Cards                   */}
        {/* ========================================================= */}
        <section id="projects" className="space-y-5">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <Code2 size={17} className="text-indigo-400" />
              <span>Featured Projects</span>
            </h2>
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>GitHub</span>
              <ArrowUpRight size={11} />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {projects.personal.map((p, idx) => (
              <a
                key={p.title + idx}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-3xl backdrop-blur-2xl transition-all duration-300 block cursor-pointer hover:scale-[1.01]"
                style={{
                  background: isLightMode
                    ? "rgba(255, 255, 255, 0.65)"
                    : "rgba(15, 15, 22, 0.55)",
                  border: isLightMode
                    ? "1px solid rgba(255, 255, 255, 0.8)"
                    : "1px solid rgba(255, 255, 255, 0.14)",
                  boxShadow: isLightMode
                    ? "0 20px 45px -12px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.9)"
                    : "0 25px 50px -12px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.22)",
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-2.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold tracking-tight group-hover:text-indigo-400 transition-colors" style={{ color: "var(--text-primary)" }}>
                      {p.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0">
                    <span>Source</span>
                    <ArrowUpRight size={13} />
                  </div>
                </div>

                <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-md text-[10.5px] font-mono backdrop-blur-md"
                      style={{
                        background: isLightMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
                        border: isLightMode ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.12)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SKILLS — Apple Glass Panes                                */}
        {/* ========================================================= */}
        <section
          id="skills"
          className="rounded-3xl p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 space-y-6"
          style={{
            background: isLightMode
              ? "rgba(255, 255, 255, 0.65)"
              : "rgba(15, 15, 22, 0.55)",
            border: isLightMode
              ? "1px solid rgba(255, 255, 255, 0.8)"
              : "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow: isLightMode
              ? "0 20px 45px -12px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.9)"
              : "0 25px 50px -12px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.22)",
          }}
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/5">
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <Cpu size={17} className="text-indigo-400" />
              <span>Technical Skills</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(skills).map(([category, skillList]) => (
              <div
                key={category}
                className="p-4 rounded-2xl space-y-2.5 backdrop-blur-md"
                style={{
                  background: isLightMode ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.04)",
                  border: isLightMode ? "1px solid rgba(0, 0, 0, 0.08)" : "1px solid rgba(255, 255, 255, 0.09)",
                }}
              >
                <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                  {category}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skillList.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono"
                      style={{
                        background: isLightMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
                        border: isLightMode ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.1)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* EDUCATION — Frosted Glass Card                            */}
        {/* ========================================================= */}
        <section
          className="rounded-3xl p-6 sm:p-7 backdrop-blur-2xl transition-all duration-300 space-y-4"
          style={{
            background: isLightMode
              ? "rgba(255, 255, 255, 0.65)"
              : "rgba(15, 15, 22, 0.55)",
            border: isLightMode
              ? "1px solid rgba(255, 255, 255, 0.8)"
              : "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow: isLightMode
              ? "0 20px 45px -12px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.9)"
              : "0 25px 50px -12px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.22)",
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10 dark:border-white/5">
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <GraduationCap size={17} className="text-indigo-400" />
              <span>Education</span>
            </h2>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                KJ Somaiya School of Engineering
              </h3>
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                2023 – 2027
              </span>
            </div>
            <p className="text-xs font-mono text-indigo-400">
              Bachelor of Technology in Information Technology
            </p>
            <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              Cumulative GPA: <span className="font-semibold text-emerald-400">9.06 / 10.0</span>
            </p>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CONTACT / CTA — Apple Glass Banner                        */}
        {/* ========================================================= */}
        <section
          id="contact"
          className="rounded-3xl p-7 sm:p-9 text-center space-y-4 backdrop-blur-2xl transition-all duration-300"
          style={{
            background: isLightMode
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(15, 15, 22, 0.6)",
            border: isLightMode
              ? "1px solid rgba(255, 255, 255, 0.85)"
              : "1px solid rgba(255, 255, 255, 0.16)",
            boxShadow: isLightMode
              ? "0 20px 45px -12px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.9)"
              : "0 25px 50px -12px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.22)",
          }}
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {contact.heading}
          </h2>
          <p className="text-xs sm:text-sm max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
            {contact.subheading}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all group cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
              style={{
                background: isLightMode ? "#1a162b" : "#ffffff",
                color: isLightMode ? "#ffffff" : "#000000",
              }}
            >
              <Mail size={13} />
              <span>Send an Email</span>
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer backdrop-blur-md hover:bg-white/10 active:scale-95"
              style={{
                background: isLightMode ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.08)",
                border: isLightMode ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(255, 255, 255, 0.16)",
                color: "var(--text-secondary)",
              }}
            >
              {copiedEmail ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedEmail ? "Copied!" : "Copy Email"}</span>
            </button>
          </div>
        </section>
      </main>

      {/* Apple Styled Footer */}
      <footer className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono border-t border-white/10 dark:border-white/5" style={{ color: "var(--text-muted)" }}>
        <div>
          © {new Date().getFullYear()} {personal.fullName}. All rights reserved.
        </div>

        {/* Quick Return to Desktop Button */}
        <button
          type="button"
          onClick={() => onSwitchMode("desktop")}
          className="flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors cursor-pointer group"
        >
          <Monitor size={12} className="group-hover:scale-110 transition-transform" />
          <span>Switch back to Desktop OS</span>
        </button>
      </footer>
    </div>
  )
}

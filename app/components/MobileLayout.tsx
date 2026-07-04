"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import Hero from "./Hero"
import Experience from "./sections/Experience"
import Projects from "./sections/Projects"

import Contact from "./sections/Contact"
import Resume from "./sections/Resume"
import { siteConfig } from "@/config/siteConfig"


const NAV = [
  { id: "about",      label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects",   label: "Projects" },
  { id: "contact",    label: "Contact" },
  { id: "resume",     label: "Resume" },
]

export default function MobileLayout() {
  const [time, setTime] = useState("")
  const [activeId, setActiveId] = useState("about")
  const [isLightMode, setIsLightMode] = useState(false)

  const BORDER = isLightMode ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.07)"

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }))
    }
    update()
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <div 
      className="desktop-bg" 
      data-mobile-theme={isLightMode ? "light" : undefined}
      style={{ 
        minHeight: "100dvh", 
        color: "var(--foreground)", 
        background: isLightMode ? "#f7f7f7" : undefined,
        backgroundImage: isLightMode ? "none" : undefined
      }}
    >

      <header
        className="sticky top-0 z-50 flex items-center justify-between px-5"
        style={{ height: 44, background: isLightMode ? "rgba(255,255,255,0.96)" : "rgba(11,11,11,0.96)", borderBottom: BORDER, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>
          {siteConfig.personal.initials}
        </span>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsLightMode(!isLightMode)} className="focus:outline-none flex items-center justify-center" style={{ color: "var(--text-primary)" }}>
            {isLightMode ? <Moon size={14} /> : <Sun size={14} />}
          </button>
          <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
            {time}
          </span>
        </div>
      </header>

      <nav
        className="sticky z-40 flex items-center gap-5 px-5 overflow-x-auto"
        style={{ top: 44, height: 36, background: isLightMode ? "rgba(255,255,255,0.96)" : "rgba(11,11,11,0.96)", borderBottom: BORDER, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", scrollbarWidth: "none", overscrollBehaviorX: "contain" }}
      >
        {NAV.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="font-mono text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors pb-px"
            style={{
              color: activeId === id ? "var(--text-primary)" : "var(--text-muted)",
              borderBottom: activeId === id ? `1px solid var(--text-primary)` : "1px solid transparent",
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Sections */}
      <section id="about" style={{ borderBottom: BORDER }}>
        <Hero />
      </section>

      <section id="experience" style={{ borderBottom: BORDER }}>
        <Experience compact />
      </section>

      <section id="projects" style={{ borderBottom: BORDER }}>
        <Projects compact />
      </section>

      <section id="contact" style={{ borderBottom: BORDER }}>
        <Contact compact />
      </section>

      <section id="resume" style={{ borderBottom: BORDER }}>
        <Resume compact />
      </section>

      <footer className="px-6 py-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
          {siteConfig.personal.fullName} · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
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
  { id: "writing",    label: "Writing" },
  { id: "contact",    label: "Contact" },
  { id: "resume",     label: "Resume" },
]

const BORDER = "1px solid rgba(255,255,255,0.07)"

export default function MobileLayout() {
  const [time, setTime] = useState("")
  const [activeId, setActiveId] = useState("about")

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
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="desktop-bg" style={{ minHeight: "100dvh", color: "#f0f0f0" }}>

      <header
        className="sticky top-0 z-50 flex items-center justify-between px-5"
        style={{ height: 44, background: "rgba(11,11,11,0.96)", borderBottom: BORDER, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.9)" }}>
          {siteConfig.personal.initials}
        </span>
        <span className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          {time}
        </span>
      </header>

      <nav
        className="sticky z-40 flex items-center gap-5 px-5 overflow-x-auto"
        style={{ top: 44, height: 36, background: "rgba(11,11,11,0.96)", borderBottom: BORDER, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", scrollbarWidth: "none", overscrollBehaviorX: "contain" }}
      >
        {NAV.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="font-mono text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors pb-px"
            style={{
              color: activeId === id ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.28)",
              borderBottom: activeId === id ? "1px solid rgba(255,255,255,0.5)" : "1px solid transparent",
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
        <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.18)" }}>
          {siteConfig.personal.fullName} · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}

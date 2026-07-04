"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import MobileLayout from "./MobileLayout"
import MenuBar from "./MenuBar"
import MacWindow from "./MacWindow"
import Dock from "./Dock"
import GitHubHeatmap from "./GitHubHeatmap"
import StatusWidget from "./widgets/StatusWidget"
import ReadingWidget from "./widgets/ReadingWidget"
import CalendarWidget from "./widgets/CalendarWidget"
// import VisitorWidget from "./widgets/VisitorWidget"
import ThemeWidget from "./widgets/ThemeWidget"
import { ContextMenu, MenuItem } from "./ContextMenu"
import { siteConfig } from "@/config/siteConfig"
import { windows, type WindowId } from "@/config/windows"


const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]

export default function Desktop() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [openWindows, setOpenWindows] = useState<WindowId[]>(["about"])
  const [minimizedWindows, setMinimizedWindows] = useState<WindowId[]>([])
  const [windowOrder, setWindowOrder] = useState<WindowId[]>(["about"])
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [showAboutOverlay, setShowAboutOverlay] = useState(false)
  const [konamiActive, setKonamiActive] = useState(false)
  const konamiIdx = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    if (!siteConfig.features.konami) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === KONAMI[konamiIdx.current]) {
        konamiIdx.current += 1
        if (konamiIdx.current === KONAMI.length) {
          konamiIdx.current = 0
          setKonamiActive(true)
          setTimeout(() => setKonamiActive(false), 3200)
        }
      } else {
        konamiIdx.current = e.key === KONAMI[0] ? 1 : 0
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const focusedWindow = windowOrder[windowOrder.length - 1] ?? null

  const closeWindow = useCallback((id: WindowId) => {
    setOpenWindows((p) => p.filter((w) => w !== id))
    setWindowOrder((p) => p.filter((w) => w !== id))
    setMinimizedWindows((p) => p.filter((w) => w !== id))
  }, [])

  const minimizeWindow = useCallback((id: WindowId) => {
    setMinimizedWindows((p) => [...p.filter((w) => w !== id), id])
    setWindowOrder((p) => p.filter((w) => w !== id))
  }, [])

  const focusWindow = useCallback((id: WindowId) => {
    setWindowOrder((p) => [...p.filter((w) => w !== id), id])
  }, [])

  const toggleWindow = useCallback(
    (id: string, url?: string) => {
      if (url) { window.open(url, "_blank", "noopener,noreferrer"); return }
      const wid = id as WindowId
      if (openWindows.includes(wid)) {
        if (minimizedWindows.includes(wid)) {
          setMinimizedWindows((p) => p.filter((w) => w !== wid))
          focusWindow(wid)
        } else if (focusedWindow !== wid) { 
          focusWindow(wid) 
        } else { 
          minimizeWindow(wid) 
        }
      } else {
        setOpenWindows((p) => [...p, wid])
        setMinimizedWindows((p) => p.filter((w) => w !== wid))
        setWindowOrder((p) => [...p.filter((w) => w !== wid), wid])
      }
    },
    [openWindows, minimizedWindows, focusedWindow, focusWindow, closeWindow, minimizeWindow]
  )

  const getZIndex = (id: WindowId) => {
    const idx = windowOrder.indexOf(id)
    return idx === -1 ? 10 : 10 + idx
  }

  const contextMenuItems: MenuItem[] = [
    { label: "New Window",         onClick: () => toggleWindow("about"),    dividerAfter: true },
    { label: "About this Portfolio",                onClick: () => setShowAboutOverlay(true), dividerAfter: true },
    { label: "Contact",                             onClick: () => toggleWindow("contact") },
  ]

  if (isMobile === null) return null
  if (isMobile) return <MobileLayout />

  const focusedTitle = focusedWindow ? windows.find((w) => w.id === focusedWindow)?.title ?? null : null

  return (
    <div
      className="fixed inset-0 overflow-hidden desktop-bg"
      onContextMenu={(e) => {
        if ((e.target as Element).closest("[data-mac-window]")) return
        e.preventDefault()
        setContextMenu({ x: e.clientX, y: e.clientY })
      }}
      onClick={() => setContextMenu(null)}
    >
      <div className="album-wallpaper" aria-hidden="true" />

      <MenuBar focusedApp={focusedTitle} />

      {windows.map((win) => {
        const Section = win.component
        return (
          <MacWindow
            key={win.id}
            windowId={win.id}
            title={win.id === "resume" ? `Resume — ${siteConfig.personal.fullName}` : win.title}
            isOpen={openWindows.includes(win.id)}
            isFocused={focusedWindow === win.id}
            isMinimized={minimizedWindows.includes(win.id)}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            zIndex={getZIndex(win.id)}
            width={win.width}
            height={win.height}
            offsetX={win.offsetX}
            offsetY={win.offsetY}
          >
            <Section compact />
          </MacWindow>
        )
      })}

      <div className="absolute right-6 top-[50px] flex flex-col gap-4 items-end pointer-events-none z-[5]">
        <motion.div layout transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="pointer-events-auto origin-top-right">
          <StatusWidget onContactClick={() => toggleWindow("contact")} />
        </motion.div>
        <motion.div layout transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="pointer-events-auto origin-top-right">
          <ThemeWidget />
        </motion.div>
        <motion.div layout transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="pointer-events-auto origin-top-right">
          <GitHubHeatmap />
        </motion.div>
      </div>

      <div className="absolute left-4 top-[50px] flex flex-col gap-4 items-start pointer-events-none z-[5]">
        <motion.div layout transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="pointer-events-auto origin-top-left">
          <ReadingWidget />
        </motion.div>
        <motion.div layout transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="pointer-events-auto origin-top-left">
          <CalendarWidget />
        </motion.div>
        <motion.div layout transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="pointer-events-auto origin-top-left">
          {/* <VisitorWidget /> */}
        </motion.div>
      </div>

      <Dock openWindows={openWindows} onToggleWindow={toggleWindow} />

      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            items={contextMenuItems}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAboutOverlay && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-overlay-title"
            className="fixed inset-0 z-[600] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAboutOverlay(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 8 }}
              transition={{ type: "spring", damping: 28, stiffness: 380 }}
              className="px-8 py-7 text-center"
              style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                width: 320,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                About this Portfolio
              </p>
              <h2 id="about-overlay-title" className="text-[22px] font-semibold text-white mb-1">Saksham&apos;s Portfolio</h2>
              <p className="font-mono text-[11px] mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>Version 1.0.0</p>
              <button
                type="button"
                className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                onClick={() => setShowAboutOverlay(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {konamiActive && (
          <motion.div
            className="fixed inset-0 z-[700] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="text-center px-10 py-8"
              style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
              }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                ✦ Cheat Code Activated ✦
              </p>
              <p className="text-[28px] font-semibold text-white mb-2">+99 Engineering Credits</p>
              <p className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                Hello, fellow human of culture.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

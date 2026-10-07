"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import MobileLayout from "./MobileLayout"
import MenuBar from "./MenuBar"
import Window from "./Window"
import Dock from "./Dock"
import GitHubHeatmap from "./GitHubHeatmap"
import StatusWidget from "./widgets/StatusWidget"
import ReadingWidget from "./widgets/ReadingWidget"
import CalendarWidget from "./widgets/CalendarWidget"
// import VisitorWidget from "./widgets/VisitorWidget"
import ThemeWidget from "./widgets/ThemeWidget"
import { ContextMenu, MenuItem } from "./ContextMenu"
import BootLoadingScreen from "./BootLoadingScreen"
import { SolaceFieldShader } from "./solace-field-shader"
import { siteConfig } from "@/config/siteConfig"
import { windows, type WindowId } from "@/config/windows"
import PlainPortfolio from "./plain/PlainPortfolio"
import AITransitionOverlay from "./plain/AITransitionOverlay"


const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]

export default function Desktop() {
  const [viewMode, setViewMode] = useState<"desktop" | "plain">("desktop")
  const [isAITransitioning, setIsAITransitioning] = useState(false)
  const [isBootLoading, setIsBootLoading] = useState(true)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [openWindows, setOpenWindows] = useState<WindowId[]>([])
  const [minimizedWindows, setMinimizedWindows] = useState<WindowId[]>([])
  const [windowOrder, setWindowOrder] = useState<WindowId[]>([])
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
    [openWindows, minimizedWindows, focusedWindow, focusWindow, minimizeWindow]
  )

  const getZIndex = (id: WindowId) => {
    const idx = windowOrder.indexOf(id)
    return idx === -1 ? 10 : 10 + idx
  }

  const contextMenuItems: MenuItem[] = [
    { label: "New Window", onClick: () => toggleWindow("about"), dividerAfter: true },
    { label: "About this Portfolio", onClick: () => setShowAboutOverlay(true), dividerAfter: true },
    { label: "Contact", onClick: () => toggleWindow("contact") },
  ]

  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio-view-mode")
      if (saved === "plain" || saved === "desktop") {
        setViewMode(saved)
      }
    } catch {}
  }, [])

  const handleSwitchMode = useCallback((targetMode: "desktop" | "plain") => {
    if (targetMode === viewMode) return

    if (targetMode === "plain") {
      setIsAITransitioning(true)
    } else {
      setViewMode("desktop")
      try {
        localStorage.setItem("portfolio-view-mode", "desktop")
      } catch {}
    }
  }, [viewMode])

  const handleAITransitionComplete = useCallback(() => {
    setIsAITransitioning(false)
    setViewMode("plain")
    try {
      localStorage.setItem("portfolio-view-mode", "plain")
    } catch {}
  }, [])

  if (isMobile === null) return null

  const focusedTitle = focusedWindow ? windows.find((w) => w.id === focusedWindow)?.title ?? null : null

  return (
    <>
      <AnimatePresence>
        {isBootLoading && (
          <BootLoadingScreen
            onComplete={() => {
              setIsBootLoading(false)
              setTimeout(() => {
                setOpenWindows(["about"])
                setWindowOrder(["about"])
              }, 120)
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAITransitioning && (
          <AITransitionOverlay onComplete={handleAITransitionComplete} />
        )}
      </AnimatePresence>

      {viewMode === "plain" ? (
        <PlainPortfolio onSwitchMode={handleSwitchMode} />
      ) : isMobile ? (
        <MobileLayout onSwitchMode={handleSwitchMode} />
      ) : (
        <div
          className="fixed inset-0 overflow-hidden desktop-bg"
          onContextMenu={(e) => {
            if ((e.target as Element).closest("[data-mac-window]")) return
            e.preventDefault()
            setContextMenu({ x: e.clientX, y: e.clientY })
          }}
          onClick={() => setContextMenu(null)}
        >
          {/* Interactive SolaceUI Repulsion Lattice Shader Background */}
          <SolaceFieldShader
            variant="repulsion"
            palette="solace"
            dotSize={0.8}
            scale={1.0}
            distortion={0.7}
            trail={0.45}
            speed={0.7}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 solace-shader-bg"
          />

          <div className="album-wallpaper" aria-hidden="true" />

          <MenuBar
            focusedApp={focusedTitle}
            onModeChange={handleSwitchMode}
          />

          {windows.map((win) => {
            const Section = win.component
            return (
              <Window
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
              </Window>
            )
          })}

          <div className="absolute right-6 top-[50px] flex flex-col gap-4 items-end pointer-events-none z-[5]">
            <motion.div layout transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="pointer-events-auto origin-top-right">
              <StatusWidget onContactClick={() => toggleWindow("contact")} />
            </motion.div>
            <motion.div layout transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="pointer-events-auto origin-top-right">
              <ThemeWidget />
            </motion.div>
            <motion.div layout transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="pointer-events-auto origin-top-right mt-3">
              <GitHubHeatmap />
            </motion.div>
          </div>

          <div className="absolute left-6 top-[50px] flex flex-col gap-9 items-start pointer-events-none z-[5]">
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
                    background: "var(--window-bg)",
                    border: "1px solid var(--window-border-focused)",
                    borderRadius: "var(--window-radius, 12px)",
                    boxShadow: "var(--window-shadow-focused, 0 20px 40px rgba(0,0,0,0.5))",
                    width: 320,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-4" style={{ color: "var(--text-muted)" }}>
                    About this Portfolio
                  </p>
                  <h2 id="about-overlay-title" className="text-[22px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                    Saksham&apos;s Portfolio
                  </h2>
                  <p className="font-mono text-[11px] mb-5" style={{ color: "var(--text-secondary)" }}>Version 1.0.0</p>
                  <button
                    type="button"
                    className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded transition-colors focus:outline-none cursor-pointer"
                    style={{
                      background: "var(--item-separator)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--widget-border)",
                      boxShadow: "var(--btn-shadow, none)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-subtle)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--item-separator)")}
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
                    background: "var(--window-bg)",
                    border: "1px solid var(--window-border-focused)",
                    borderRadius: "var(--window-radius, 12px)",
                    boxShadow: "var(--window-shadow-focused, 0 20px 40px rgba(0,0,0,0.5))",
                  }}
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3" style={{ color: "var(--text-muted)" }}>
                    ✦ Cheat Code Activated ✦
                  </p>
                  <p className="text-[28px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>+99 Engineering Credits</p>
                  <p className="font-mono text-[11px]" style={{ color: "var(--text-secondary)" }}>
                    Hello, fellow human of culture.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}

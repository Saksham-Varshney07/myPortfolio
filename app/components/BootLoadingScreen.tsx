"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Loader2, Terminal } from "lucide-react"

interface Step {
  id: string
  label: string
  detail: string
  triggerTime: number
  completeTime: number
}

const STEPS: Step[] = [
  { id: "sys", label: "Starting system", detail: "Kernel initialization & core services", triggerTime: 0.2, completeTime: 1.4 },
  { id: "exp", label: "Gathering experience", detail: "Software development & AI/ML modules", triggerTime: 1.4, completeTime: 2.7 },
  { id: "prj", label: "Building projects", detail: "Compiling interactive showcases", triggerTime: 2.7, completeTime: 4.0 },
  { id: "stk", label: "Indexing skills & stack", detail: "Next.js, TypeScript, React & Three.js", triggerTime: 4.0, completeTime: 5.3 },
  { id: "cal", label: "Calibrating desktop", detail: "Mounting widgets, dock & window manager", triggerTime: 5.3, completeTime: 6.6 },
  { id: "rdy", label: "Launching workspace", detail: "Opening portfolio interface", triggerTime: 6.6, completeTime: 8.0 },
]

// ─── Video & Background Sizing Config ──────────────────────────────────────────
// Adjust the zoom level, fit mode, and alignment of the loading screen video here:
export const LOADING_VIDEO_CONFIG = {
  scale: 1.0,                  // Scale factor: 1.0 = native size, < 1.0 = zoom out, > 1.0 = zoom in
  objectFit: "contain" as const, // "contain" matches VLC (shows 100% full uncropped video); change to "cover" to stretch to all edges
  objectPosition: "center center", // e.g. "center center", "center top"
}

// ─── UI Sizing Config ──────────────────────────────────────────────────────────
// Adjust the font size and padding of the "Skip [ESC]" button here:
export const SKIP_BUTTON_CONFIG = {
  fontSize: 10,      // Font size in pixels (e.g. 7, 8, 9, 10, 11)
  paddingX: 10,      // Horizontal padding in pixels (left & right)
  paddingY: 4,       // Vertical padding in pixels (top & bottom)
}

// ─── HUD Position Config ───────────────────────────────────────────────────────
// Adjust vertical positioning and maximum width of the loading HUD card on top:
export const LOADING_HUD_CONFIG = {
  topMargin: "3.5vh", // Distance from top of screen near the pixel window (e.g. "2vh", "3.5vh", "24px")
  maxWidth: 640,      // Max width in pixels
}

interface BootLoadingScreenProps {
  onComplete: () => void
}

export default function BootLoadingScreen({ onComplete }: BootLoadingScreenProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [isFinishing, setIsFinishing] = useState(false)
  const hasCompletedRef = useRef(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const triggerComplete = useCallback(() => {
    if (hasCompletedRef.current) return
    hasCompletedRef.current = true
    setIsFinishing(true)
    setTimeout(() => {
      onComplete()
    }, 250)
  }, [onComplete])

  // -------------------------------------------------------------
  // Boot Sequence Timeline Engine
  // -------------------------------------------------------------
  useEffect(() => {
    const startTime = Date.now()
    const totalDuration = 8.0
    let animationFrameId: number

    const updateTimeline = () => {
      if (hasCompletedRef.current) return

      const elapsed = (Date.now() - startTime) / 1000

      if (elapsed >= totalDuration) {
        setProgress(100)
        setCurrentStepIndex(STEPS.length - 1)
        setCompletedSteps(STEPS.map((s) => s.id))
        triggerComplete()
        return
      }

      // Smooth progress calculation
      const currentPct = Math.min(99, Math.round((elapsed / totalDuration) * 100))
      setProgress(currentPct)

      // Active & completed steps
      const activeIdx = STEPS.findIndex((s) => elapsed >= s.triggerTime && elapsed < s.completeTime)
      if (activeIdx !== -1) {
        setCurrentStepIndex(activeIdx)
      } else if (elapsed >= 6.6) {
        setCurrentStepIndex(STEPS.length - 1)
      }

      const newlyDone = STEPS.filter((s) => elapsed >= s.completeTime).map((s) => s.id)
      setCompletedSteps(newlyDone)

      animationFrameId = requestAnimationFrame(updateTimeline)
    }

    animationFrameId = requestAnimationFrame(updateTimeline)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [triggerComplete])

  // Allow ESC to skip immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerComplete()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [triggerComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFinishing ? 0 : 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-start select-none overflow-hidden bg-black"
    >
      {/* Animated Pixel Room Video Background (Native sharpness without filters) */}
      <video
        ref={videoRef}
        src="/loadinganimation.mp4"
        poster="/boot-room-pixel.jpg"
        autoPlay
        muted
        playsInline
        loop
        className="absolute inset-0 w-full h-full z-0"
        style={{
          objectFit: LOADING_VIDEO_CONFIG.objectFit,
          objectPosition: LOADING_VIDEO_CONFIG.objectPosition,
          transform: `scale(${LOADING_VIDEO_CONFIG.scale})`,
        }}
      />

      {/* Soft Top Gradient to ensure terminal HUD text readability over the window */}
      <div
        className="absolute inset-x-0 top-0 h-80 z-1 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.28) 60%, transparent 100%)",
        }}
      />

      {/* Top HUD Wrapper: Positioned near the window above the desk */}
      <div
        className="relative z-20 flex flex-col items-center w-full px-4"
        style={{
          marginTop: LOADING_HUD_CONFIG.topMargin,
          maxWidth: `${LOADING_HUD_CONFIG.maxWidth}px`,
        }}
      >
        {/* Top Subtle OS Badge */}
        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-2 flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md bg-black/60 text-[11px] font-minecraft text-white/70 shadow-lg"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-widest uppercase">Saksham OS // Boot Sequence</span>
        </motion.div>

        {/* Top HUD: System Loading Progress & Checkpoints */}
        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full rounded-2xl p-4 overflow-hidden"
          style={{
            background: "rgba(10, 14, 26, 0.72)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderTop: "1px solid rgba(255, 255, 255, 0.28)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 0 25px rgba(56, 189, 248, 0.1)",
          }}
        >
        {/* Terminal Header Row */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 font-minecraft text-[12px] text-white/60 tracking-wider">
            <Terminal size={12} className="text-cyan-400" />
            <span className="font-semibold text-white/80">SYSTEM_BOOT.sh</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-minecraft text-[13px] font-bold text-cyan-400">
              {progress}%
            </span>
            <button
              type="button"
              onClick={triggerComplete}
              className="transition-colors uppercase font-minecraft tracking-wider rounded border border-white/20 hover:border-white/50 hover:bg-white/10 cursor-pointer"
              style={{
                color: "#ffffff",
                fontSize: `${SKIP_BUTTON_CONFIG.fontSize}px`,
                padding: `${SKIP_BUTTON_CONFIG.paddingY}px ${SKIP_BUTTON_CONFIG.paddingX}px`,
                lineHeight: 1,
              }}
            >
              Skip [ESC]
            </button>
          </div>
        </div>

        {/* Progress Bar (Smooth hardware-accelerated linear transition, zero jitter) */}
        <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden mb-3.5 relative">
          <div
            className="h-full rounded-full relative"
            style={{
              background: "#ffffff",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.6)",
              width: `${progress}%`,
              transition: "width 100ms linear",
              willChange: "width",
            }}
          />
        </div>

        {/* Grid of Steps (2 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-minecraft">
          {STEPS.map((step, idx) => {
            const isDone = completedSteps.includes(step.id)
            const isCurrent = currentStepIndex === idx && !isDone

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded transition-all duration-200 ${isCurrent
                    ? "bg-cyan-500/10 border border-cyan-500/30 text-white"
                    : isDone
                      ? "bg-white/[0.02] text-white/85"
                      : "text-white/30"
                  }`}
              >
                <div className="flex items-center gap-2 truncate pr-1">
                  <div className="w-4 h-4 flex-none flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {isDone ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 450, damping: 25 }}
                          className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]"
                        >
                          <Check size={9} strokeWidth={3} />
                        </motion.div>
                      ) : isCurrent ? (
                        <motion.div
                          key="loader"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-cyan-400"
                        >
                          <Loader2 size={12} className="animate-spin" />
                        </motion.div>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      )}
                    </AnimatePresence>
                  </div>

                  <span className="tracking-wide capitalize truncate">
                    {step.label}
                  </span>
                </div>

                <span
                  className={`text-[9.5px] uppercase font-minecraft tracking-wider flex-none ${isDone
                      ? "text-emerald-400 font-semibold"
                      : isCurrent
                        ? "text-cyan-400 animate-pulse"
                        : "text-white/20"
                    }`}
                >
                  {isDone ? "[ OK ]" : isCurrent ? "[ RUN ]" : "[ WAIT ]"}
                </span>
              </div>
            )
          })}
        </div>
      </motion.div>
      </div>
    </motion.div>
  )
}

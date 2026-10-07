"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, Bot, CheckCircle2, Terminal, Zap } from "lucide-react"

interface AITransitionOverlayProps {
  onComplete: () => void
}

export default function AITransitionOverlay({ onComplete }: AITransitionOverlayProps) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    // Esc key to skip instantly
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onComplete()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onComplete])

  useEffect(() => {
    // Sequence steps
    const t1 = setTimeout(() => setStep(1), 250)
    const t2 = setTimeout(() => setStep(2), 550)
    const t3 = setTimeout(() => setStep(3), 850)
    const t4 = setTimeout(() => setStep(4), 1150)
    const t5 = setTimeout(() => onComplete(), 1450)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 select-none"
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#111113] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ChatGPT Mockup Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#18181c] border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-white shadow-sm">
              <Bot size={13} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-white tracking-wide">
                  Saksham AI Assistant
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  gpt-4o-mini
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onComplete}
            className="text-[10px] font-mono text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
          >
            Skip <span className="text-[9px] text-zinc-500">(Esc)</span>
          </button>
        </div>

        {/* ChatGPT Conversation Mockup */}
        <div className="p-5 space-y-4 font-sans text-xs">
          {/* User Prompt */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              SV
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-mono text-zinc-400 mb-1">User</div>
              <div className="bg-[#212126] text-zinc-200 rounded-xl rounded-tl-sm px-3.5 py-2.5 leading-relaxed border border-white/5 text-[12.5px]">
                Synthesize portfolio into a clean, top-down executive view for recruiters.
              </div>
            </div>
          </div>

          {/* AI Response Stream */}
          <div className="flex items-start gap-3 pt-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Sparkles size={12} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-mono text-emerald-400 mb-1 flex items-center gap-1.5">
                <span>Model Output</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="bg-[#18181c] border border-white/10 rounded-xl rounded-tl-sm p-3.5 space-y-2.5 font-mono text-[11px] text-zinc-300">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Terminal size={12} className="text-indigo-400" />
                  <span>neural_compiler: executing layout synthesis</span>
                </div>

                {step >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-zinc-300"
                  >
                    <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                    <span>Parsing AI/ML experience (SkipQ, Outlier.ai, RLHF)</span>
                  </motion.div>
                )}

                {step >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-zinc-300"
                  >
                    <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                    <span>Extracting featured systems (TubeTrail, VisionForge, ClaimMax)</span>
                  </motion.div>
                )}

                {step >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-zinc-200"
                  >
                    <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                    <span className="text-emerald-300">
                      Compiling minimal top-down layout (inspired by ramx.in)
                    </span>
                  </motion.div>
                )}

                {step >= 4 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1.5 text-indigo-400 pt-1"
                  >
                    <Zap size={11} />
                    <span className="font-semibold">Ready. Launching Plain View...</span>
                  </motion.div>
                )}

                {step < 4 && (
                  <div className="inline-block w-2 h-3.5 bg-emerald-400 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Shimmer Bar */}
        <div className="h-1 w-full bg-zinc-800 relative overflow-hidden">
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(100, (step + 1) * 25)}%` }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

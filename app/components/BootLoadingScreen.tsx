"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"

interface BootLoadingScreenProps {
  onComplete: () => void
}

export default function BootLoadingScreen({ onComplete }: BootLoadingScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false)
  const hasCompletedRef = useRef(false)
  const pageReadyRef = useRef(false)

  // DOM element refs
  const sceneRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLSpanElement>(null)
  const secondRef = useRef<HTMLSpanElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const cursor2Ref = useRef<HTMLSpanElement>(null)
  const runtimeRef = useRef<HTMLSpanElement>(null)
  const statusRef = useRef<HTMLSpanElement>(null)
  const meterRef = useRef<HTMLSpanElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLSpanElement>(null)
  const openingRef = useRef<HTMLSpanElement>(null)

  // Check initial document readiness
  useEffect(() => {
    if (typeof document !== "undefined" && document.readyState === "complete") {
      pageReadyRef.current = true
    } else if (typeof window !== "undefined") {
      const handleLoad = () => {
        pageReadyRef.current = true
      }
      window.addEventListener("load", handleLoad)
      return () => window.removeEventListener("load", handleLoad)
    }
  }, [])

  const triggerExit = useCallback(() => {
    if (hasCompletedRef.current) return
    hasCompletedRef.current = true
    setIsFadingOut(true)
    setTimeout(() => {
      onComplete()
    }, 450)
  }, [onComplete])

  // Allow ESC key to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerExit()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [triggerExit])

  useEffect(() => {
    const scene = sceneRef.current
    const first = firstRef.current
    const second = secondRef.current
    const cursor = cursorRef.current
    const cursor2 = cursor2Ref.current
    const runtime = runtimeRef.current
    const status = statusRef.current
    const meter = meterRef.current
    const error = errorRef.current
    const output = outputRef.current
    const opening = openingRef.current

    if (
      !scene ||
      !first ||
      !second ||
      !cursor ||
      !cursor2 ||
      !runtime ||
      !status ||
      !meter ||
      !error ||
      !output ||
      !opening
    ) {
      return
    }

    // Clear and build initial dynamic spans
    output.innerHTML = ""
    opening.innerHTML = ""
    meter.innerHTML = ""

    const firstCode = "helloworld(print)"
    const secondCode = 'df.read_portfolio("saksham")'

    function letters(targetEl: HTMLElement, text: string) {
      return [...text].map((c) => {
        const s = document.createElement("span")
        s.textContent = c
        s.style.opacity = "0"
        targetEl.appendChild(s)
        return { el: s, char: c }
      })
    }

    const nameLetters = letters(output, "saksham")
    const openingLetters = letters(opening, "Opening portfolio…")

    const oc = document.createElement("span")
    oc.className = "output-cursor"
    opening.appendChild(oc)

    const bars = Array.from({ length: 9 }, () => {
      const i = document.createElement("i")
      meter.appendChild(i)
      return i
    })

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const clamp = (x: number) => Math.max(0, Math.min(1, x))
    const ease = (x: number) => x * x * (3 - 2 * x)

    let start: number | null = null
    let frame = 0
    let hiddenAt: number | null = null
    let heldAt: number | null = null
    let isTerminated = false

    // Keep the story's proportions, exactly matching 6.5s (5000 * 1.3 = 6500ms)
    const pace = 1.3

    function typeCount(text: string, progress: number) {
      const beats = [...text].map(
        (c, i) => 1 + ((i * 7) % 5) * 0.13 + ('(."'.includes(c) ? 0.5 : 0)
      )
      const budget = clamp(progress) * beats.reduce((a, b) => a + b, 0)
      let used = 0
      let count = 0
      for (const beat of beats) {
        used += beat
        if (used > budget + 1e-8) break
        count++
      }
      return count
    }

    function applyState(t: number, msNow: number) {
      first.textContent = firstCode.slice(0, typeCount(firstCode, (t - 100) / 560))
      second.textContent = secondCode.slice(0, typeCount(secondCode, (t - 1700) / 850))
      first.className = t > 1700 ? "old-code" : ""
      cursor.style.display = t < 760 ? "inline-block" : "none"
      cursor2.style.display = t >= 1700 && t < 2630 ? "inline-block" : "none"
      error.style.opacity = String(
        ease(clamp((t - 760) / 130)) * (1 - ease(clamp((t - 2370) / 210)))
      )
      runtime.textContent =
        t < 760
          ? "ready"
          : t < 1700
          ? "oops"
          : t < 2630
          ? "retrying"
          : t < 3350
          ? "✓ recovered"
          : "launching"
      status.textContent =
        t < 760
          ? "BOOTING CONFIDENCE"
          : t < 1700
          ? "CONFIDENCE: NOT FOUND"
          : t < 2630
          ? "PLAN B. OBVIOUSLY."
          : "BUG FIXED. EGO PENDING."

      function reveal(
        items: { el: HTMLSpanElement; char: string }[],
        begin: number,
        stagger: number
      ) {
        items.forEach(({ el, char }, i) => {
          const local = clamp((t - begin - i * stagger) / 220)
          const settle = 1 - Math.pow(1 - local, 3)
          el.style.opacity = String(settle)
          el.style.transform = `translateY(${(1 - settle) * 7}px)`
          el.textContent =
            char !== " " && local > 0 && local < 0.42
              ? "01{}<>/="[(Math.floor(t / 48) + i * 3) % 8]
              : char
        })
      }

      reveal(nameLetters, 2650, 55)
      reveal(openingLetters, 3240, 29)

      // Cursor blinking during final phase or while holding
      const isBlinkingPhase =
        (t > 3980 && t < 4730) || (t >= 4700 && !pageReadyRef.current)
      oc.style.opacity = isBlinkingPhase
        ? Math.floor(msNow / 350) % 2
          ? "0"
          : "1"
        : "0"

      scene.style.opacity = String(1 - ease(clamp((t - 4760) / 240)))
      bars.forEach((b, i) =>
        b.classList.toggle(
          "on",
          t < 760
            ? i < Math.floor(t / 95)
            : t < 1700
            ? false
            : t < 3980
            ? i === Math.floor(t / 65) % 9
            : t < 4760
        )
      )
    }

    function tick(now: number) {
      if (isTerminated || hasCompletedRef.current) return
      if (start === null) start = now

      if (reducedQuery.matches) {
        applyState(4350, now)
        // Reduced motion: hold for 1.4s then smoothly exit
        if (now - start > 1400) {
          isTerminated = true
          triggerExit()
        } else {
          frame = requestAnimationFrame(tick)
        }
        return
      }

      const elapsed = now - start
      const virtualT = elapsed / pace

      // If animation has reached the end of the reveal (4700) but page is still loading,
      // hold in the final "Opening portfolio…" state until page load finishes
      if (!pageReadyRef.current && virtualT >= 4700) {
        if (heldAt === null) {
          heldAt = now
        }
        applyState(4700, now)
      } else {
        if (heldAt !== null) {
          start += now - heldAt
          heldAt = null
        }
        const currentElapsed = now - start
        const t = currentElapsed / pace
        applyState(t, now)

        if (t >= 5000) {
          isTerminated = true
          triggerExit()
          return
        }
      }

      if (!isTerminated && !hasCompletedRef.current) {
        frame = requestAnimationFrame(tick)
      }
    }

    function sync() {
      cancelAnimationFrame(frame)
      if (reducedQuery.matches) {
        applyState(4350, performance.now())
        setTimeout(() => triggerExit(), 1400)
      } else if (!document.hidden) {
        frame = requestAnimationFrame(tick)
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenAt = performance.now()
        cancelAnimationFrame(frame)
      } else {
        if (start !== null && hiddenAt !== null) {
          start += performance.now() - hiddenAt
        }
        hiddenAt = null
        sync()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    reducedQuery.addEventListener("change", sync)

    sync()

    return () => {
      isTerminated = true
      cancelAnimationFrame(frame)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      reducedQuery.removeEventListener("change", sync)
    }
  }, [triggerExit])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="py-loader-root"
      style={{
        position: "fixed",
        inset: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        zIndex: 999999,
        backgroundColor: "#ffffff",
      }}
    >
      <main
        className="loader"
        aria-label="A playful Python loading animation: an incorrect hello world raises an error, then a portfolio command reveals saksham and Opening portfolio."
      >
        <div aria-hidden="true">
          <header className="top">
            <span className="file">
              <b>›_</b> portfolio.py
            </span>
            <span className="live"></span>
          </header>
          <div className="scene" ref={sceneRef}>
            <section className="editor">
              <div className="row">
                <span className="ln">01</span>
                <span className="muted"># trust me, i&apos;m a developer.</span>
              </div>
              <div className="row">
                <span className="ln">02</span>
                <span ref={firstRef}></span>
                <span ref={cursorRef} className="cursor"></span>
              </div>
              <div className="row">
                <span className="ln">03</span>
                <span ref={secondRef}></span>
                <span ref={cursor2Ref} className="cursor"></span>
              </div>
            </section>
            <section className="terminal">
              <div className="terminal-head">
                <span>PYTHON · OUTPUT</span>
                <span className="runtime" ref={runtimeRef}>
                  ready
                </span>
              </div>
              <div className="result">
                <span className="prompt">›</span>
                <div className="error" ref={errorRef}>
                  <strong>NameError:</strong> &apos;helloworld&apos; is not defined.
                  <br />
                  <small>coffee first. syntax later.</small>
                </div>
                <div className="success">
                  <span className="output" ref={outputRef}></span>
                  <span className="output opening" ref={openingRef}></span>
                </div>
              </div>
            </section>
          </div>
          <footer className="footer">
            <span ref={statusRef}>BOOTING CONFIDENCE</span>
            <span className="meter" ref={meterRef}></span>
          </footer>
        </div>
      </main>
    </motion.div>
  )
}

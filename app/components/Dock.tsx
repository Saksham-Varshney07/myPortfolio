"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { Github, Linkedin, FileText } from "lucide-react"
import { SiLeetcode } from "react-icons/si"
import { siteConfig } from "@/config/siteConfig"
import { windows } from "@/config/windows"
import { playClickSound } from "@/lib/sound"

function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

type DockItem =
  | { kind: "window"; id: string; label: string; icon: React.ReactNode }
  | { kind: "link"; id: string; label: string; icon: React.ReactNode; url: string }
  | { kind: "action"; id: string; label: string; icon: React.ReactNode; onTrigger: () => void }

const dockLinks: DockItem[] = [
  { kind: "link", id: "github",  label: "GitHub", icon: <Github size={20} strokeWidth={1.5} aria-hidden="true" />, url: siteConfig.social.github },
  { kind: "link", id: "twitter", label: "X",      icon: <XIcon size={18} />,                                        url: siteConfig.social.twitter },
  { kind: "link", id: "linkedin", label: "LinkedIn", icon: <Linkedin size={18} strokeWidth={1.5} aria-hidden="true" />, url: siteConfig.social.linkedin },
  { kind: "link", id: "leetcode", label: "LeetCode", icon: <SiLeetcode size={18} />,                              url: siteConfig.social.leetcode },
]

function DockIcon({
  item,
  mouseX,
  isOpen,
  onActivate,
}: {
  item: DockItem
  mouseX: ReturnType<typeof useMotionValue<number>>
  isOpen: boolean
  onActivate: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const sizeTransform = useTransform(distance, [-120, 0, 120], [40, 62, 40])
  const size = useSpring(sizeTransform, { mass: 0.1, stiffness: 200, damping: 14 })

  return (
    <div className="relative flex flex-col items-center gap-1">
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute top-full mt-2 px-2.5 py-1 rounded font-mono text-[10px] uppercase tracking-[0.06em] whitespace-nowrap pointer-events-none"
            style={{
              background: "var(--tooltip-bg)",
              border: "1px solid var(--widget-border)",
              color: "var(--text-primary)",
              boxShadow: "var(--btn-shadow, none)",
              borderRadius: "var(--widget-radius, 4px)",
            }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.1 }}
            aria-hidden="true"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={ref}
        type="button"
        aria-label={item.label}
        aria-pressed={item.kind === "window" ? isOpen : undefined}
        style={{
          width: size,
          height: size,
        }}
        animate={{
          background: isOpen ? "var(--accent-subtle)" : hovered ? "var(--item-separator)" : "var(--bg-card)",
          color: "var(--text-primary)",
        }}
        transition={{ duration: 0.15 }}
        className="retroui-dock-button flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          playClickSound()
          onActivate()
        }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {item.icon}
      </motion.button>

      <span
        aria-hidden="true"
        className="w-1 h-1 rounded-full"
        style={{
          background: isOpen ? "var(--indicator-color)" : "transparent",
          transition: "background 0.2s",
        }}
      />
    </div>
  )
}

export default function Dock({
  openWindows,
  onToggleWindow,
  onSwitchMode,
}: {
  openWindows: string[]
  onToggleWindow: (id: string, url?: string) => void
  onSwitchMode?: (mode: "desktop" | "plain") => void
}) {
  const mouseX = useMotionValue(Infinity)

  const dockApps: DockItem[] = [
    ...windows.map((w) => ({
      kind: "window" as const,
      id: w.id,
      label: w.title,
      icon: <w.icon size={22} strokeWidth={1.5} aria-hidden="true" />,
    })),
    {
      kind: "action" as const,
      id: "plain-view",
      label: "Plain View",
      icon: <FileText size={20} strokeWidth={1.5} aria-hidden="true" />,
      onTrigger: () => onSwitchMode?.("plain"),
    },
  ]

  return (
    <nav
      aria-label="Application dock"
      className="fixed top-4 left-1/2 z-[100]"
      style={{ transform: "translateX(-50%)" }}
    >
      <motion.div
        className="retroui-card flex items-end gap-2 px-3 pb-2 pt-2.5"
        style={{
          background: "var(--dock-bg)",
        }}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {dockApps.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            isOpen={item.kind === "window" ? openWindows.includes(item.id) : false}
            onActivate={() => {
              if (item.kind === "window") {
                onToggleWindow(item.id)
              } else if (item.kind === "action") {
                item.onTrigger()
              }
            }}
          />
        ))}

        <span
          aria-hidden="true"
          className="h-8 self-center mx-1 rounded-full"
          style={{ width: 1, background: "var(--widget-border)" }}
        />

        {dockLinks.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            isOpen={false}
            onActivate={() => onToggleWindow(item.id, item.kind === "link" ? item.url : undefined)}
          />
        ))}
      </motion.div>
    </nav>
  )
}

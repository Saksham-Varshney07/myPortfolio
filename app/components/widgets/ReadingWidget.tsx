"use client"

import { motion, useDragControls } from "framer-motion"

interface Book {
  title: string
  author: string
  genre: string
  status?: "reading" | "completed"
}

const books: Book[] = [
  {
    title: "Dark Matter",
    author: "Blake Crouch",
    genre: "Sci-Fi",
    status: "reading",
  },
  {
    title: "Ikigai",
    author: "Héctor García",
    genre: "Life",
  },
  {
    title: "Buildit",
    author: "Albinder Dhindsa",
    genre: "Entrepreneurship",
  },
  {
    title: "Subtle Art of Not Giving A F*ck",
    author: "Mark Manson",
    genre: "Self-help",
  },
  {
    title: "Diary Of A Wimpy Kid : Old School",
    author: "Jeff Kinney",
    genre: "Comic",
  },
]

// ─── UI Sizing Config ──────────────────────────────────────────────────────────
// Easily adjust font sizes and dimensions for the Reading List widget here:
export const READING_CONFIG = {
  bookTitleSize: 12,     // Font size for book titles in pixels (e.g. 8, 9, 10, 11)
  authorSize: 8,         // Font size for author & genre in pixels (e.g. 7, 8, 9)
  headerSize: 9,         // Font size for "READING LIST .." header in pixels
  badgeSize: 7,          // Font size for "reading.." status badge in pixels
  widgetWidth: 288,      // Width of the reading widget card in pixels
  widgetHeight: 300,     // Height of the reading widget card in pixels (increase or decrease to taste)
}

export default function ReadingWidget() {
  const dragControls = useDragControls()

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      className="relative select-none"
      style={{
        zIndex: 5,
        width: READING_CONFIG.widgetWidth,
        height: READING_CONFIG.widgetHeight,
      }}
    >
      <div className="retroui-card overflow-hidden flex flex-col h-full">
        <div
          className="flex-none flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ height: 22, background: "var(--drag-handle-bg)", borderBottom: "1px solid var(--separator)" }}
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div style={{ width: 24, height: 2, borderRadius: 1, background: "var(--text-faint)" }} />
        </div>

        <div className="flex-1 flex flex-col px-3 pt-3 pb-2.5 min-h-0 overflow-hidden">
          <div
            className="flex-none pb-2 mb-2 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--separator)" }}
          >
            <h2
              className="font-mono font-bold uppercase tracking-wider whitespace-nowrap"
              style={{ color: "var(--text-secondary)", fontSize: `${READING_CONFIG.headerSize}px` }}
            >
              READING LIST ..
            </h2>
            <span
              className="font-mono"
              style={{ color: "var(--text-muted)", fontSize: `${READING_CONFIG.headerSize}px` }}
            >
              {books.length}
            </span>
          </div>

          <div
            className="flex-1 overflow-y-auto pr-1 mac-scrollbar"
            style={{ overscrollBehavior: "contain" }}
          >
            {books.map((book, i) => (
              <div
                key={i}
                className="py-1.5 first:pt-0 last:pb-0.5 group"
                style={{
                  borderBottom: i === books.length - 1 ? "none" : "1px solid var(--separator)"
                }}
              >
                <div className="flex items-center justify-between gap-1.5 mb-0.5">
                  <h3
                    className="font-minecraft leading-snug transition-colors duration-200 cursor-default truncate text-[var(--text-primary)] group-hover:text-[var(--accent)]"
                    style={{ fontSize: `${READING_CONFIG.bookTitleSize}px` }}
                  >
                    {book.title}
                  </h3>
                  {book.status === "reading" && (
                    <span
                      className="flex-none inline-flex items-center gap-1 font-minecraft px-1.5 py-0.5 rounded-full font-medium"
                      style={{
                        background: "var(--accent-subtle)",
                        color: "var(--indicator-color)",
                        border: "1px solid var(--indicator-color)",
                        fontSize: `${READING_CONFIG.badgeSize}px`,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--indicator-color)" }} />
                      reading..
                    </span>
                  )}
                </div>
                <p
                  className="font-minecraft truncate"
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: `${READING_CONFIG.authorSize}px`
                  }}
                >
                  {book.author} <span style={{ opacity: 0.5 }}>·</span> {book.genre}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

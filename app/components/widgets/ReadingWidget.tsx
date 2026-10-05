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
      style={{ zIndex: 5, width: 200 }}
    >
      <div className="widget-handle" onPointerDown={(e) => dragControls.start(e)}>
        <div style={{ width: 24, height: 2, borderRadius: 1, background: "var(--text-faint)" }} />
      </div>

      <div className="widget-body px-3 pt-3 pb-2.5">
        <div 
          className="pb-2.5 mb-2.5 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--separator)" }}
        >
          <h2 
            className="font-mono text-[9px] font-bold uppercase tracking-widest"
            style={{ color: "var(--text-secondary)" }}
          >
            READING LIST ..
          </h2>
          <span className="font-mono text-[8px]" style={{ color: "var(--text-muted)" }}>
            {books.length}
          </span>
        </div>

        <div 
          className="flex flex-col max-h-[175px] overflow-y-auto pr-1 mac-scrollbar"
          style={{ overscrollBehavior: "contain" }}
        >
          {books.map((book, i) => (
            <div 
              key={i} 
              className="py-2 first:pt-0 last:pb-1 group"
              style={{ 
                borderBottom: i === books.length - 1 ? "none" : "1px solid var(--separator)" 
              }}
            >
              <div className="flex items-center justify-between gap-1.5 mb-0.5">
                <h3 
                  className="text-[10px] font-medium leading-tight transition-colors duration-300 cursor-default truncate text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                >
                  {book.title}
                </h3>
                {book.status === "reading" && (
                  <span 
                    className="flex-none inline-flex items-center gap-1 font-mono text-[7px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{
                      background: "rgba(74, 222, 128, 0.12)",
                      color: "#4ade80",
                      border: "1px solid rgba(74, 222, 128, 0.25)"
                    }}
                  >
                    <span className="w-1 h-1 rounded-full bg-[#4ade80] animate-pulse" />
                    reading..
                  </span>
                )}
              </div>
              <p className="font-mono text-[8px] truncate" style={{ color: "var(--text-primary)", opacity: 0.85 }}>
                {book.author} <span style={{ opacity: 0.5 }}>·</span> {book.genre}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

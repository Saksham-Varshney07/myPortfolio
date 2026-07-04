"use client"

import { motion, useDragControls } from "framer-motion"

const books = [
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
          className="pb-2.5 mb-2.5"
          style={{ borderBottom: "1px solid var(--separator)" }}
        >
          <h2 
            className="font-mono text-[9px] font-bold uppercase tracking-widest"
            style={{ color: "var(--text-secondary)" }}
          >
            RECENTLY READ ..
          </h2>
        </div>

        <div className="flex flex-col">
          {books.map((book, i) => (
            <div 
              key={i} 
              className="py-2 first:pt-0 last:pb-0 group"
              style={{ 
                borderBottom: i === books.length - 1 ? "none" : "1px solid var(--separator)" 
              }}
            >
              <h3 
                className="text-[10px] font-medium leading-tight mb-0.5 transition-colors duration-300 cursor-default truncate text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                {book.title}
              </h3>
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

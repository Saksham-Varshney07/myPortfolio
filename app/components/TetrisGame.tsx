import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { LEVEL_COLORS } from "./GitHubHeatmap"

const CELL = 14
const GAP = 2

const TETROMINOES = [
  { shape: [[1, 1, 1, 1]], color: 4 }, // I
  { shape: [[1, 0, 0], [1, 1, 1]], color: 2 }, // J
  { shape: [[0, 0, 1], [1, 1, 1]], color: 3 }, // L
  { shape: [[1, 1], [1, 1]], color: 4 }, // O
  { shape: [[0, 1, 1], [1, 1, 0]], color: 1 }, // S
  { shape: [[0, 1, 0], [1, 1, 1]], color: 2 }, // T
  { shape: [[1, 1, 0], [0, 1, 1]], color: 3 }, // Z
]

export default function TetrisGame() {
  const [grid, setGrid] = useState<number[][]>(() => Array.from({ length: 20 }, () => Array(10).fill(0)))
  const [active, setActive] = useState<{ x: number; y: number; shape: number[][]; color: number } | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [countdown, setCountdown] = useState<number | null>(3)

  const isValidMove = useCallback(
    (nx: number, ny: number, shape: number[][]) => {
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const newX = nx + c
            const newY = ny + r
            if (newX < 0 || newX >= 10 || newY >= 20) return false
            if (newY >= 0 && grid[newY][newX] !== 0) return false
          }
        }
      }
      return true
    },
    [grid]
  )

  const spawn = useCallback(() => {
    const template = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)]
    const newActive = {
      x: Math.floor((10 - template.shape[0].length) / 2),
      y: 0,
      shape: template.shape,
      color: template.color,
    }
    
    if (!isValidMove(newActive.x, newActive.y, newActive.shape)) {
      setGameOver(true)
      return
    }
    
    setActive(newActive)
  }, [isValidMove])

  const merge = useCallback(() => {
    if (!active) return
    const newGrid = grid.map((r) => [...r])
    for (let r = 0; r < active.shape.length; r++) {
      for (let c = 0; c < active.shape[r].length; c++) {
        if (active.shape[r][c]) {
          newGrid[active.y + r][active.x + c] = active.color
        }
      }
    }

    let cleared = 0
    const finalGrid = newGrid.filter((row) => {
      if (row.every((cell) => cell !== 0)) {
        cleared++
        return false
      }
      return true
    })

    while (finalGrid.length < 20) {
      finalGrid.unshift(Array(10).fill(0))
    }

    if (cleared > 0) setScore((s) => s + cleared * 10)
    setGrid(finalGrid)
    setActive(null)
  }, [active, grid])

  useEffect(() => {
    if (countdown !== null) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => setCountdown(null), 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [countdown])

  useEffect(() => {
    if (!active && !gameOver && countdown === null) {
      spawn()
    }
  }, [active, gameOver, spawn, countdown])

  useEffect(() => {
    if (gameOver || countdown !== null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!active) return
      e.preventDefault()
      if (e.key === "ArrowLeft") {
        if (isValidMove(active.x - 1, active.y, active.shape)) {
          setActive({ ...active, x: active.x - 1 })
        }
      } else if (e.key === "ArrowRight") {
        if (isValidMove(active.x + 1, active.y, active.shape)) {
          setActive({ ...active, x: active.x + 1 })
        }
      } else if (e.key === "ArrowDown") {
        if (isValidMove(active.x, active.y + 1, active.shape)) {
          setActive({ ...active, y: active.y + 1 })
        } else {
          merge()
        }
      } else if (e.key === "ArrowUp") {
        const rotated = active.shape[0].map((_, idx) => active.shape.map((row) => row[idx]).reverse())
        if (isValidMove(active.x, active.y, rotated)) {
          setActive({ ...active, shape: rotated })
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [active, isValidMove, merge, gameOver, countdown])

  useEffect(() => {
    if (gameOver || countdown !== null) return
    const interval = setInterval(() => {
      if (!active) return
      if (isValidMove(active.x, active.y + 1, active.shape)) {
        setActive({ ...active, y: active.y + 1 })
      } else {
        merge()
      }
    }, 500)
    return () => clearInterval(interval)
  }, [active, isValidMove, merge, gameOver, countdown])

  const renderGrid = grid.map((r) => [...r])
  if (active) {
    for (let r = 0; r < active.shape.length; r++) {
      for (let c = 0; c < active.shape[r].length; c++) {
        if (active.shape[r][c] && active.y + r >= 0) {
          renderGrid[active.y + r][active.x + c] = active.color
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center w-full min-w-[200px]">
      <div className="flex justify-between w-full px-2 mb-2">
        <span className="text-[11px] text-[var(--text-secondary)] font-mono">Contributions: {score}</span>
      </div>
      <div className="relative mb-2">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(10, ${CELL}px)`,
            gridTemplateRows: `repeat(20, ${CELL}px)`,
            gap: GAP,
            background: "var(--bg-base)",
            padding: GAP * 2,
            borderRadius: 6,
            border: "1px solid var(--window-border-unfocused)",
          }}
        >
          {renderGrid.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                style={{
                  width: CELL,
                  height: CELL,
                  borderRadius: 2,
                  background: cell === 0 ? "var(--heatmap-empty)" : LEVEL_COLORS[cell],
                }}
              />
            ))
          )}
        </div>
        {countdown !== null && (
          <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center backdrop-blur-sm z-20">
            <motion.span
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="text-white font-bold text-4xl font-mono"
            >
              {countdown === 0 ? "GO!" : countdown}
            </motion.span>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-2">
              <span className="text-white font-bold text-lg tracking-widest font-mono">GAME OVER</span>
              <button
                onClick={() => {
                  setGrid(Array.from({ length: 20 }, () => Array(10).fill(0)))
                  setScore(0)
                  setGameOver(false)
                  setCountdown(3)
                }}
                className="text-[12px] px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded font-mono transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

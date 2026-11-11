"use client"

import { useState, useEffect } from "react"

export interface RevealCountdown {
  daysRemaining: number
  days: number
  hours: number
  minutes: number
  seconds: number
  progress: number
  isRevealed: boolean
  formattedTargetDate: string
}

const MS_PER_DAY = 86_400_000

/**
 * Parses a YYYY-MM-DD string into local midnight to avoid UTC timezone drift.
 */
export function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number)
  return new Date(year, (month || 1) - 1, day || 1, 0, 0, 0, 0)
}

export function getRevealCountdown(
  revealDateIso: string,
  cycleStartIso?: string,
  now: Date = new Date()
): RevealCountdown {
  const target = parseLocalDate(revealDateIso)
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)

  const msRemaining = Math.max(0, target.getTime() - now.getTime())
  const isRevealed = msRemaining === 0

  const daysRemaining = Math.max(
    0,
    Math.round((target.getTime() - todayMidnight.getTime()) / MS_PER_DAY)
  )

  const days = Math.floor(msRemaining / MS_PER_DAY)
  const hours = Math.floor((msRemaining % MS_PER_DAY) / 3_600_000)
  const minutes = Math.floor((msRemaining % 3_600_000) / 60_000)
  const seconds = Math.floor((msRemaining % 60_000) / 1_000)

  let progress = isRevealed ? 1 : 0.14
  if (!isRevealed && cycleStartIso) {
    const start = parseLocalDate(cycleStartIso)
    const totalWindow = target.getTime() - start.getTime()
    if (totalWindow > 0) {
      const elapsed = now.getTime() - start.getTime()
      progress = Math.min(0.98, Math.max(0.1, elapsed / totalWindow))
    }
  }

  const formattedTargetDate = target.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })

  return {
    daysRemaining,
    days,
    hours,
    minutes,
    seconds,
    progress,
    isRevealed,
    formattedTargetDate,
  }
}

export function formatRevealingLabel(countdown: RevealCountdown | null): string {
  if (!countdown) return "revealing in -- days"
  if (countdown.isRevealed) return "decryption ready"
  return `revealing in ${countdown.daysRemaining} ${countdown.daysRemaining === 1 ? "day" : "days"}`
}

export function useRevealCountdown(
  revealDateIso?: string,
  cycleStartIso?: string,
  tickMs = 60_000
): RevealCountdown | null {
  const [countdown, setCountdown] = useState<RevealCountdown | null>(null)

  useEffect(() => {
    if (!revealDateIso) return
    const update = () => setCountdown(getRevealCountdown(revealDateIso, cycleStartIso))
    update()
    const id = setInterval(update, tickMs)
    return () => clearInterval(id)
  }, [revealDateIso, cycleStartIso, tickMs])

  return countdown
}


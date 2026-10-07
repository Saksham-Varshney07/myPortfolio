import { NextResponse } from "next/server"
import { siteConfig } from "@/config/siteConfig"

export const revalidate = 21600

interface ContributionItem {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

let memoryCache: {
  contributions: ContributionItem[]
  total: Record<string, number>
  timestamp: number
} | null = null

// Fallback scraper directly from GitHub public profile HTML
async function fetchDirectFromGitHub(username: string): Promise<{ contributions: ContributionItem[]; total: Record<string, number> }> {
  const res = await fetch(`https://github.com/users/${username}/contributions`, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(6000),
  })
  if (!res.ok) throw new Error("GitHub profile direct fetch failed")
  const html = await res.text()

  const cellRegex = /<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"[^>]*id="([^"]+)"/g
  const tooltipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g

  const tooltipMap = new Map<string, number>()
  let tMatch: RegExpExecArray | null
  while ((tMatch = tooltipRegex.exec(html)) !== null) {
    const id = tMatch[1]
    const text = tMatch[2]
    const countMatch = text.match(/^(\d+)\s+contribution/)
    tooltipMap.set(id, countMatch ? parseInt(countMatch[1], 10) : 0)
  }

  const contributions: ContributionItem[] = []
  let cMatch: RegExpExecArray | null
  let totalCount = 0

  while ((cMatch = cellRegex.exec(html)) !== null) {
    const date = cMatch[1]
    const level = parseInt(cMatch[2], 10) as 0 | 1 | 2 | 3 | 4
    const cellId = cMatch[3]
    const count = tooltipMap.get(cellId) ?? (level > 0 ? level * 2 : 0)
    totalCount += count
    contributions.push({ date, count, level })
  }

  if (contributions.length === 0) throw new Error("No contribution cells found in GitHub HTML")

  return {
    contributions,
    total: { lastYear: totalCount },
  }
}

export async function GET() {
  const username = siteConfig.social.githubUsername

  // 1. Try Jogruber's API first
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      {
        next: { revalidate: 21600 },
        signal: AbortSignal.timeout(5000),
      }
    )
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data.contributions) && data.contributions.length > 0) {
        memoryCache = {
          contributions: data.contributions,
          total: data.total || { lastYear: 0 },
          timestamp: Date.now(),
        }
        return NextResponse.json({
          contributions: data.contributions,
          total: data.total,
        })
      }
    }
  } catch {
    // Silently fall through to secondary fallback
  }

  // 2. Try direct GitHub HTML scrape
  try {
    const directData = await fetchDirectFromGitHub(username)
    memoryCache = {
      contributions: directData.contributions,
      total: directData.total,
      timestamp: Date.now(),
    }
    return NextResponse.json(directData)
  } catch {
    // Silently fall through to memory cache or fallback
  }

  // 3. Return memory cache if available
  if (memoryCache && memoryCache.contributions.length > 0) {
    return NextResponse.json({
      contributions: memoryCache.contributions,
      total: memoryCache.total,
    })
  }

  // 4. Return graceful fallback empty state if all else fails
  return NextResponse.json({ contributions: [], total: {} })
}

import { NextResponse } from "next/server"
import { siteConfig } from "@/config/siteConfig"

export const revalidate = 21600

export async function GET() {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${siteConfig.social.githubUsername}?y=last`,
      { next: { revalidate: 21600 } }
    )
    if (!res.ok) throw new Error("upstream error")
    const data = await res.json()
    return NextResponse.json({
      contributions: data.contributions as { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[],
      total: data.total as Record<string, number>,
    })
  } catch {
    return NextResponse.json({ contributions: [], total: {} })
  }
}

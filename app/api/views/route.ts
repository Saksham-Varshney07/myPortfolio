import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return NextResponse.json({ count: null })
  }

  try {
    const res = await fetch(`${url}/incr/portfolio:views`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    const data = await res.json()
    return NextResponse.json({ count: data.result as number })
  } catch {
    return NextResponse.json({ count: null })
  }
}

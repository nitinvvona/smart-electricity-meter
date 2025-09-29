"use client"

import useSWR from "swr"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area } from "recharts"
import { useEffect, useMemo, useState } from "react"

type Point = {
  period: string
  kwh: number
  cost: number
}

type LivePoint = Point & { kwhLive?: number; kwhCum?: number; kwhLiveProgress?: number }

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function UsageCharts({ granularity }: { granularity: "daily" | "monthly" | "yearly" }) {
  const { data } = useSWR<{ points: Point[] }>(`/api/analytics?granularity=${granularity}`, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 0,
  })

  const points = data?.points ?? []

  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 1000000), 800)
    return () => clearInterval(id)
  }, [])

  const [progress, setProgress] = useState(0) // 0..(points.length-1) with fractional part
  useEffect(() => {
    if (points.length === 0) return
    let raf = 0
    const speed = 0.015 // tweak for faster/slower motion (points per frame)
    const step = () => {
      setProgress((p) => {
        const max = Math.max(0, points.length - 1)
        let next = p + speed
        if (next > max) next = 0 // loop when reaching the end
        return next
      })
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [points.length])

  const liveData: LivePoint[] = useMemo(() => {
    if (points.length === 0) return points as LivePoint[]
    const cursor = tick % points.length
    const peakBump = 0.08 // up to +8%
    const decay = 0.25 // how quickly the bump fades behind the cursor

    return points.map((p, i) => {
      const distance = Math.max(0, cursor - i)
      const factor = i <= cursor ? Math.max(0, 1 - distance * decay) : 0
      const bump = peakBump * factor
      return {
        ...p,
        kwhLive: p.kwh * (1 + bump),
      }
    })
  }, [points, tick])

  const cumulative = useMemo(() => {
    let acc = 0
    return points.map((p) => {
      acc += p.kwh
      return { ...p, kwhCum: acc } as LivePoint & { kwhCum: number }
    })
  }, [points])

  const liveProgressData = useMemo(() => {
    if (cumulative.length === 0) return [] as Array<LivePoint & { kwhLiveProgress?: number }>
    const maxIdx = cumulative.length - 1
    const idx = Math.floor(progress)
    const frac = progress - idx
    return cumulative.map((p, i) => {
      if (i < idx) {
        return { ...p, kwhLiveProgress: (p as any).kwhCum as number }
      }
      if (i === idx) {
        const y0 = (cumulative[idx] as any).kwhCum as number
        const y1 = (cumulative[Math.min(idx + 1, maxIdx)] as any).kwhCum as number
        const y = idx < maxIdx ? y0 + (y1 - y0) * frac : y0
        return { ...p, kwhLiveProgress: y }
      }
      return { ...p, kwhLiveProgress: undefined }
    })
  }, [cumulative, progress])

  const mergedData = useMemo(() => {
    if (liveData.length === 0) return liveProgressData as any
    return liveData.map((p, i) => ({ ...p, ...(liveProgressData[i] ?? {}) }))
  }, [liveData, liveProgressData])

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mergedData}>
          <CartesianGrid stroke="hsl(var(--muted) / 0.2)" vertical={false} />
          <XAxis dataKey="period" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "oklch(var(--color-card))",
              border: "1px solid oklch(var(--color-border))",
            }}
          />
          <Area
            type="monotone"
            dataKey="kwhLiveProgress"
            fill="oklch(var(--color-chart-3))"
            fillOpacity={0.15}
            stroke="none"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="kwhLiveProgress"
            stroke="oklch(var(--color-chart-3))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            name="Live (progress)"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="kwh"
            stroke="oklch(var(--color-chart-1))"
            strokeWidth={2}
            dot={false}
            name="kWh"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="cost"
            stroke="oklch(var(--color-chart-2))"
            strokeWidth={2}
            dot={false}
            name="Cost"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="kwhLive"
            stroke="oklch(var(--color-chart-3))"
            strokeWidth={2}
            dot={false}
            name="Live (bump)"
            isAnimationActive={false}
            strokeDasharray="6 4"
            opacity={0.4}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

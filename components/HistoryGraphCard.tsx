"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import useSWR from "swr"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Period = "day" | "month" | "year"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const formatXAxis = (period: Period, value: string) => {
  switch (period) {
    case "day":
      // For day view, show hours (0-23)
      return value.split("T")[1].substring(0, 2) + "h"
    case "month":
      // For month view, show day of month
      return new Date(value).getDate().toString()
    case "year":
      // For year view, show month abbreviation
      return new Date(value).toLocaleDateString("en-US", { month: "short" })
    default:
      return value
  }
}

const getPeriodLabel = (period: Period) => {
  const now = new Date()
  switch (period) {
    case "day":
      return now.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    case "month":
      return now.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    case "year":
      return now.getFullYear().toString()
    default:
      return ""
  }
}

export function HistoryGraphCard() {
  const [period, setPeriod] = useState<Period>("day")
  
  const { data, error } = useSWR(`/api/power-usage?period=${period}`, fetcher, {
    refreshInterval: 0, // Only refresh on demand or page reload
  })
  
  const chartData = data?.historical || []
  
  return (
    <Card className="bg-white dark:bg-slate-950 shadow-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>📈 Detailed Power Usage History</CardTitle>
        <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => formatXAxis(period, value)}
                label={{ 
                  value: getPeriodLabel(period), 
                  position: "insideBottom", 
                  offset: -15 
                }}
              />
              <YAxis label={{ value: "Watts", angle: -90, position: "insideLeft" }} />
              <Tooltip 
                formatter={(value) => [`${value} W`, "Power Usage"]}
                labelFormatter={(label) => new Date(label).toLocaleString()}
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.8)", 
                  borderRadius: "8px", 
                  border: "1px solid rgba(255, 215, 0, 0.3)",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#ffd700" 
                fill="url(#colorGradient)" 
                strokeWidth={2}
                isAnimationActive={true}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffd700" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ffd700" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
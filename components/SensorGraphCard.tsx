"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

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

export function SensorGraphCard() {
  const [period, setPeriod] = useState<Period>("day")
  
  const { data, error } = useSWR(`/api/power-usage?period=${period}`, fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds
  })
  
  const chartData = data?.historical || []
  
  return (
    <Card className="bg-white dark:bg-slate-950 shadow-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>📊 Power Usage Trends</CardTitle>
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
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
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
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: "#f59e0b" }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
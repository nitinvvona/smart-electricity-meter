"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type GaugeProps = {
  value: number
  min: number
  max: number
  label: string
}

type ExtendedGaugeProps = GaugeProps & {
  totalEnergy?: number
}

const Gauge = ({ value, min, max, label, totalEnergy }: ExtendedGaugeProps) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

  const getColor = () => {
    if (value <= 1000) return "#10b981"
    if (value <= 2000) return "#f59e0b"
    return "#ef4444"
  }

  const rotation = (percentage / 100) * 180 - 90

  const ELECTRICITY_RATE = 85
  const energyKwh = value / 1000
  const costEstimate = energyKwh * ELECTRICITY_RATE

  return (
    <div className="space-y-6">
      <div className="relative w-full h-40 flex flex-col items-center justify-end">
        {/* Gauge background */}
        <div className="absolute bottom-0 w-64 h-32 bg-slate-100 dark:bg-slate-800 rounded-t-full overflow-hidden">
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-green-500 opacity-20" />
          <div className="absolute bottom-0 left-1/3 w-1/3 h-full bg-yellow-500 opacity-20" />
          <div className="absolute bottom-0 left-2/3 w-1/3 h-full bg-red-500 opacity-20" />
        </div>

        {/* Gauge needle */}
        <div
          className="absolute bottom-0 w-1 h-28 bg-gray-800 dark:bg-gray-200 origin-bottom transform transition-transform duration-700 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-3 h-3 rounded-full bg-gray-800 dark:bg-gray-200 -ml-1 -mt-1"></div>
        </div>

        {/* Gauge center point */}
        <div className="absolute bottom-0 w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full transform -translate-x-1/2"></div>

        {/* Min/Max labels - positioned at the ends */}
        <div className="absolute bottom-0 w-64 flex justify-between transform translate-y-2">
          <span className="text-xs">{min}</span>
          <span className="text-xs">{max}</span>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        <div className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
          <span className="font-medium">Total Energy:</span>
          <span className="font-semibold text-amber-500">
            {totalEnergy ? totalEnergy.toFixed(4) : (value / 1000).toFixed(4)} kWh
          </span>
        </div>
        <div className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
          <span className="font-medium">Cost Estimate:</span>
          <span className="font-semibold text-amber-500">
            ₹ {(totalEnergy ? totalEnergy * ELECTRICITY_RATE : costEstimate).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

export function GaugeCard({ totalEnergy }: { totalEnergy?: number }) {
  const { data, error } = useSWR('/api/power-usage', fetcher, {
    refreshInterval: 2000, // Refresh every 2 seconds
  })

  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    if (data?.current?.power) {
      setCurrentValue(data.current.power)
    }
  }, [data])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>⚡ Real-time Electricity Use</CardTitle>
      </CardHeader>
      <CardContent>
        <Gauge 
          value={currentValue} 
          min={0} 
          max={5000} 
          label="" 
          totalEnergy={totalEnergy}
        />
      </CardContent>
    </Card>
  )
}

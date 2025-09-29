"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

type DailyData = {
  Date: string
  AC_Daily_kWh: number
  Fan_Daily_kWh: number
  Heater_Daily_kWh: number
  Total_Daily_kWh: number
  Avg_Power_W: number
  Peak_Power_W: number
}

export function DailyEnergyChart() {
  const [data, setData] = useState<DailyData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For this example, we'll use the static data
    const fetchData = async () => {
      try {
        // This is simulating fetching the data from an API
        // In a real app, you would use fetch() to get the data from your backend
        const dailyData: DailyData[] = [
          {"Date":"2025-09-01","AC_Daily_kWh":9.04,"Fan_Daily_kWh":3.91,"Heater_Daily_kWh":0.39,"Total_Daily_kWh":13.33,"Avg_Power_W":555.56,"Peak_Power_W":1322.32},
          {"Date":"2025-09-02","AC_Daily_kWh":6.44,"Fan_Daily_kWh":5.04,"Heater_Daily_kWh":0.39,"Total_Daily_kWh":11.87,"Avg_Power_W":494.53,"Peak_Power_W":1057.32},
          {"Date":"2025-09-03","AC_Daily_kWh":9.21,"Fan_Daily_kWh":4.23,"Heater_Daily_kWh":0.89,"Total_Daily_kWh":14.33,"Avg_Power_W":597.22,"Peak_Power_W":1465.03},
          {"Date":"2025-09-04","AC_Daily_kWh":5.24,"Fan_Daily_kWh":3.6,"Heater_Daily_kWh":0.48,"Total_Daily_kWh":9.33,"Avg_Power_W":388.82,"Peak_Power_W":1021.21},
          {"Date":"2025-09-05","AC_Daily_kWh":6.74,"Fan_Daily_kWh":4.94,"Heater_Daily_kWh":1.78,"Total_Daily_kWh":13.46,"Avg_Power_W":560.81,"Peak_Power_W":1176.18},
          {"Date":"2025-09-06","AC_Daily_kWh":7.41,"Fan_Daily_kWh":4.59,"Heater_Daily_kWh":1.75,"Total_Daily_kWh":13.75,"Avg_Power_W":572.74,"Peak_Power_W":1452.4},
          {"Date":"2025-09-07","AC_Daily_kWh":9.71,"Fan_Daily_kWh":4.53,"Heater_Daily_kWh":0.39,"Total_Daily_kWh":14.63,"Avg_Power_W":609.57,"Peak_Power_W":1282.61},
          {"Date":"2025-09-08","AC_Daily_kWh":6.97,"Fan_Daily_kWh":5.27,"Heater_Daily_kWh":0.0,"Total_Daily_kWh":12.24,"Avg_Power_W":509.99,"Peak_Power_W":1074.93},
          {"Date":"2025-09-09","AC_Daily_kWh":5.94,"Fan_Daily_kWh":5.32,"Heater_Daily_kWh":0.46,"Total_Daily_kWh":11.72,"Avg_Power_W":488.29,"Peak_Power_W":1168.1},
          {"Date":"2025-09-10","AC_Daily_kWh":4.77,"Fan_Daily_kWh":3.21,"Heater_Daily_kWh":0.0,"Total_Daily_kWh":7.98,"Avg_Power_W":332.69,"Peak_Power_W":1007.23},
          {"Date":"2025-09-11","AC_Daily_kWh":6.84,"Fan_Daily_kWh":4.88,"Heater_Daily_kWh":0.89,"Total_Daily_kWh":12.61,"Avg_Power_W":525.3,"Peak_Power_W":1041.19},
          {"Date":"2025-09-12","AC_Daily_kWh":6.94,"Fan_Daily_kWh":3.93,"Heater_Daily_kWh":1.22,"Total_Daily_kWh":12.08,"Avg_Power_W":503.49,"Peak_Power_W":1330.99},
          {"Date":"2025-09-13","AC_Daily_kWh":10.27,"Fan_Daily_kWh":5.05,"Heater_Daily_kWh":1.77,"Total_Daily_kWh":17.09,"Avg_Power_W":712.0,"Peak_Power_W":1072.06},
          {"Date":"2025-09-14","AC_Daily_kWh":6.64,"Fan_Daily_kWh":4.37,"Heater_Daily_kWh":1.37,"Total_Daily_kWh":12.38,"Avg_Power_W":515.9,"Peak_Power_W":1462.62},
          {"Date":"2025-09-15","AC_Daily_kWh":9.34,"Fan_Daily_kWh":3.96,"Heater_Daily_kWh":0.92,"Total_Daily_kWh":14.23,"Avg_Power_W":592.84,"Peak_Power_W":1565.73}
        ]
        
        setData(dailyData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching daily energy data:", error)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  if (loading) {
    return (
      <Card className="bg-white dark:bg-slate-950 shadow-md">
        <CardHeader>
          <CardTitle>📊 Daily Energy Consumption</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
            <p>Loading chart data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="bg-white dark:bg-slate-950 shadow-md">
      <CardHeader>
        <CardTitle>📊 Daily Energy Consumption</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="Date" 
                tickFormatter={(value) => new Date(value).getDate().toString()}
                label={{ 
                  value: "September 2025", 
                  position: "insideBottom", 
                  offset: -10 
                }}
              />
              <YAxis label={{ value: "Energy (kWh)", angle: -90, position: "insideLeft" }} />
              <Tooltip 
                formatter={(value) => [`${Number(value).toFixed(2)} kWh`, undefined]}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.8)", 
                  borderRadius: "8px", 
                  border: "1px solid rgba(255, 215, 0, 0.3)",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Area 
                type="monotone" 
                dataKey="AC_Daily_kWh" 
                name="AC Unit"
                stackId="1"
                stroke="#1FB8CD" 
                fill="#1FB8CD" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="Fan_Daily_kWh" 
                name="Fan"
                stackId="1"
                stroke="#DB4545" 
                fill="#DB4545" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="Heater_Daily_kWh" 
                name="Heater"
                stackId="1"
                stroke="#2E8B57" 
                fill="#2E8B57" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
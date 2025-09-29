"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

type HourlyData = {
  Hour: number
  AC_Unit_Power_W: number
  Fan_Power_W: number
  Heater_Power_W: number
  Total_Power_W: number
}

export function HourlyPowerChart() {
  const [data, setData] = useState<HourlyData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For this example, we'll use the static data
    const fetchData = async () => {
      try {
        // This is simulating fetching the data from an API
        // In a real app, you would use fetch() to get the data from your backend
        const hourlyData: HourlyData[] = [
          {"Hour":0,"AC_Unit_Power_W":108.42,"Fan_Power_W":187.6,"Heater_Power_W":15.27,"Total_Power_W":311.29},
          {"Hour":1,"AC_Unit_Power_W":45.06,"Fan_Power_W":214.9,"Heater_Power_W":0.0,"Total_Power_W":259.96},
          {"Hour":2,"AC_Unit_Power_W":88.67,"Fan_Power_W":195.07,"Heater_Power_W":44.61,"Total_Power_W":328.34},
          {"Hour":3,"AC_Unit_Power_W":87.9,"Fan_Power_W":179.32,"Heater_Power_W":0.0,"Total_Power_W":267.22},
          {"Hour":4,"AC_Unit_Power_W":94.1,"Fan_Power_W":220.1,"Heater_Power_W":0.0,"Total_Power_W":314.2},
          {"Hour":5,"AC_Unit_Power_W":45.83,"Fan_Power_W":119.14,"Heater_Power_W":92.93,"Total_Power_W":257.9},
          {"Hour":6,"AC_Unit_Power_W":244.17,"Fan_Power_W":208.66,"Heater_Power_W":126.85,"Total_Power_W":579.68},
          {"Hour":7,"AC_Unit_Power_W":200.02,"Fan_Power_W":79.19,"Heater_Power_W":159.91,"Total_Power_W":439.12},
          {"Hour":8,"AC_Unit_Power_W":41.25,"Fan_Power_W":65.32,"Heater_Power_W":0.0,"Total_Power_W":106.56},
          {"Hour":9,"AC_Unit_Power_W":238.47,"Fan_Power_W":192.95,"Heater_Power_W":30.14,"Total_Power_W":461.55},
          {"Hour":10,"AC_Unit_Power_W":546.78,"Fan_Power_W":157.9,"Heater_Power_W":15.58,"Total_Power_W":720.25},
          {"Hour":11,"AC_Unit_Power_W":574.21,"Fan_Power_W":209.55,"Heater_Power_W":14.74,"Total_Power_W":798.5},
          {"Hour":12,"AC_Unit_Power_W":533.14,"Fan_Power_W":201.09,"Heater_Power_W":44.35,"Total_Power_W":778.57},
          {"Hour":13,"AC_Unit_Power_W":434.38,"Fan_Power_W":195.53,"Heater_Power_W":0.0,"Total_Power_W":629.91},
          {"Hour":14,"AC_Unit_Power_W":570.41,"Fan_Power_W":186.26,"Heater_Power_W":13.85,"Total_Power_W":770.52},
          {"Hour":15,"AC_Unit_Power_W":561.54,"Fan_Power_W":180.88,"Heater_Power_W":29.06,"Total_Power_W":771.48},
          {"Hour":16,"AC_Unit_Power_W":565.91,"Fan_Power_W":146.21,"Heater_Power_W":29.9,"Total_Power_W":742.01},
          {"Hour":17,"AC_Unit_Power_W":349.29,"Fan_Power_W":190.83,"Heater_Power_W":62.11,"Total_Power_W":602.23},
          {"Hour":18,"AC_Unit_Power_W":434.49,"Fan_Power_W":171.71,"Heater_Power_W":30.03,"Total_Power_W":636.22},
          {"Hour":19,"AC_Unit_Power_W":438.75,"Fan_Power_W":275.42,"Heater_Power_W":0.0,"Total_Power_W":714.17},
          {"Hour":20,"AC_Unit_Power_W":332.46,"Fan_Power_W":296.36,"Heater_Power_W":13.93,"Total_Power_W":642.75},
          {"Hour":21,"AC_Unit_Power_W":489.47,"Fan_Power_W":182.34,"Heater_Power_W":54.87,"Total_Power_W":726.68},
          {"Hour":22,"AC_Unit_Power_W":417.85,"Fan_Power_W":231.0,"Heater_Power_W":99.3,"Total_Power_W":748.15},
          {"Hour":23,"AC_Unit_Power_W":89.93,"Fan_Power_W":265.83,"Heater_Power_W":56.36,"Total_Power_W":412.12}
        ]
        
        setData(hourlyData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching hourly power data:", error)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  if (loading) {
    return (
      <Card className="bg-white dark:bg-slate-950 shadow-md">
        <CardHeader>
          <CardTitle>⚡ Hourly Power Usage</CardTitle>
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
        <CardTitle>⚡ Hourly Power Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="Hour" 
                tickFormatter={(value) => `${value}:00`}
                label={{ 
                  value: "Hour of Day", 
                  position: "insideBottom", 
                  offset: -10 
                }}
              />
              <YAxis label={{ value: "Power (W)", angle: -90, position: "insideLeft" }} />
              <Tooltip 
                formatter={(value) => [`${Number(value).toFixed(1)} W`, undefined]}
                labelFormatter={(label) => `${label}:00`}
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.8)", 
                  borderRadius: "8px", 
                  border: "1px solid rgba(255, 215, 0, 0.3)",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line 
                type="monotone" 
                dataKey="AC_Unit_Power_W" 
                name="AC Unit"
                stroke="#1FB8CD" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="Fan_Power_W" 
                name="Fan"
                stroke="#DB4545" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="Heater_Power_W" 
                name="Heater"
                stroke="#2E8B57" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="Total_Power_W" 
                name="Total"
                stroke="#5D878F" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
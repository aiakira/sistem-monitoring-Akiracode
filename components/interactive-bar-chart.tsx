"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3 } from "lucide-react"

interface ChartData {
  name: string
  aqi: number
  co: number
  co2: number
  temperature: number
}

interface InteractiveBarChartProps {
  data: ChartData[]
}

export function InteractiveBarChart({ data }: InteractiveBarChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("co2")

  const metricConfig = {
    co2: {
      label: "CO2 (ppm)",
      color: "#0ea5e9",
      dataKey: "co2",
    },
    co: {
      label: "CO (ppm)",
      color: "#f97316",
      dataKey: "co",
    },
    aqi: {
      label: "AQI",
      color: "#8b5cf6",
      dataKey: "aqi",
    },
    temperature: {
      label: "Suhu (°C)",
      color: "#ef4444",
      dataKey: "temperature",
    },
  }

  const currentConfig = metricConfig[selectedMetric as keyof typeof metricConfig]

  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Grafik Interaktif Mingguan
            </h3>
            <p className="text-white/70 text-sm mt-1">Pilih parameter untuk melihat trend mingguan</p>
          </div>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
              <SelectItem value="co2">CO2 (ppm)</SelectItem>
              <SelectItem value="co">CO (ppm)</SelectItem>
              <SelectItem value="aqi">AQI</SelectItem>
              <SelectItem value="temperature">Suhu (°C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-6">
        <div className="h-[300px] w-full">
          <ChartContainer
            config={{
              [currentConfig.dataKey]: {
                label: currentConfig.label,
                color: currentConfig.color,
              },
            }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                <XAxis dataKey="name" stroke="#ffffff" fontSize={12} tick={{ fill: "#ffffff", fontSize: 12 }} />
                <YAxis stroke="#ffffff" fontSize={12} tick={{ fill: "#ffffff", fontSize: 12 }} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Bar
                  dataKey={currentConfig.dataKey}
                  fill={`url(#${currentConfig.dataKey}Gradient)`}
                  radius={[4, 4, 0, 0]}
                  className="drop-shadow-lg"
                />
                <defs>
                  <linearGradient id={`${currentConfig.dataKey}Gradient`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={currentConfig.color} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={currentConfig.color} stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}

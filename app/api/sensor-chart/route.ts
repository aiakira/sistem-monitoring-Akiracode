import { db } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { rows } = await db.sql`
      SELECT
        DATE_TRUNC('hour', created_at) + 
        INTERVAL '5 min' * (EXTRACT(MINUTE FROM created_at)::int / 5) as time_interval,
        AVG(temperature) as temperature,
        AVG(humidity) as humidity,
        AVG(mq135) as mq135,
        AVG(mq7) as mq7
      FROM sensor_readings
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY time_interval
      ORDER BY time_interval DESC
      LIMIT 100;
    `

    const chartData = rows
      .map((row) => ({
        time: row.time_interval,
        mq135: Number(row.mq135),
        mq7: Number(row.mq7),
        temperature: Number(row.temperature),
        humidity: Number(row.humidity),
        timestamp: row.time_interval,
      }))
      .reverse()

    return NextResponse.json(
      {
        data: chartData,
        interval: '5min',
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("API Error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
} 
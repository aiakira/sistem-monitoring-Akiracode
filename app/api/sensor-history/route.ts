import { db } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const interval = searchParams.get('interval') || 'daily' // 'daily' atau '10min'

    let query
    if (interval === '10min') {
      // Data untuk grafik dengan interval 10 menit
      query = `
        SELECT
          DATE_TRUNC('hour', created_at) + 
          INTERVAL '10 min' * (EXTRACT(MINUTE FROM created_at)::int / 10) as time_interval,
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
    } else {
      // Data rata-rata harian (default)
      query = `
        SELECT
          DATE(created_at) as date,
          AVG(temperature) as temperature,
          AVG(humidity) as humidity,
          AVG(mq135) as mq135,
          AVG(mq7) as mq7
        FROM sensor_readings
        GROUP BY DATE(created_at)
        ORDER BY date DESC;
      `
    }

    const { rows } = await db.sql`${query}`

    const historyData = rows
      .map((row) => ({
        time: interval === '10min' ? row.time_interval : row.date,
        mq135: Number(row.mq135),
        mq7: Number(row.mq7),
        temperature: Number(row.temperature),
        humidity: Number(row.humidity),
        timestamp: interval === '10min' ? row.time_interval : row.date,
      }))
      .reverse()

    return NextResponse.json(
      {
        data: historyData,
        interval: interval,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("API Error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

import { db } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { rows } = await db.sql`
      SELECT temperature, humidity, mq135, mq7, created_at
      FROM sensor_readings 
      ORDER BY created_at DESC 
      LIMIT 20;
    `

    const historyData = rows
      .map((row) => ({
        time: new Date(row.created_at).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        mq135: Number(row.mq135),
        mq7: Number(row.mq7),
        temperature: Number(row.temperature),
        humidity: Number(row.humidity),
        timestamp: row.created_at,
      }))
      .reverse()

    return NextResponse.json(
      {
        data: historyData,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("API Error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

import { db } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { rows } = await db.sql`
      SELECT temperature, humidity, mq135, mq7, created_at
      FROM sensor_readings 
      ORDER BY created_at DESC 
      LIMIT 1;
    `

    if (rows.length === 0) {
      return NextResponse.json(
        {
          data: {
            temperature: 28.5,
            humidity: 65.2,
            mq135: 120.5,
            mq7: 80.3,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 200 },
      )
    }

    const latestData = rows[0]
    return NextResponse.json(
      {
        data: {
          temperature: Number(latestData.temperature),
          humidity: Number(latestData.humidity),
          mq135: Number(latestData.mq135),
          mq7: Number(latestData.mq7),
          timestamp: latestData.created_at,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("API Error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { temperature, humidity, mq135, mq7 } = body

    await db.sql`
      INSERT INTO sensor_readings (temperature, humidity, mq135, mq7)
      VALUES (${temperature}, ${humidity}, ${mq135}, ${mq7})
    `

    return NextResponse.json(
      { message: "Data berhasil disimpan" },
      { status: 201 },
    )
  } catch (error) {
    console.error("API Error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

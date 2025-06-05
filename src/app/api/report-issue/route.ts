import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { sessionId, description, url, timestamp } = await request.json()
    // 确保 logs 目录存在
    const logsDir = path.resolve(process.cwd(), 'logs')
    await fs.mkdir(logsDir, { recursive: true })

    // 追加日志行
    const logPath = path.join(logsDir, 'report-issues.log')
    const safeDesc = description.replace(/\n/g, ' ')
    const logLine = `${timestamp} | session=${sessionId} | url=${url} | desc=${safeDesc}\n`
    await fs.appendFile(logPath, logLine)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Report-issue error:', err)
    return NextResponse.json({ error: 'Failed to log issue' }, { status: 500 })
  }
}

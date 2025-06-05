// src/app/api/get-ad-video/route.ts
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const adDir = path.resolve(process.cwd(), 'public/video/ad')
    
    // 确保广告目录存在
    try {
      await fs.access(adDir)
    } catch {
      // 如果目录不存在，创建它
      await fs.mkdir(adDir, { recursive: true })
      return NextResponse.json({ 
        error: 'No ads available. Please add video files to /public/video/ad/' 
      }, { status: 404 })
    }
    
    // 读取广告视频文件
    const files = await fs.readdir(adDir)
    const videoFiles = files.filter(file => 
      /\.(mp4|webm|ogg|mov|avi)$/i.test(file)
    )
    
    if (videoFiles.length === 0) {
      return NextResponse.json({ 
        error: 'No video files found in /public/video/ad/' 
      }, { status: 404 })
    }
    
    // 随机选择一个广告视频
    const selectedVideo = videoFiles[Math.floor(Math.random() * videoFiles.length)]
    const videoPath = `/video/ad/${selectedVideo}`
    
    return NextResponse.json({ 
      videoPath,
      filename: selectedVideo 
    })
    
  } catch (error) {
    console.error('Get ad video error:', error)
    return NextResponse.json({ 
      error: 'Failed to get ad video' 
    }, { status: 500 })
  }
}

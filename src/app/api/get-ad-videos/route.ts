// src/app/api/get-ad-videos/route.ts
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

interface AdVideo {
  path: string
  filename: string
  duration?: number
}

export async function GET() {
  try {
    const adDir = path.resolve(process.cwd(), 'public/video/ad')
    
    // 确保广告目录存在
    try {
      await fs.access(adDir)
    } catch {
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
    
    // 🔧 修复：不进行排序，保持文件系统原始顺序，然后随机选择
    console.log('原始文件顺序:', videoFiles)
    
    // 构建视频对象数组
    const videos: AdVideo[] = videoFiles.map(filename => ({
      path: `/video/ad/${filename}`,
      filename: filename
    }))
    
    console.log('构建的视频数组:', videos.map(v => v.filename))
    
    // 🔧 增强随机选择广告逻辑
    let selectedVideos: AdVideo[]
    
    // 添加时间戳作为随机种子，确保真正随机
    const randomSeed = Date.now() + Math.random() * 1000
    console.log('随机种子:', randomSeed)
    
    if (videos.length === 1) {
      // 只有一个广告，直接使用
      selectedVideos = [videos[0]]
      console.log('只有一个广告文件')
    } else if (videos.length >= 2) {
      // 多次随机化确保真正随机
      const shuffledVideos = [...videos]
      
      // Fisher-Yates 洗牌算法确保真正随机
      for (let i = shuffledVideos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffledVideos[i], shuffledVideos[j]] = [shuffledVideos[j], shuffledVideos[i]]
      }
      
      console.log('洗牌后的视频顺序:', shuffledVideos.map(v => v.filename))
      
      // 选择前两个
      selectedVideos = [shuffledVideos[0], shuffledVideos[1]]
    } else {
      selectedVideos = videos
    }
    
    console.log('=== 广告选择结果 ===')
    console.log('可用广告数量:', videos.length)
    console.log('可用广告文件:', videos.map(v => v.filename))
    console.log('最终选择的广告:', selectedVideos.map(v => v.filename))
    console.log('第一个广告路径:', selectedVideos[0]?.path)
    console.log('==================')
    
    return NextResponse.json({ 
      success: true,
      videos: selectedVideos,
      totalAvailable: videos.length,
      selected: selectedVideos.length,
      timestamp: Date.now() // 添加时间戳防止缓存
    }, {
      // 添加防缓存头
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
  } catch (error) {
    console.error('Get ad videos error:', error)
    return NextResponse.json({ 
      error: 'Failed to get ad videos' 
    }, { status: 500 })
  }
}
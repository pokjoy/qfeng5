// src/components/AdPlayer.tsx
'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface AdPlayerProps {
  next: string
}

export function AdPlayer({ next }: AdPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()
  
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [canSkip, setCanSkip] = useState(false)
  const [adVideoPath, setAdVideoPath] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // 横屏检测相关状态
  const [isLandscape, setIsLandscape] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showOrientationGuide, setShowOrientationGuide] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  // 检测设备类型和屏幕方向
  useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isMobileDevice = width <= 768
      const isLandscapeMode = width > height
      
      setIsMobile(isMobileDevice)
      setIsLandscape(isLandscapeMode)
      
      // 移动设备的处理逻辑
      if (isMobileDevice) {
        if (!isLandscapeMode) {
          // 竖屏：显示引导，暂停视频
          setShowOrientationGuide(true)
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause()
          }
        } else {
          // 横屏：隐藏引导，开始播放
          setShowOrientationGuide(false)
          if (videoReady && videoRef.current) {
            videoRef.current.play()
          }
        }
      } else {
        // 桌面设备：直接播放
        setShowOrientationGuide(false)
      }
    }

    checkOrientation()

    const handleOrientationChange = () => {
      setTimeout(checkOrientation, 200)
    }

    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', checkOrientation)

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', checkOrientation)
    }
  }, [videoReady])

  const unlockContent = useCallback(async () => {
    try {
      const slug = next.split('/').pop()
      const res = await fetch('/api/ad-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      })
      
      if (res.ok) {
        const data = await res.json()
        router.push(data.redirectTo)
      } else {
        setError('解锁失败，请重试')
      }
    } catch {
      setError('解锁失败，请重试')
    }
  }, [next, router])

  // 组件挂载时获取广告视频
  useEffect(() => {
    const fetchAdVideo = async () => {
      try {
        const res = await fetch('/api/get-ad-video')
        const data = await res.json()
        
        if (res.ok && data.videoPath) {
          setAdVideoPath(data.videoPath)
        } else {
          setError('暂无可用广告')
        }
      } catch {
        setError('加载广告失败')
      } finally {
        setLoading(false)
      }
    }

    fetchAdVideo()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !adVideoPath) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setVideoReady(true)
      
      // 如果是桌面设备或已经是横屏，直接开始播放
      if (!isMobile || (isMobile && isLandscape && !showOrientationGuide)) {
        video.play()
      }
    }

    const handleTimeUpdate = () => {
      const current = video.currentTime
      setCurrentTime(current)
      
      if (current / video.duration > 0.7) {
        setCanSkip(true)
      }
    }

    const handleEnded = () => {
      unlockContent()
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [adVideoPath, isMobile, isLandscape, showOrientationGuide, unlockContent])

  const handleSkip = () => {
    if (canSkip) {
      unlockContent()
    }
  }

  const handleForceStart = () => {
    setShowOrientationGuide(false)
    if (videoRef.current && videoReady) {
      videoRef.current.play()
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">加载广告中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="text-xl mb-4">{error}</div>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          返回
        </button>
      </div>
    )
  }

  // 移动设备竖屏时显示横屏引导
  if (showOrientationGuide) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <div className="text-center space-y-6 max-w-sm">
          {/* 视觉提示 */}
          <div className="mx-auto w-24 h-24 mb-6">
            <svg 
              className="w-full h-full text-yellow-400 animate-pulse" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.44 4.84 18.29 0 12 0l-.66.03 3.81 3.81 1.33-1.32zm-6.25-.77c-.59-.59-1.54-.59-2.12 0L1.75 8.11c-.59.59-.59 1.54 0 2.12l6.36 6.36c.59.59 1.54.59 2.12 0L16.59 10.23c.59-.59.59-1.54 0-2.12L10.23 1.75z"/>
            </svg>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-yellow-400">请将设备横向放置</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              为了获得最佳观看体验，请将您的设备横向放置后观看广告
            </p>
            <p className="text-sm text-gray-400">
              旋转设备后广告将自动开始播放
            </p>
          </div>
          
          {/* 横屏示意图 */}
          <div className="flex items-center justify-center space-x-6 my-8">
            <div className="relative">
              <div className="w-10 h-16 border-2 border-gray-400 rounded-lg opacity-50 relative">
                <div className="absolute inset-2 bg-gray-600 rounded"></div>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">竖屏</div>
            </div>
            
            <div className="text-3xl text-yellow-400 animate-bounce">→</div>
            
            <div className="relative">
              <div className="w-16 h-10 border-2 border-yellow-400 rounded-lg relative">
                <div className="absolute inset-2 bg-yellow-500 rounded opacity-80"></div>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-yellow-400">横屏</div>
            </div>
          </div>
          
          {/* 强制继续选项 */}
          <button
            onClick={handleForceStart}
            className="mt-6 px-4 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition border border-gray-600"
          >
            仍要竖屏观看
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-2 sm:p-4">
      <div className={`w-full ${
        isMobile && isLandscape 
          ? 'max-w-none h-screen' 
          : 'max-w-6xl'
      }`}>
        {/* 视频播放器 */}
        <video
          ref={videoRef}
          src={adVideoPath}
          className={`w-full rounded-lg ${
            isMobile && isLandscape
              ? 'h-full object-cover' 
              : 'max-h-[70vh]'
          }`}
          playsInline
          controls={false}
          onContextMenu={(e) => e.preventDefault()}
          preload="metadata"
        />
        
        {/* 进度条 */}
        <div className="mt-2 sm:mt-4 bg-gray-800 rounded-full h-1 sm:h-2">
          <div 
            className="bg-yellow-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* 控制区域 */}
        <div className="mt-2 sm:mt-4 flex justify-between items-center text-white text-sm sm:text-base">
          <div>
            {Math.floor(currentTime)}s / {Math.floor(duration)}s
          </div>
          
          {canSkip && (
            <button
              onClick={handleSkip}
              className="px-3 py-1 sm:px-6 sm:py-2 bg-green-600 rounded hover:bg-green-700 transition text-sm sm:text-base font-medium"
            >
              跳过广告
            </button>
          )}
        </div>
        
        {/* 提示信息 */}
        <div className="mt-2 sm:mt-4 text-center text-gray-400 text-xs sm:text-sm">
          {!canSkip && '观看广告 70% 后可跳过'}
          {canSkip && '现在可以跳过广告了'}
        </div>
      </div>
    </div>
  )
}
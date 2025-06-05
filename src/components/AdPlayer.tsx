// src/components/AdPlayer.tsx
'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface AdPlayerProps {
  next: string
}

interface AdVideo {
  path: string
  filename: string
  duration?: number
}

export function AdPlayer({ next }: AdPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()
  
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [canSkip, setCanSkip] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // 🆕 多广告相关状态
  const [adVideos, setAdVideos] = useState<AdVideo[]>([])
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [totalWatchedTime, setTotalWatchedTime] = useState(0)
  const [adWatchTimes, setAdWatchTimes] = useState<number[]>([])
  
  // 横屏检测相关状态
  const [isLandscape, setIsLandscape] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showOrientationGuide, setShowOrientationGuide] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [userForceVertical, setUserForceVertical] = useState(false)
  const [orientationInitialized, setOrientationInitialized] = useState(false)

  // 🆕 添加重试机制
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  
  // 🆕 添加手动播放状态
  const [needUserInteraction, setNeedUserInteraction] = useState(false)

  // 检测设备类型和屏幕方向
  useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isMobileDevice = width <= 768
      const isLandscapeMode = width > height
      
      setIsMobile(isMobileDevice)
      setIsLandscape(isLandscapeMode)
      
      if (isMobileDevice && !isLandscapeMode && !userForceVertical) {
        setShowOrientationGuide(true)
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause()
        }
      } else {
        setShowOrientationGuide(false)
        if (videoReady && videoRef.current && videoRef.current.paused) {
          videoRef.current.play().catch(console.error)
        }
      }
      
      if (!orientationInitialized) {
        setOrientationInitialized(true)
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
  }, [videoReady, userForceVertical, orientationInitialized])

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

  // 🆕 获取多个广告视频
  useEffect(() => {
    const fetchAdVideos = async () => {
      try {
        const res = await fetch('/api/get-ad-videos')
        const data = await res.json()
        
        if (res.ok && data.success && data.videos && data.videos.length > 0) {
          setAdVideos(data.videos)
          setAdWatchTimes(new Array(data.videos.length).fill(0))
        } else {
          setError(data.error || '暂无可用广告')
        }
      } catch {
        setError('加载广告失败')
      } finally {
        setLoading(false)
      }
    }

    fetchAdVideos()
  }, [])

  // 🆕 计算是否需要播放第二个广告
  const needSecondAd = useCallback(() => {
    if (adVideos.length < 2) return false
    const firstAdDuration = adVideos[0]?.duration || 0
    return firstAdDuration < 30
  }, [adVideos])

  // 🆕 计算跳过条件
  const calculateSkipCondition = useCallback(() => {
    const currentAd = adVideos[currentAdIndex]
    if (!currentAd || !videoReady || currentTime === 0) return false

    const totalRequired = 30 // 总共需要观看30秒

    if (currentAdIndex === 0) {
      // 第一个广告
      if (currentAd.duration && currentAd.duration >= 30) {
        // 第一个广告就足够30秒，按正常逻辑
        const minWatchTime = Math.max(30, currentAd.duration * 0.7)
        return currentTime >= minWatchTime && currentTime / currentAd.duration >= 0.7
      } else {
        // 第一个广告不足30秒，需要播放完整个
        return currentTime >= (currentAd.duration || 0)
      }
    } else {
      // 第二个广告
      const totalWatched = totalWatchedTime + currentTime
      if (totalWatched >= totalRequired) {
        // 如果总观看时间已达到30秒，只需观看第二个广告的一半
        const secondAdHalf = (currentAd.duration || 0) * 0.5
        return currentTime >= secondAdHalf
      } else {
        // 总时间还不够30秒，继续观看
        return false
      }
    }
  }, [adVideos, currentAdIndex, currentTime, totalWatchedTime, videoReady])

  // 🆕 处理广告切换
  const handleAdEnd = useCallback(() => {
    // 记录当前广告的观看时间
    const newWatchTimes = [...adWatchTimes]
    newWatchTimes[currentAdIndex] = currentTime
    setAdWatchTimes(newWatchTimes)
    
    // 更新总观看时间
    const newTotalWatchedTime = totalWatchedTime + currentTime
    setTotalWatchedTime(newTotalWatchedTime)

    if (currentAdIndex === 0 && needSecondAd()) {
      // 第一个广告结束，需要播放第二个
      setCurrentAdIndex(1)
      setCurrentTime(0)
      setVideoReady(false)
      // 🔧 修复：重置跳过状态
      setCanSkip(false)
    } else {
      // 所有广告播放完毕，解锁内容
      unlockContent()
    }
  }, [currentAdIndex, currentTime, adWatchTimes, totalWatchedTime, needSecondAd, unlockContent])

  // 视频事件处理
  useEffect(() => {
    const video = videoRef.current
    const currentAd = adVideos[currentAdIndex]
    
    if (!video || !currentAd) return

    // 避免重复设置相同的视频源
    if (video.src !== window.location.origin + currentAd.path) {
      video.src = currentAd.path
      video.load()
    } else {
      // 如果视频已经准备好，直接尝试播放
      if (video.readyState >= 3) {
        const shouldPlay = !isMobile || 
                          (isMobile && isLandscape) || 
                          (isMobile && !isLandscape && userForceVertical)
        
        if (shouldPlay && orientationInitialized && video.paused) {
          video.play().catch(() => {
            // 播放失败，静默处理
          })
        }
      }
    }

    const handleLoadedMetadata = () => {
      // 确保 duration 有效
      if (isNaN(video.duration) || video.duration <= 0) {
        return
      }
      
      setDuration(video.duration)
      setVideoReady(true)
      // 🔧 修复：重置跳过状态，防止初始闪烁
      setCanSkip(false)
      
      // 记录广告时长
      const updatedVideos = [...adVideos]
      updatedVideos[currentAdIndex] = { ...currentAd, duration: video.duration }
      setAdVideos(updatedVideos)
      
      const shouldPlay = !isMobile || 
                        (isMobile && isLandscape) || 
                        (isMobile && !isLandscape && userForceVertical)
      
      if (shouldPlay && orientationInitialized) {
        // 添加延迟确保视频完全准备好
        setTimeout(() => {
          if (video.readyState >= 3 && video.paused) {
            video.play().catch(() => {
              setError('视频播放失败，请刷新重试')
            })
          }
        }, 100)
      }
    }

    const handleTimeUpdate = () => {
      const current = video.currentTime
      setCurrentTime(current)
      
      // 使用新的跳过逻辑
      setCanSkip(calculateSkipCondition())
    }

    const handleEnded = () => {
      handleAdEnd()
    }

    const handleError = () => {
      // 重试机制
      if (retryCount < 3 && !isRetrying) {
        setIsRetrying(true)
        setRetryCount(prev => prev + 1)
        
        setTimeout(() => {
          video.load()
          setIsRetrying(false)
        }, 1000)
      } else {
        setError('视频播放失败，请刷新重试')
      }
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
    }
  }, [adVideos, currentAdIndex, isMobile, isLandscape, userForceVertical, orientationInitialized, calculateSkipCondition, handleAdEnd, retryCount, isRetrying, videoReady])

  // 添加独立的播放触发逻辑
  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoReady) return

    const shouldPlay = !isMobile || 
                      (isMobile && isLandscape) || 
                      (isMobile && !isLandscape && userForceVertical)

    if (shouldPlay && orientationInitialized && video.paused && video.readyState >= 3) {
      video.play().catch(error => {
        // 某些浏览器需要用户交互才能播放
        if (error.name === 'NotAllowedError') {
          setNeedUserInteraction(true)
        }
      })
    }
  }, [videoReady, isMobile, isLandscape, userForceVertical, orientationInitialized])

  const handleSkip = () => {
    if (canSkip) {
      unlockContent()
    }
  }

  const handleForceStart = () => {
    setUserForceVertical(true)
    setShowOrientationGuide(false)
    
    if (videoRef.current && videoReady) {
      videoRef.current.play().catch(error => {
        if (error.name === 'NotAllowedError') {
          setNeedUserInteraction(true)
        }
      })
    }
  }

  // 手动播放按钮点击
  const handleManualPlay = () => {
    const video = videoRef.current
    if (video) {
      setNeedUserInteraction(false)
      video.play().catch(() => {
        setError('播放失败，请检查网络连接')
      })
    }
  }

  // 计算总进度
  const calculateTotalProgress = () => {
    if (adVideos.length === 0) return 0
    
    if (adVideos.length === 1 || !needSecondAd()) {
      return duration > 0 ? (currentTime / duration) * 100 : 0
    }
    
    // 多个广告的情况
    const firstAdDuration = adVideos[0]?.duration || 0
    const secondAdDuration = adVideos[1]?.duration || 0
    const totalDuration = firstAdDuration + secondAdDuration
    
    if (currentAdIndex === 0) {
      return totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0
    } else {
      const firstAdCompleted = adWatchTimes[0] || firstAdDuration
      const currentProgress = firstAdCompleted + currentTime
      return totalDuration > 0 ? (currentProgress / totalDuration) * 100 : 0
    }
  }

  const progress = calculateTotalProgress()

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

  if (showOrientationGuide && !userForceVertical) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <div className="text-center space-y-6 max-w-sm">
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

  // 当前广告信息
  const totalAds = needSecondAd() ? 2 : 1

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-2 sm:p-4">
      <div className={`w-full ${
        isMobile && isLandscape 
          ? 'max-w-none h-screen' 
          : 'max-w-6xl'
      }`}>
        {/* 广告指示器 */}
        {totalAds > 1 && (
          <div className="mb-2 text-center">
            <span className="text-white text-sm">
              广告 {currentAdIndex + 1}/{totalAds}
            </span>
          </div>
        )}

        {/* 视频播放器容器 */}
        <div className="relative">
          {/* 手动播放按钮 */}
          {needUserInteraction && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg z-10">
              <button
                onClick={handleManualPlay}
                className="px-6 py-3 bg-red-600 text-white rounded-lg text-lg font-medium hover:bg-red-700 transition flex items-center gap-2"
              >
                ▶️ 点击播放广告
              </button>
            </div>
          )}

          <video
            ref={videoRef}
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
        </div>
        
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
            {totalAds > 1 && (
              <span className="ml-2 text-gray-400">
                (总计: {Math.floor(totalWatchedTime + currentTime)}s)
              </span>
            )}
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
      </div>
    </div>
  )
}
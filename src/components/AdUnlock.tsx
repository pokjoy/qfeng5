'use client'
import { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function AdUnlock({ next }: { next: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.onended = async () => {
      await fetch('/api/unlock/ad', { method: 'POST' })
      router.push(next)
    }
  }, [next, router])

  return (
    <video
      ref={videoRef}
      src="/ads/sample-ad.mp4"
      autoPlay
      controls={false}
      style={{ width: '100%', borderRadius: '8px' }}
    />
  )
}


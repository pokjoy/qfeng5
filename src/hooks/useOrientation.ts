// src/hooks/useOrientation.ts (可选的自定义 Hook)
'use client'
import { useState, useEffect } from 'react'

interface OrientationState {
  isLandscape: boolean
  isMobile: boolean
  showOrientationGuide: boolean
}

export function useOrientation() {
  const [orientation, setOrientation] = useState<OrientationState>({
    isLandscape: false,
    isMobile: false,
    showOrientationGuide: false
  })

  useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isMobileDevice = width <= 768
      const isLandscapeMode = width > height
      
      setOrientation({
        isMobile: isMobileDevice,
        isLandscape: isLandscapeMode,
        showOrientationGuide: isMobileDevice && !isLandscapeMode
      })
    }

    checkOrientation()

    const handleOrientationChange = () => {
      setTimeout(checkOrientation, 100)
    }

    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', checkOrientation)

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', checkOrientation)
    }
  }, [])

  return orientation
}

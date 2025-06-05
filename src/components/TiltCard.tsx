// src/components/TiltCard.tsx
'use client'
import Tilt from 'react-parallax-tilt'
import React from 'react'

export function TiltCard({ children }: { children: React.ReactNode }) {
  return (
    <Tilt 
      tiltMaxAngleX={10} 
      tiltMaxAngleY={10} 
      glareEnable={false} 
      className="w-full tilt-card-wrapper"
      style={{ 
        transformStyle: 'preserve-3d',
        backgroundColor: 'transparent' // 确保包装器透明
      }}
    >
      <div className="w-full h-full" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </Tilt>
  )
}

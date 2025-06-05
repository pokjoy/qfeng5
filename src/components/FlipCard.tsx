// src/components/FlipCard.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface FlipCardProps {
  title: string
  frontColor: string
  backContent: {
    title: string
    items: string[]
    emoji?: string
  }
  index: number
}

export function FlipCard({ title, frontColor, backContent, index }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div 
      className="group cursor-pointer perspective-1000"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="relative w-full" style={{ paddingBottom: '133%' }}>
        <motion.div
          className="absolute inset-0 w-full h-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ 
            duration: 0.8, 
            type: 'spring', 
            stiffness: 100, 
            damping: 15 
          }}
        >
          {/* 正面 */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden rounded-[40%] overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${frontColor}`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white font-semibold text-center px-4 text-sm sm:text-base drop-shadow-sm">
                {title}
              </p>
            </div>
          </div>

          {/* 背面 - 使用主题系统 */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden rounded-[40%] overflow-hidden shadow-lg flip-card-back border-2 transform group-hover:scale-105 transition-all duration-300"
            style={{
              transform: 'rotateY(180deg)',
            }}
          >
            {/* 内容区域 */}
            <div className="absolute inset-0 p-4 flex flex-col justify-center items-center text-center">
              {backContent.emoji && (
                <div className="text-2xl mb-2 opacity-80">{backContent.emoji}</div>
              )}
              <h4 className="font-bold theme-text-primary mb-3 text-sm leading-tight">
                {backContent.title}
              </h4>
              <div className="space-y-1 text-xs theme-text-secondary max-h-24 overflow-y-auto">
                {backContent.items.map((item, idx) => (
                  <div key={idx} className="leading-tight px-1">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
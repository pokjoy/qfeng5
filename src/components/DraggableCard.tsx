// src/components/DraggableCard.tsx
'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface DraggableCardProps {
  id: number
  initialStyle: {
    rotate: string
    top?: string
    bottom?: string
    left?: string
    right?: string
    width: string
  }
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function DraggableCard({ id, initialStyle, containerRef }: DraggableCardProps) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <motion.div
      className="absolute bg-white dark:bg-gray-800 p-1.5 sm:p-2 rounded-lg shadow-xl cursor-grab active:cursor-grabbing select-none
                 w-32 sm:w-36 md:w-40 lg:w-44 xl:w-48"
      style={{
        ...initialStyle,
        zIndex: isDragging ? 50 : 10,
        // 移动端响应式宽度覆盖内联样式
        width: undefined,
      }}
      initial={{ 
        opacity: 0, 
        scale: 0.5, 
        rotate: 0,
      }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotate: parseFloat(initialStyle.rotate.replace('deg', '')),
      }}
      transition={{ 
        duration: 0.8, 
        delay: id * 0.08,
        type: 'spring',
        stiffness: 120
      }}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={containerRef}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ 
        scale: 1.15,
        rotate: 0, // 拖动时变正
        zIndex: 50,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}
      whileHover={{ 
        scale: 1.08,
        zIndex: 20,
        transition: { duration: 0.2 }
      }}
    >
      <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          Fun Project {id + 1}
        </div>
      </div>
      <p className="mt-1 text-xs sm:text-sm text-center text-gray-700 dark:text-gray-300 truncate">
        Creative Work #{id + 1}
      </p>
      
      {/* 拖动提示 - 响应式尺寸 */}
      {!isDragging && (
        <div className="absolute top-0.5 right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center opacity-50">
          <span className="text-xs">⚪</span>
        </div>
      )}
    </motion.div>
  )
}
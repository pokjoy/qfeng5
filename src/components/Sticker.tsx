'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'

// 只在客户端加载 react-draggable，SSR 阶段完全跳过
const Draggable = dynamic(
  () => import('react-draggable').then(mod => mod.default), 
  { ssr: false }
)

interface StickerProps {
  src: string
  defaultPos: { x: number; y: number }
}

/**
 * Sticker 组件：使用 react-draggable 实现可拖拽
 */
export function Sticker({ src, defaultPos }: StickerProps) {
  return (
    <Draggable defaultPosition={defaultPos}>
      {/* 这里用 next/image，也加上 draggable={false} 防止浏览器默认拖动 */}
      <Image
        src={src}
        alt=""
        width={128}
        height={128}
        draggable={false}
        className="select-none pointer-events-auto"
        style={{ touchAction: 'none' }}
      />
    </Draggable>
  )
}


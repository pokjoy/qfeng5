'use client'

import dynamic from 'next/dynamic'

// 这里就可以写 ssr:false 了
const StickerArea = dynamic(
  () => import('./StickerArea'),
  { ssr: false }
)

export default function StickerClient() {
  return <StickerArea />
}

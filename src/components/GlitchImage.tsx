// src/components/GlitchImage.tsx
'use client'

import React from 'react'

export default function GlitchImage() {
  return (
    <div className="
      relative
      w-full
      max-w-lg   /* 在大屏上不超过 2xl 宽度 */
      mx-auto
      aspect-[16/9]  /* 宽高比 16:9 */
      overflow-hidden
      rounded-lg
      shadow-lg
    ">
      <div className="flex h-full w-full">
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-yellow-300" />
        <div className="flex-1 bg-cyan-300" />
        <div className="flex-1 bg-green-400" />
        <div className="flex-1 bg-pink-500" />
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-blue-600" />
      </div>
    </div>
  )
}

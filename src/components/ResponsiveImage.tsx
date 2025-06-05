// src/components/ResponsiveImage.tsx
'use client'

import Image, { ImageProps } from 'next/image'
import React from 'react'

interface ResponsiveImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  /** 支持单个字符串或字符串数组 */
  src: string | string[]
  alt: string
}

/**
 * 如果是数组，则遍历渲染多张；否则渲染一张。
 */
export default function ResponsiveImage({
  src,
  alt,
  ...rest
}: ResponsiveImageProps) {
  // 数组：多图渲染
  if (Array.isArray(src)) {
    return (
      <>
        {src.map((img, i) => (
          <Image key={i} src={img} alt={`${alt} ${i + 1}`} {...rest} />
        ))}
      </>
    )
  }
  // 单图渲染
  return <Image src={src} alt={alt} {...rest} />
}

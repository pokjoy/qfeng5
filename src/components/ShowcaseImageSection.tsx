// src/components/ShowcaseImageSection.tsx
import React from 'react'
import Image from 'next/image'

export default function ShowcaseImageSection({ src }: { src: string }) {
  return (
    <div className="my-12 bg-gray-50 p-8 rounded-lg shadow-lg flex justify-center">
      <Image src={src} alt="Showcase" width={1000} height={500} className="object-contain" />
    </div>
  )
}

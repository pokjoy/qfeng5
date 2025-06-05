// src/components/LandingImageSection.tsx
import React from 'react'
import Image from 'next/image'

export default function LandingImageSection({ src }: { src: string }) {
  return (
    <div className="my-12 rounded-lg overflow-hidden shadow-lg">
      <Image src={src} alt="Landing Screenshot" width={1200} height={600} className="object-cover w-full" />
    </div>
  )
}


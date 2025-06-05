// src/components/CarouselSection.tsx
'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
}

export default function CarouselSection({ images }: Props) {
  const [idx, setIdx] = useState(0)
  const prev = () => setIdx((idx - 1 + images.length) % images.length)
  const next = () => setIdx((idx + 1) % images.length)

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 space-y-4">
      <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg">
        <Image
          src={images[idx]}
          alt={`Slide ${idx + 1}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          ←
        </button>
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${
              i === idx ? 'bg-gray-800' : 'bg-gray-300'
            }`}
          />
        ))}
        <button
          onClick={next}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          →
        </button>
      </div>
    </section>
  )
}

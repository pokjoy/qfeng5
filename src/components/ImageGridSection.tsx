// src/components/ImageGridSection.tsx
'use client'
import Image from 'next/image'

export default function ImageGridSection({
  images,
  heading,
}: {
  images: string[]
  heading: string
}) {
  return (
    <section className="space-y-6">
      <h3 className="text-2xl font-semibold">{heading}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((src, i) => (
          <div key={i} className="rounded-lg overflow-hidden shadow-md">
            <Image
              src={src}
              alt={`${heading} ${i + 1}`}
              width={400}
              height={300}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

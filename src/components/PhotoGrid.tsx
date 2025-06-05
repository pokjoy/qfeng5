// src/components/PhotoGrid.tsx
import Image from 'next/image'

export default function PhotoGrid({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((src, i) => (
        <div key={i} className="overflow-hidden rounded-2xl shadow-md">
          <Image
            src={src}
            alt={`Photo ${i + 1}`}
            width={400}
            height={400}
            className="object-cover w-full h-full"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            priority={false}
          />
        </div>
      ))}
    </div>
  )
}



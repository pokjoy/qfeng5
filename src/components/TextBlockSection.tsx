// src/components/TextBlockSection.tsx
import React from 'react'

export default function TextBlockSection({ title, text }: { title?: string; text: string }) {
  return (
    <div className="my-12">
      {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
      <p className="text-base leading-relaxed text-gray-800">{text}</p>
    </div>
  )
}


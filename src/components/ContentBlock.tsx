// src/components/ContentBlock.tsx
'use client'

export default function ContentBlock({
  heading,
  text,
}: {
  heading: string
  text: string
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-2xl font-semibold">{heading}</h3>
      <p className="text-base text-gray-700 whitespace-pre-wrap">{text}</p>
    </section>
  )
}

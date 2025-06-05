// src/components/LearningsSection.tsx
'use client'

import React from 'react'

interface Props {
  learnings: string
}

export default function LearningsSection({ learnings }: Props) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h2 className="text-2xl font-semibold mb-4">Learnings & Next Steps</h2>
      <p className="text-base text-gray-700 leading-relaxed">{learnings}</p>
    </section>
  )
}

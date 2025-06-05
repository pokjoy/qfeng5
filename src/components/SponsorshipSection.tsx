// src/components/SponsorshipSection.tsx
'use client'

import type { SponsorshipCardData } from '@/config/types'

interface Props {
  cards: SponsorshipCardData[]
}

export default function SponsorshipSection({ cards }: Props) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-12">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="p-6 bg-gray-50 rounded-lg flex flex-col items-start
                     hover:shadow-lg transition"
        >
          <h4 className="mt-4 text-lg font-semibold">{card.title}</h4>
          <p className="mt-2 text-sm text-gray-600">
            {card.description}
          </p>
        </div>
      ))}
    </section>
  )
}

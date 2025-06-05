// src/components/MarketingItemsSection.tsx
'use client'

import React from 'react'
import type { MarketingItemData } from '@/config/types'
import ResponsiveImage from './ResponsiveImage'

interface Props {
  items: MarketingItemData[]
}

export default function MarketingItemsSection({ items }: Props) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 space-y-12">
      {items.map((item) => (
        <div
          key={item.number}
          className="flex flex-col md:flex-row items-start md:items-center gap-6"
        >
          <div className="text-2xl font-bold flex-shrink-0">
            {item.number}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-base text-gray-700">{item.description}</p>
          </div>
          <div className="w-full md:w-1/3">
            <ResponsiveImage
              src={item.imageSrc}
              alt={item.title}
              width={400}
              height={300}
              className="w-full h-auto rounded-xl shadow-lg object-cover"
            />
          </div>
        </div>
      ))}
    </section>
  )
}

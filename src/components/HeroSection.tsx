// src/components/HeroSection.tsx
'use client'

import React from 'react'
import { TagBadge } from './TagBadge'
import type { ProjectDetail } from '@/config/types'

interface Props {
  project: ProjectDetail
}

export default function HeroSection({ project }: Props) {
  return (
    <header className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold">{project.title}</h1>
      <p className="mt-2 text-lg text-gray-600">{project.subtitle}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.tags.map(tag => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">
        <div>
          <h4 className="font-semibold mb-2">Team</h4>
          {project.team.map((member, i) => (
            <p key={i}>{member}</p>
          ))}
        </div>
        <div>
          <h4 className="font-semibold mb-2">Process</h4>
          {project.process.map((step, i) => (
            <p key={i}>{step}</p>
          ))}
        </div>
        <div>
          <h4 className="font-semibold mb-2">Timeline</h4>
          <p>{project.timeline}</p>
        </div>
      </div>
    </header>
  )
}
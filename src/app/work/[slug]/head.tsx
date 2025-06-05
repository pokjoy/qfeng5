// src/app/work/[slug]/head.tsx
import { PROJECTS } from '@/config/work'
import type { Metadata } from 'next'
import type { ProjectDetail } from '@/config/types'

export function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Metadata {
  const project: ProjectDetail | undefined = PROJECTS[params.slug]
  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The project you are looking for does not exist.',
    }
  }

  return {
    title: project.title,
    description: project.subtitle ?? project.gotStarted.substring(0, 150),
  }
}

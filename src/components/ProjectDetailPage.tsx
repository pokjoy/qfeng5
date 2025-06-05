// src/components/ProjectDetailPage.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import HeroSection from './HeroSection'
import MarketingItemsSection from './MarketingItemsSection'
import CarouselSection from './CarouselSection'
import LearningsSection from './LearningsSection'
import BackHomeButton from './BackHomeButton'
import type { ProjectDetail, ConceptSection } from '@/config/types'

interface Props {
  project: ProjectDetail
}

export default function ProjectDetailPage({ project }: Props) {
  return (
    <>
      {/* 仅在详情页显示「返回首页」 */}
      <BackHomeButton />

      {/* 模块1: Hero */}
      <HeroSection project={project} />

      {/* 模块3: 大图展示 */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={project.landingImage}
            alt={`${project.title} landing`}
            fill
            className="object-cover rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* 模块4-5: 带标题的内容区 */}
      <section className="mx-auto max-w-4xl px-4 space-y-12">
        {/* 4: How it got started */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">How it got started</h2>
          <p className="text-base text-gray-700 leading-relaxed">{project.gotStarted}</p>
        </div>
 
        {/* 5: My role */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">My role</h2>
          <p className="text-base text-gray-700 leading-relaxed">{project.myRole}</p>
        </div>
 
        {/* 6: So… What I Did */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">So… What I Did (in response to the challenges)</h2>
          <p className="text-base text-gray-700 leading-relaxed">{project.reflection}</p>
        </div>
      </section>

      {/* 模块8/9: 轮播图 */}
      <CarouselSection images={project.carouselImages} />

      {/* 新增：概念小节 */}
      <section className="mx-auto max-w-4xl px-4 space-y-12 py-12">
        {project.concepts.map((sec: ConceptSection, i: number) => (
          <div key={i} className="space-y-4">
            <h2
              className={`text-2xl font-semibold ${
                i === 0 ? 'italic' : ''
              }`}
            >
              {sec.heading}
            </h2>
            {sec.paragraphs.map((p, j) => (
              <p
                key={j}
                className="text-base text-gray-700 leading-relaxed"
              >
                {p}
              </p>
            ))}
          </div>
        ))}
      </section>

      {/* 模块6: Showcase 大图 */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={project.showcaseImage}
            alt={`${project.title} showcase`}
            fill
            className="object-cover rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* 模块7: Marketing Items */}
      <MarketingItemsSection items={project.marketingItems} />

      {/* 模块10: Learnings */}
      <LearningsSection learnings={project.learnings} />
    </>
  )
}

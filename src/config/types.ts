// src/config/types.ts
import type React from 'react'

export interface Project {
  title: string
  description: string
  tags: string[]
  imageSrc: string
  link: string
}

export interface ProjectDetail {
  slug: string
  title: string
  subtitle: string
  tags: string[]          // ← 一定要有 tags
  team: string[]
  process: string[]
  timeline: string
  sponsorshipCards?: SponsorshipCardData[];  // 模块2
  landingImage: string                   // 模块3
  gotStarted: string                     // 模块4
  myRole: string                         // 模块5
  reflection: string                     // 模块5-6 之间的文字
  showcaseImage: string                  // 模块6
  marketingItems: MarketingItemData[]    // 模块7
  carouselImages: string[]               // 模块8（与9相同）
  concepts: ConceptSection[]
  learnings: string                      // 模块9
  protected?: boolean
}

export interface SponsorshipCardData {
  title: string
  description: string
}

export interface ConceptSection {
  /** 小节标题 */
  heading: string
  /** 段落列表 */
  paragraphs: string[]
}

export interface MarketingItemData {
  number: string
  title: string
  description: string
  /** 支持单图或多图 */
  imageSrc: string | string[]
}

export interface ButtonConfig {
  label: string
  href: string
  icon?: React.ReactNode
}

export interface ProjectsSectionProps {
  projects: Project[]
}

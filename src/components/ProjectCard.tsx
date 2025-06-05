// src/components/ProjectCard.tsx
'use client'
import Link from 'next/link';
import Image from 'next/image';
import { TagBadge } from '@/components/TagBadge';
import { Project } from '@/config/types';
import { TiltCard } from '@/components/TiltCard'

export function ProjectCard({ title, description, tags, imageSrc, link }: Project) {
  return (
    <TiltCard>
      <Link 
        href={link || '#'} 
        className="group block project-card rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border interactive-element"
      >
        <div className="flex">
          {/* 内容区域 */}
          <div className="flex-1 p-6">
            <h3 className="font-sans text-2xl font-bold mb-3 theme-text-primary group-hover:text-indigo-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm mb-4 theme-text-secondary leading-relaxed">
              {description}
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => <TagBadge key={tag} tag={tag} />)}
            </div>
          </div>
                    
          {/* 图片区域 */}
          <div className="w-40 h-40 relative flex-shrink-0 theme-border">
            <Image 
              src={imageSrc} 
              alt={title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* 图片遮罩层 */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/5"></div>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
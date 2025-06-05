// src/app/about/page.tsx
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { FAQ_LIST } from '@/data/faqs'
import PhotoGrid from '@/components/PhotoGrid'
import StickerClient from '@/components/StickerClient'
import { ButtonGroup } from '@/components/ButtonGroup'
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/solid'

export default function AboutPage() {
  // 随机选 3 条 FAQ
  const faqs = [...FAQ_LIST].sort(() => Math.random() - 0.5).slice(0, 3)
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div className="relative">
      {/* 只在 about 页面显示贴纸 */}
      <StickerClient />
      
      <div className="max-w-4xl mx-auto py-16 space-y-16">
        {/* —— 个人介绍卡片 —— */}
        <section className="flex flex-col md:flex-row items-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg transition-colors duration-300">
          <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
            <Image
              src="/images/qfeng5/mmexport1747563402217.jpg"
              alt="Portrait"
              width={300}
              height={450}
              className="rounded-xl object-cover"
            />
          </div>
          <div className="md:ml-8 flex-1 space-y-4">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Hi, I&apos;m Qfeng5</h1>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              I create engaging, playful designs that bring joy to everyday interactions.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <ButtonGroup
                buttons={[
                  { label: 'Resume', href: '/resume.pdf' },
                  { label: 'LinkedIn', href: 'https://linkedin.com/in/qfeng5' },
                  { label: 'Email', href: 'mailto:qfeng5@example.com' },
                ]}
              />
            </div>
          </div>
        </section>

        {/* —— 常见问答 —— */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Q & A</h2>
          <div className="space-y-12">
            {faqs.map((faq, i) => (
              <div key={i} className="relative">
                <div className="flex items-start">
                  {/* 问题气泡 */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg flex-1 transition-colors duration-300 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-900 dark:text-gray-100">{faq.question}</p>
                  </div>
                  {/* 切换按钮 */}
                  <button
                    onClick={() =>
                      setOpenIdx(openIdx === i ? null : i)
                    }
                    className="ml-4 mt-2 p-2 bg-indigo-500 dark:bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-600 dark:hover:bg-indigo-700 transition focus:outline-none"
                    aria-label="Toggle answer"
                  >
                    {openIdx === i ? (
                      <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* 回答气泡（右侧对齐） */}
                {openIdx === i && (
                  <div className="mt-4 flex justify-end">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl shadow-lg max-w-prose transition-colors duration-300 border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-900 dark:text-gray-100">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* —— 照片画廊 —— */}
        <section>
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-white">Photo Gallery</h2>
          <p className="text-lg leading-relaxed mb-8 text-center text-gray-700 dark:text-gray-300">
            Here are some snapshots from my work and life.
          </p>
          <PhotoGrid
            images={[
              '/images/qfeng5/photo1.jpg',
              '/images/qfeng5/photo2.jpg',
              '/images/qfeng5/photo3.jpg',
              '/images/qfeng5/photo4.jpg',
              // …根据实际数量增删
            ]}
          />
        </section>
      </div>
    </div>
  )
}
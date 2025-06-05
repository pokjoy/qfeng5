// src/components/HomePage.tsx
'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ButtonGroup } from '@/components/ButtonGroup';
import { ProjectCard } from '@/components/ProjectCard';
import { FlipCard } from '@/components/FlipCard';
import { DraggableCard } from '@/components/DraggableCard';
import { Project } from '@/config/types';
import { TypewriterText } from '@/components/TypewriterText';
import { useEffect, useRef } from 'react';

export default function HomePage() {
  const dragContainerRef = useRef<HTMLDivElement>(null)
  
  const projects: Project[] = [
    {
      title: 'InternUp',
      description: 'Connect international talent with job opportunities',
      tags: ['InProgress1', 'Internship1', 'UIUX', 'WebDesign', 'B2C'],
      imageSrc: '/images/qfeng5/image_86.png',
      link: '/work/internup'
    },
    {
      title: 'SnowOverflow',
      description: 'Your Ultimate Shredding Companion',
      tags: ['InProgress2', 'LaunchingSoon', 'UIUX', 'MobileApp'],
      imageSrc: '/images/project-b.jpg',
      link: '/work/snowoverflow'
    },
    {
      title: 'Ai Roboto Edu',
      description: 'Designed for skill-building and government-backed careers',
      tags: ['Internship2', 'UIUX', 'WebDesign', 'B2B'],
      imageSrc: '/images/project-c.jpg',
      link: '/work/c'
    }
  ];

  // 翻转卡片数据
  const flipCardData = [
    {
      title: 'My Fav Color',
      frontColor: 'from-purple-400 to-pink-400',
      backContent: {
        title: '我的色彩偏好',
        emoji: '🎨',
        items: [
          '紫色 - 创意与神秘',
          '粉色 - 温暖与活力', 
          '蓝色 - 冷静与专业',
          '橙色 - 热情与能量'
        ]
      }
    },
    {
      title: "Places I've Been To",
      frontColor: 'from-blue-400 to-teal-400',
      backContent: {
        title: '我的足迹',
        emoji: '✈️',
        items: [
          '🇺🇸 西雅图, 美国',
          '🇨🇳 北京, 中国',
          '🇯🇵 东京, 日本',
          '🇰🇷 首尔, 韩国'
        ]
      }
    },
    {
      title: 'Fav Food',
      frontColor: 'from-orange-400 to-red-400',
      backContent: {
        title: '美食偏好',
        emoji: '🍜',
        items: [
          '🍣 日式料理',
          '🌮 墨西哥菜',
          '🍝 意大利面',
          '🥘 川菜火锅'
        ]
      }
    },
    {
      title: 'Fav Pets',
      frontColor: 'from-green-400 to-emerald-400',
      backContent: {
        title: '宠物偏好',
        emoji: '🐾',
        items: [
          '🐱 橘猫 - 温暖治愈',
          '🐕 柴犬 - 忠诚可爱',
          '🐰 兔子 - 安静乖巧',
          '🐦 鹦鹉 - 聪明活泼'
        ]
      }
    }
  ];

  // 设置全局平滑滚动 - 只在客户端执行
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }, []);

  // 可拖动卡片的初始位置数据 - 响应式尺寸
  const cardPositions = [
    { rotate: '-12deg', top: '8%', left: '5%', width: '180px' },
    { rotate: '8deg', top: '5%', left: '30%', width: '200px' },
    { rotate: '-5deg', top: '12%', right: '8%', width: '170px' },
    { rotate: '15deg', top: '55%', left: '8%', width: '190px' },
    { rotate: '-8deg', top: '65%', left: '35%', width: '200px' },
    { rotate: '10deg', top: '75%', right: '12%', width: '180px' },
    { rotate: '-3deg', top: '30%', left: '20%', width: '210px' },
    { rotate: '5deg', top: '25%', right: '20%', width: '170px' },
  ];

  return (
    <main className="relative">
      {/* Home Section */}
      <section id="home" className="min-h-screen flex items-center px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl w-full space-y-8">
          <motion.h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ 
              fontFamily: 'Satoshi', 
              fontWeight: 700,
              color: 'var(--foreground)' // 使用CSS变量强制应用颜色
            }}
          >
            Qiuzi Feng
          </motion.h1>
          <motion.div 
            className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontFamily: 'Satoshi', fontWeight: 400 }}
          >
            <TypewriterText text="Based in Seattle, WA. I am a designer and researcher specializing in UI/UX design, market research, and emerging technology." />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ButtonGroup
              buttons={[
                { label: 'Email', href: 'mailto:qfeng5@example.com' },
                { label: 'LinkedIn', href: 'https://linkedin.com/in/qfeng5' },
                { label: 'Resume', href: '/resume.pdf' },
              ]}
            />
          </motion.div>
        </div>
      </section>

      {/* Work Section - 移除背景色，让它与其他section一致 */}
      <section id="work" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl w-full">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ color: 'var(--foreground)' }}
          >
            Featured Work
          </motion.h2>
          <motion.p 
            className="text-center text-lg text-gray-600 dark:text-gray-400 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Explore my latest projects and case studies
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <ProjectCard
                  title={proj.title}
                  description={proj.description}
                  tags={proj.tags}
                  imageSrc={proj.imageSrc}
                  link={proj.link}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl w-full">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ color: 'var(--foreground)' }}
          >
            About Me
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            {/* 左图 */}
            <motion.div 
              className="relative order-2 md:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/images/qfeng5/mmexport1747563402217.jpg" 
                  alt="Qiuzi Feng"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            {/* 右文 */}
            <motion.div 
              className="space-y-6 order-1 md:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I create engaging, playful designs that bring joy to everyday interactions.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                With 3+ years of experience in UI/UX design and market research, I specialize in creating user-centered solutions that balance aesthetics with functionality.
              </p>
              <div className="flex gap-4">
                <a href="/resume.pdf" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Download Resume →
                </a>
              </div>
            </motion.div>
          </div>
          
          {/* 舷窗展示区 - 使用翻转卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {flipCardData.map((cardData, idx) => (
              <FlipCard
                key={idx}
                title={cardData.title}
                frontColor={cardData.frontColor}
                backContent={cardData.backContent}
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Fun Section - 移除背景色，让它与其他section一致 */}
      <section id="fun" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl w-full">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ color: 'var(--foreground)' }}
          >
            Fun & Creative
          </motion.h2>
          
          {/* 可拖动卡片容器 - 更大且响应式 */}
          <div 
            ref={dragContainerRef}
            className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700
                       h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px]"
            style={{ 
              background: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1), transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.1), transparent 50%)',
            }}
          >
            {/* 背景装饰 */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full blur-xl" />
              <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full blur-xl" />
              <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-200 dark:bg-pink-800 rounded-full blur-xl" />
              <div className="absolute bottom-32 right-10 w-18 h-18 bg-yellow-200 dark:bg-yellow-800 rounded-full blur-xl" />
            </div>
            
            {/* 拖动提示文字 */}
            <motion.div 
              className="absolute top-4 left-4 text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              🎨 拖动卡片试试看！
            </motion.div>
            
            {/* 可拖动的创意卡片 */}
            {cardPositions.map((position, i) => (
              <DraggableCard
                key={i}
                id={i}
                initialStyle={position}
                containerRef={dragContainerRef}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section id="connect" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full text-center space-y-8">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ color: 'var(--foreground)' }}
          >
            Let&apos;s Connect
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            I&apos;m always interested in new opportunities and collaborations. Feel free to reach out!
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="mailto:qfeng5@example.com"
              className="px-8 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full font-medium transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Email Me
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/qfeng5"
              className="px-8 py-3 border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 rounded-full font-medium transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              LinkedIn
            </motion.a>
          </motion.div>
          <motion.div 
            className="pt-8 text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            © {new Date().getFullYear()} Qiuzi Feng. All rights reserved.
          </motion.div>
        </div>
      </section>
    </main>
  );
}
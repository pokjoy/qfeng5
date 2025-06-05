// src/config/work.ts
import type { ProjectDetail, ConceptSection, MarketingItemData } from '@/config/types'

export const PROJECTS: Record<string, ProjectDetail> = {
  internup: {
    slug: 'internup',
    title: 'InternUp',
    subtitle:
      'Your global career kickstarter. Connecting international students with internships, job opportunities, and hiring support—all in one place.',
    tags: ['Career', 'Sponsorship', 'AI', 'Community'],
    team: ['Designer (me)', 'Engineering team'],
    process: [
      'Heuristic Evaluation',
      'Design System Reorganization',
      'Content Strategy',
      'Wireframing',
      'Prototyping',
    ],
    timeline: '2024 Dec – 2025 Mar',
    // 模块 3：大图展示
    landingImage: '/images/qfeng5/internup/61a51066385631c0a7ddd391f0b459fd4c871650.png',
    // 模块 4：第一段文字
    gotStarted:
      'I first discovered InternUp as a user—and to be honest, I found the experience frustrating. Key information was hard to find, the layout felt confusing, and the visual design lacked consistency. But rather than leave, I saw an opportunity. I reached out to the founder directly and offered to help improve the product’s UX. That conversation led to an internship where I became the team’s sole product designer, helping shape both the experience and the brand.',
    // 模块 5：我的角色
    myRole:
      'I was the only UX/UI designer on the team, working closely with the founder and engineers to improve the product experience. I led the redesign of the landing page, built a design system from scratch, and crafted content to better communicate the platform’s value.',
    // 模块 5–6 之间的文字
    reflection:
      'Because how it feels—visually and emotionally—directly shapes how we choose color, typography, spacing, and overall interaction. From my conversations with the founder and my own interpretation of the product’s mission, I realized InternUp is for self-starters: driven international students who grow quickly when given just a little structure and support.',
    // 模块 6：大图展示
    showcaseImage: '/images/qfeng5/internup/a7b49f234ac606028218846491362bf871ce8b7b.png',
    // 模块 7：四个纵向子模块
    marketingItems: [
      {
        number: '01',
        title: 'Landing',
        description:
          'A first impression that builds trust and energy—highlighting brand mission, success stories, and the global companies students can access through InternUp.',
        imageSrc: '/images/qfeng5/internup/b6df9e2d08a0a638138c021681b9bc124d0190c9.png',
      },
      {
        number: '02',
        title: 'Membership',
        description:
          'Breaks down the pricing plans and what each membership includes, helping users compare options and choose with confidence.',
        imageSrc: '/images/qfeng5/internup/1b0e0a766e38bbf870af67c4a05be7fc831f2b30.png',
      },
      {
        number: '03',
        title: 'Onboarding',
        description:
          'Rethinking the onboarding flow to collect essential info up front—improving user clarity and internal operations.',
        imageSrc: '/images/qfeng5/internup/f8408f9eccd28d5d898df638a208ad4bdd17348a.png',
      },
      {
        number: '04',
        title: 'Chatbot',
        description:
          'Exploring the chatbot experience to make it more intuitive and action-focused.',
        imageSrc: [
		'/images/qfeng5/internup/a8199b3bb8855b36419bb0fd1d4a9a198584d1da.png',
        	'/images/qfeng5/internup/5e42abd7c6a772ce410baf932becd0e5b12f5f2e.png',
	],
      },
    ] as MarketingItemData[],
    // 模块 8/9：轮播图（合并成一个组件）
    carouselImages: [
      '/images/internup/carousel-1.png',
      '/images/internup/carousel-2.png',
      '/images/internup/carousel-3.png',
    ],
// 新增：概念小节
    concepts: [
      {
        heading:
          '“How should this platform feel to the students it’s built for?”',
        paragraphs: [
          'Because how it feels—visually and emotionally—directly shapes how we choose color, typography, spacing, and overall interaction. From my conversations with the founder and my own interpretation of the product’s mission, I realized InternUp is for self-starters: driven international students who grow quickly when given just a little structure and support.',
          'It’s about empowering motivated, independent learners—people who seek opportunity, not hand-holding. The platform supports students who value growth, resilience, and clarity, and the experience needed to reflect that. I aimed for a visual tone that felt optimistic, focused, trustworthy, and quietly bold—a space that feels like a launchpad, not a safety net.',
        ],
      },
      {
        heading: 'Laying the Foundation for Growth',
        paragraphs: [
          'To fix the chaos, I knew we needed structure. I built a lean design system to bring visual consistency and streamline development. This included defining a new color palette, type scale, spacing rules, and reusable components like buttons and cards—giving both design and dev a shared foundation to work from.',
        ],
      },
    ] as ConceptSection[],
    // 模块 9：学习与下一步
    learnings:
      'This experience taught me the importance of proactive time management—especially in a startup environment where structure is minimal and progress depends on self-direction. I learned how to set milestones, manage bandwidth realistically, and keep projects moving efficiently—especially by using AI tools to speed up content ideation and design decisions.',
    protected: true,
  },

  snowoverflow: {
    slug: 'snowoverflow',
    title: 'SnowOverflow',
    subtitle:
      'Your ultimate shredding companion. Connecting you with ski buddies, trip plans, and real-time resort updates—all in one place.',
    tags: ['Career', 'Sponsorship', 'AI', 'Community'],
    team: ['Designer (me)', 'Product manager', 'Engineering team'],
    process: [
      'Market Research',
      'Wireframing',
      'Usability Testing',
      'Visual Design',
      'Prototyping',
    ],
    timeline: '2024 Ongoing',
    // 模块 3：大图展示
    landingImage: '/images/qfeng5/snowoverflow/8a03bcd8bdc43e0886cae46a425e7e6344943c9a.png',
    // 模块 4：第一段文字
    gotStarted:
      'I first discovered InternUp as a user—and to be honest, I found the experience frustrating. Key information was hard to find, the layout felt confusing, and the visual design lacked consistency. But rather than leave, I saw an opportunity. I reached out to the founder directly and offered to help improve the product’s UX. That conversation led to an internship where I became the team’s sole product designer, helping shape both the experience and the brand.',
    // 模块 5：我的角色
    myRole:
      'I was the only UX/UI designer on the team, working closely with the founder and engineers to improve the product experience. I led the redesign of the landing page, built a design system from scratch, and crafted content to better communicate the platform’s value.',
    // 模块 5–6 之间的文字
    reflection:
      'Because how it feels—visually and emotionally—directly shapes how we choose color, typography, spacing, and overall interaction. From my conversations with the founder and my own interpretation of the product’s mission, I realized InternUp is for self-starters: driven international students who grow quickly when given just a little structure and support.',
    // 模块 6：大图展示
    showcaseImage: '/images/qfeng5/internup/a7b49f234ac606028218846491362bf871ce8b7b.png',
    // 模块 7：四个纵向子模块
    marketingItems: [
      {
        number: '01',
        title: 'Landing',
        description:
          'A first impression that builds trust and energy—highlighting brand mission, success stories, and the global companies students can access through InternUp.',
        imageSrc: '/images/qfeng5/internup/b6df9e2d08a0a638138c021681b9bc124d0190c9.png',
      },
      {
        number: '02',
        title: 'Membership',
        description:
          'Breaks down the pricing plans and what each membership includes, helping users compare options and choose with confidence.',
        imageSrc: '/images/qfeng5/internup/1b0e0a766e38bbf870af67c4a05be7fc831f2b30.png',
      },
      {
        number: '03',
        title: 'Onboarding',
        description:
          'Rethinking the onboarding flow to collect essential info up front—improving user clarity and internal operations.',
        imageSrc: '/images/qfeng5/internup/f8408f9eccd28d5d898df638a208ad4bdd17348a.png',
      },
      {
        number: '04',
        title: 'Chatbot',
        description:
          'Exploring the chatbot experience to make it more intuitive and action-focused.',
        imageSrc: [
		'/images/qfeng5/internup/a8199b3bb8855b36419bb0fd1d4a9a198584d1da.png',
        	'/images/qfeng5/internup/5e42abd7c6a772ce410baf932becd0e5b12f5f2e.png',
	],
      },
    ] as MarketingItemData[],
    // 模块 8/9：轮播图（合并成一个组件）
    carouselImages: [
      '/images/internup/carousel-1.png',
      '/images/internup/carousel-2.png',
      '/images/internup/carousel-3.png',
    ],
// 新增：概念小节
    concepts: [
      {
        heading:
          '“How should this platform feel to the students it’s built for?”',
        paragraphs: [
          'Because how it feels—visually and emotionally—directly shapes how we choose color, typography, spacing, and overall interaction. From my conversations with the founder and my own interpretation of the product’s mission, I realized InternUp is for self-starters: driven international students who grow quickly when given just a little structure and support.',
          'It’s about empowering motivated, independent learners—people who seek opportunity, not hand-holding. The platform supports students who value growth, resilience, and clarity, and the experience needed to reflect that. I aimed for a visual tone that felt optimistic, focused, trustworthy, and quietly bold—a space that feels like a launchpad, not a safety net.',
        ],
      },
      {
        heading: 'Laying the Foundation for Growth',
        paragraphs: [
          'To fix the chaos, I knew we needed structure. I built a lean design system to bring visual consistency and streamline development. This included defining a new color palette, type scale, spacing rules, and reusable components like buttons and cards—giving both design and dev a shared foundation to work from.',
        ],
      },
    ] as ConceptSection[],
    // 模块 9：学习与下一步
    learnings:
      'This experience taught me the importance of proactive time management—especially in a startup environment where structure is minimal and progress depends on self-direction. I learned how to set milestones, manage bandwidth realistically, and keep projects moving efficiently—especially by using AI tools to speed up content ideation and design decisions.',
	protected: false,
  },
  // …如果还有其他项目，按相同格式继续添加
}

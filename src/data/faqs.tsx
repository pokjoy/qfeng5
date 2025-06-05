// src/data/faqs.ts
export interface FAQ {
  question: string;
  answer: React.ReactNode;
}

export const FAQ_LIST: FAQ[] = [
  { question: 'What are all the stickers about on your website?', answer: 'Drag them around, play with them, have fun here!' },
  { question: 'How can I download your resume?', answer: <a href="/resume.pdf" className="text-blue-600 hover:underline">点击这里下载 PDF 简历</a> },
  { question: 'What tools do you use?', answer: 'Figma, Sketch, Adobe Creative Suite, React, Tailwind CSS…' },
  { question: 'Do you offer freelance services?', answer: 'Yes, I am available for freelance work—feel free to reach out via email.' },
  // …可继续添加
];

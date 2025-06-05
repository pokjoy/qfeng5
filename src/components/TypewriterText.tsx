// src/components/TypewriterText.tsx
'use client'
import { Typewriter } from 'react-simple-typewriter'
import React from 'react'

export function TypewriterText({ text }: { text: string }) {
  return (
    <Typewriter
      words={[text]}
      loop={1}
      cursor
      cursorStyle="_"
      typeSpeed={50}
      deleteSpeed={0}
      delaySpeed={1000}
    />
  )
}

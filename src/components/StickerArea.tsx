'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';

interface Sticker {
  src: string;
  defaultPos: { x: number; y: number };
}

const stickers: Sticker[] = [
  { src: '/stickers/sticker1.svg', defaultPos: { x: 100, y: 200 } },
  { src: '/stickers/sticker2.svg', defaultPos: { x: 300, y: 400 } },
  // …可继续添加
];

export default function StickerArea() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState(stickers.map(s => ({ ...s.defaultPos })));
  const [dragging, setDragging] = useState<null | { idx: number; offsetX: number; offsetY: number }>(null);

  // 鼠标/手指按下
  function onPointerDown(e: React.PointerEvent, idx: number) {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragging({ idx, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top });
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  // 移动
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || !containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    let x = e.clientX - bounds.left - dragging.offsetX;
    let y = e.clientY - bounds.top - dragging.offsetY;
    // 限制在视口内
    x = Math.max(0, Math.min(bounds.width - 128, x));
    y = Math.max(0, Math.min(bounds.height - 128, y));
    setPositions(pos => pos.map((p, i) => i === dragging.idx ? { x, y } : p));
  }

  // 抬起
  function onPointerUp() {
    setDragging(null);
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ zIndex: 10 }}
    >
      {stickers.map((st, i) => (
        <div
          key={i}
          className="absolute pointer-events-auto cursor-grab touch-none"
          style={{ top: positions[i].y, left: positions[i].x, width: 128, height: 128 }}
          onPointerDown={e => onPointerDown(e, i)}
        >
          <Image src={st.src} alt="" width={128} height={128} draggable={false} />
        </div>
      ))}
    </div>
  );
}


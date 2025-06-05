// src/components/TagBadge.tsx
import { TAGS } from '@/config/tagConfig';

interface TagBadgeProps {
  tag: string;
}

export function TagBadge({ tag }: TagBadgeProps) {
  const config = TAGS[tag] || { 
    label: tag, 
    colorClass: 'bg-gray-100 text-gray-800 border border-gray-200',
    darkColorClass: 'dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
  };
  
  return (
    <span 
      className={`inline-block px-3 py-1.5 text-xs font-medium rounded-full transition-colors theme-border ${config.colorClass}`}
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-card))',
        color: 'var(--color-textSecondary)',
        borderColor: 'color-mix(in srgb, var(--color-primary) 20%, var(--color-border))'
      }}
    >
      {config.label}
    </span>
  );
}
// src/components/ButtonGroup.tsx
import { ButtonConfig } from '@/config/types';

interface ButtonGroupProps {
  buttons: ButtonConfig[];
}

export function ButtonGroup({ buttons }: ButtonGroupProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {buttons.map((btn, idx) => (
        <a
          key={idx}
          href={btn.href}
          className="group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-transparent hover:border-white/20"
        >
          <span className="flex items-center gap-2">
            {btn.icon && <span className="group-hover:scale-110 transition-transform">{btn.icon}</span>}
            {btn.label}
          </span>
        </a>
      ))}
    </div>
  );
}
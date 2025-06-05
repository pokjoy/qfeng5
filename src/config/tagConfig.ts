// src/config/tagConfig.ts
export interface TagConfig {
  label: string;
  colorClass: string;
  darkColorClass?: string;
}

export const TAGS: Record<string, TagConfig> = {
  InProgress1: { 
    label: 'In Progress',
    colorClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    darkColorClass: 'dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
  },
  Internship1: { 
    label: 'Internship',  
    colorClass: 'bg-blue-100 text-blue-800 border border-blue-200',
    darkColorClass: 'dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
  },
  UIUX: { 
    label: 'UI/UX',     
    colorClass: 'bg-purple-100 text-purple-800 border border-purple-200',
    darkColorClass: 'dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
  },
  WebDesign: { 
    label: 'Web Design',      
    colorClass: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    darkColorClass: 'dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800'
  },
  B2C: { 
    label: 'B2C',    
    colorClass: 'bg-orange-100 text-orange-800 border border-orange-200',
    darkColorClass: 'dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800'
  },
  B2B: { 
    label: 'B2B',    
    colorClass: 'bg-red-100 text-red-800 border border-red-200',
    darkColorClass: 'dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
  },
  InProgress2: { 
    label: 'In Progress',   
    colorClass: 'bg-cyan-100 text-cyan-800 border border-cyan-200',
    darkColorClass: 'dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800'
  },
  LaunchingSoon: { 
    label: 'Launching Soon',    
    colorClass: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    darkColorClass: 'dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
  },
  Internship2: { 
    label: 'Internship',   
    colorClass: 'bg-pink-100 text-pink-800 border border-pink-200',
    darkColorClass: 'dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800'
  },
  MobileApp: { 
    label: 'Mobile App',    
    colorClass: 'bg-green-100 text-green-800 border border-green-200',
    darkColorClass: 'dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
  },
  Career: {
    label: 'Career',
    colorClass: 'bg-violet-100 text-violet-800 border border-violet-200',
    darkColorClass: 'dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800'
  },
  Sponsorship: {
    label: 'Sponsorship',
    colorClass: 'bg-teal-100 text-teal-800 border border-teal-200',
    darkColorClass: 'dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800'
  },
  AI: {
    label: 'AI',
    colorClass: 'bg-slate-100 text-slate-800 border border-slate-200',
    darkColorClass: 'dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800'
  },
  Community: {
    label: 'Community',
    colorClass: 'bg-rose-100 text-rose-800 border border-rose-200',
    darkColorClass: 'dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800'
  }
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'amber' | 'purple' | 'green' | 'red' | 'gray';
  className?: string;
}

const variantMap: Record<string, string> = {
  cyan:   'text-[#00ffff] border-[rgba(0,255,255,0.3)] bg-[rgba(0,255,255,0.08)]',
  amber:  'text-[#F59E0B] border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.08)]',
  purple: 'text-[#a855f7] border-[rgba(168,85,247,0.3)] bg-[rgba(168,85,247,0.08)]',
  green:  'text-[#22c55e] border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.08)]',
  red:    'text-[#ef4444] border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.08)]',
  gray:   'text-[rgba(240,240,240,0.4)] border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)]',
};

export function Badge({ children, variant = 'cyan', className = '' }: BadgeProps) {
  return (
    <span className={`inline-block text-[9px] font-[family-name:var(--font-jetbrains)] font-semibold tracking-[2px] uppercase px-2 py-0.5 border rounded-[2px] ${variantMap[variant]} ${className}`}>
      {children}
    </span>
  );
}

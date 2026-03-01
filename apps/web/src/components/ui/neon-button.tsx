import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  glow?: boolean;
  children: React.ReactNode;
}

export function NeonButton({
  variant = 'primary',
  size = 'md',
  glow = false,
  className = '',
  children,
  ...props
}: NeonButtonProps) {
  const base =
    'font-[family-name:var(--font-jetbrains)] font-medium tracking-widest uppercase transition-all duration-300 border rounded-[3px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2 relative overflow-hidden';

  const variants: Record<string, string> = {
    primary:
      'bg-[#00ffff] text-[#050505] border-[#00ffff] hover:shadow-[0_0_25px_rgba(0,255,255,0.5),inset_0_0_25px_rgba(0,255,255,0.1)] hover:-translate-y-[1px] active:translate-y-0',
    secondary:
      'bg-transparent text-[#00ffff] border-[rgba(0,255,255,0.4)] hover:bg-[rgba(0,255,255,0.08)] hover:border-[#00ffff] hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:-translate-y-[1px]',
    ghost:
      'bg-transparent text-[rgba(240,240,240,0.55)] border-[rgba(255,255,255,0.08)] hover:text-[#f0f0f0] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.03)]',
    danger:
      'bg-transparent text-[#ef4444] border-[rgba(239,68,68,0.4)] hover:bg-[rgba(239,68,68,0.1)] hover:border-[#ef4444] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  };

  const sizes: Record<string, string> = {
    xs: 'px-2.5 py-1 text-[9px]',
    sm: 'px-3.5 py-1.5 text-[10px]',
    md: 'px-6 py-2.5 text-[11px]',
    lg: 'px-8 py-3.5 text-xs',
  };

  const glowClass = glow
    ? variant === 'primary'
      ? 'shadow-[0_0_30px_rgba(0,255,255,0.5)]'
      : ''
    : '';

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

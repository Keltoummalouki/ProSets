import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function NeonButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: NeonButtonProps) {
  const baseStyles =
    'font-syne font-bold tracking-wider transition-all duration-300 border rounded-sm disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-blue-500 text-black border-blue-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:border-cyan-300',
    secondary:
      'bg-transparent text-white border-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:bg-amber-500/10',
    ghost: 'bg-transparent text-gray-300 border-gray-700 hover:text-white hover:border-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

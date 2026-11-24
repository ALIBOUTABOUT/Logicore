import React from 'react';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

type BadgeVariant = 'upcoming' | 'archived' | 'new' | 'accepted' | 'rejected' | 'default';

const variantStyles: Record<BadgeVariant, string> = {
  upcoming: 'bg-cobalt-50 text-cobalt-500 border-cobalt-200',
  archived: 'bg-paper-tint text-ink-muted border-rule',
  new:      'bg-[#FEF6E6] text-[#9A5B00] border-[#F3D99B]',
  accepted: 'bg-[#EAF7F1] text-[#0E6F4E] border-[#B5E4D0]',
  rejected: 'bg-[#FEF0EE] text-[#B42318] border-[#F7C2BC]',
  default:  'bg-paper-tint text-ink-muted border-rule',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ variant = 'default', children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-[11px] font-mono uppercase tracking-wider font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'new' ? 'bg-[#9A5B00]' :
            variant === 'accepted' ? 'bg-[#0E6F4E]' :
            variant === 'rejected' ? 'bg-[#B42318]' :
            variant === 'upcoming' ? 'bg-cobalt-500' :
            'bg-ink-subtle'
          )}
        />
      )}
      {children}
    </span>
  );
}

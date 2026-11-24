import React from 'react';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  as?: 'div' | 'article' | 'section';
}

export function Card({ children, className, hover, onClick, as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={cn(
        'mono-card p-6',
        hover && 'transition-colors duration-150 cursor-pointer hover:border-navy-900',
        className
      )}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </Tag>
  );
}

import React from 'react';
import { Loader2 } from 'lucide-react';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

function cvaHelper(
  base: string,
  variants: Record<string, Record<string, string>>,
  defaultVariants: Record<string, string>
) {
  return function (props?: Record<string, string | undefined>) {
    const merged = { ...defaultVariants, ...props };
    const variantClasses = Object.entries(merged)
      .map(([key, val]) => (val ? variants[key]?.[val] ?? '' : ''))
      .join(' ');
    return cn(base, variantClasses);
  };
}

const buttonVariants = cvaHelper(
  'inline-flex items-center justify-center gap-2 font-heading font-semibold tracking-wide transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm',
  {
    variant: {
      primary:   'bg-navy-900 hover:bg-cobalt-500 text-paper',
      secondary: 'bg-paper-stock hover:bg-paper-tint text-ink border border-ink/20 hover:border-ink',
      ghost:     'text-ink-muted hover:text-ink hover:bg-paper-tint',
      danger:    'bg-[#B42318] hover:bg-[#911B12] text-white',
      outline:   'border border-cobalt-500 text-cobalt-500 hover:bg-cobalt-50',
    },
    size: {
      sm:   'px-4 py-2 text-xs',
      md:   'px-6 py-3 text-sm',
      lg:   'px-7 py-3.5 text-sm',
      icon: 'p-2',
    },
  },
  { variant: 'primary', size: 'md' }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  as?: 'button' | 'a';
  href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, loading, children, className, disabled, as: Tag = 'button', href, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if (Tag === 'a') {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} disabled={loading || disabled} {...props}>
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

import React from 'react';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-mono uppercase tracking-wider font-medium text-ink">
            {label}
            {props.required && <span className="text-cobalt-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 bg-paper-stock border rounded-sm text-ink placeholder-ink-subtle/60',
            'focus:outline-none transition-colors duration-150',
            error
              ? 'border-[#B42318] focus:border-[#B42318]'
              : 'border-rule focus:border-cobalt-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#B42318] mt-0.5">{error}</p>}
        {hint && !error && <p className="text-xs text-ink-subtle">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

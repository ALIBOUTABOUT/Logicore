import React from 'react';
import { ChevronDown } from 'lucide-react';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-mono uppercase tracking-wider font-medium text-ink">
            {label}
            {props.required && <span className="text-cobalt-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-3 bg-paper-stock border rounded-sm text-ink appearance-none pr-10',
              'focus:outline-none transition-colors duration-150',
              error
                ? 'border-[#B42318] focus:border-[#B42318]'
                : 'border-rule focus:border-cobalt-500',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-paper-stock text-ink-subtle">
                {placeholder}
              </option>
            )}
            {options.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-paper-stock text-ink">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none" />
        </div>
        {error && <p className="text-xs text-[#B42318] mt-0.5">{error}</p>}
        {hint && !error && <p className="text-xs text-ink-subtle">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

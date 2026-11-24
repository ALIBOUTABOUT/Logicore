import React from 'react';
import { Inbox, AlertCircle, CalendarX } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'inbox' | 'error' | 'calendar';
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const icons = {
  inbox:    Inbox,
  error:    AlertCircle,
  calendar: CalendarX,
};

export function EmptyState({ icon = 'inbox', title, description, action }: EmptyStateProps) {
  const Icon = icons[icon];
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="w-12 h-12 rounded-sm bg-paper border border-rule flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-navy-900" />
      </div>
      <h3 className="text-base font-heading font-semibold text-ink mb-1.5">{title}</h3>
      {description && <p className="text-ink-muted max-w-sm text-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

interface TabsProps {
  tabs: { key: string; label: string; badge?: number }[];
  activeTab: string;
  onChange: (key: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="inline-flex border border-rule bg-paper-stock rounded-sm divide-x divide-rule" role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={activeTab === tab.key}
          onClick={() => onChange(tab.key)}
          className={[
            'px-5 py-2.5 text-sm font-heading font-medium transition-colors duration-150 flex items-center gap-2',
            activeTab === tab.key
              ? 'bg-navy-900 text-paper'
              : 'text-ink-muted hover:text-ink hover:bg-paper-tint',
          ].join(' ')}
        >
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className={[
              'text-[11px] font-mono px-1.5 py-0.5 rounded-sm',
              activeTab === tab.key ? 'bg-white/15 text-paper' : 'bg-paper-tint text-ink-muted',
            ].join(' ')}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

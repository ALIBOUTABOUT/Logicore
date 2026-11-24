import { Terminal, AlertCircle, ExternalLink } from 'lucide-react';

export function SetupPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-sm bg-[#FEF6E6] border border-[#F3D99B] flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-[#9A5B00]" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-ink text-xl">Supabase Setup Required</h1>
            <p className="text-ink-muted text-sm">Environment variables are not configured</p>
          </div>
        </div>

        <div className="mono-card p-6 space-y-4">
          <p className="text-ink-muted text-sm leading-relaxed">
            The site needs a <code className="font-mono text-navy-900 bg-paper-tint px-1.5 py-0.5 rounded-sm">.env</code> file
            with your Supabase credentials. Follow these steps:
          </p>

          <div className="bg-paper rounded-sm border border-rule p-4">
            <div className="flex items-center gap-2 mb-3 text-ink-subtle text-xs font-mono">
              <Terminal className="w-4 h-4" />
              <span>.env file (copy from .env.example)</span>
            </div>
            <pre className="text-xs text-navy-900 font-mono overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`}
            </pre>
          </div>

          <ol className="space-y-3 text-sm text-ink-muted">
            <li className="flex gap-3">
              <span className="font-mono text-navy-900 font-semibold shrink-0">01.</span>
              <span>
                Create a Supabase project at{' '}
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-cobalt-500 hover:underline inline-flex items-center gap-1">
                  supabase.com <ExternalLink className="w-3 h-3" />
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-navy-900 font-semibold shrink-0">02.</span>
              <span>Run <code className="font-mono text-navy-900 bg-paper-tint px-1.5 py-0.5 rounded-sm">supabase/schema.sql</code> in the SQL editor</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-navy-900 font-semibold shrink-0">03.</span>
              <span>Copy your project URL and anon key from Project Settings › API into <code className="font-mono text-navy-900 bg-paper-tint px-1.5 py-0.5 rounded-sm">.env</code></span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-navy-900 font-semibold shrink-0">04.</span>
              <span>Restart the dev server with <code className="font-mono text-navy-900 bg-paper-tint px-1.5 py-0.5 rounded-sm">npm run dev</code></span>
            </li>
          </ol>

          <p className="text-ink-subtle text-xs pt-2 border-t border-rule">
            See <strong className="text-ink">README.md</strong> for the full setup guide.
          </p>
        </div>
      </div>
    </div>
  );
}

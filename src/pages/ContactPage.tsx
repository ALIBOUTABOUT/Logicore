import { Helmet } from 'react-helmet-async';
import { Mail, Instagram, MapPin, ArrowUpRight, Clock } from 'lucide-react';
import { CLUB } from '../constants';

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact — LogiCore Club</title>
        <meta name="description" content="Get in touch with LogiCore Club. Find us on Instagram or via email." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {/* Asymmetric header */}
        <div className="border-b border-rule pb-10 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500">
              Directory
            </span>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-ink mt-2">
              Contact Us
            </h1>
          </div>
          <p className="lg:col-span-5 text-ink-muted text-base leading-relaxed">
            Have questions about LogiCore Club or want to collaborate on an academic event?
            Reach us directly through the channels below.
          </p>
        </div>

        {/* 3-cell hairline directory (no icon circles, no heavy shadows) */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-rule bg-paper-stock mb-10">
          <div className="p-8 border-b md:border-b-0 md:border-r border-rule flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-cobalt-500 mb-4">
                <span>Email</span>
                <Mail className="w-4 h-4 text-navy-900" />
              </div>
              <h2 className="font-heading font-semibold text-ink text-xl mb-2">Direct Email</h2>
              <p className="text-ink-muted text-sm leading-relaxed">
                For partnership proposals, speaker inquiries, or student questions.
              </p>
            </div>
            <a
              href={`mailto:${CLUB.email}`}
              className="inline-flex items-center gap-1.5 text-navy-900 hover:text-cobalt-500 font-mono text-sm font-medium transition-colors break-all"
            >
              {CLUB.email}
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>
          </div>

          <div className="p-8 border-b md:border-b-0 md:border-r border-rule flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-cobalt-500 mb-4">
                <span>Social</span>
                <Instagram className="w-4 h-4 text-navy-900" />
              </div>
              <h2 className="font-heading font-semibold text-ink text-xl mb-2">Instagram</h2>
              <p className="text-ink-muted text-sm leading-relaxed">
                Follow for event dates, live coverage, and recruitment announcements.
              </p>
            </div>
            <a
              href={CLUB.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-navy-900 hover:text-cobalt-500 font-mono text-sm font-medium transition-colors"
            >
              {CLUB.instagramHandle}
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>
          </div>

          <div className="p-8 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-cobalt-500 mb-4">
                <span>Campus</span>
                <MapPin className="w-4 h-4 text-navy-900" />
              </div>
              <h2 className="font-heading font-semibold text-ink text-xl mb-2">Location</h2>
              <p className="text-ink-muted text-sm leading-relaxed">
                {CLUB.address}
              </p>
            </div>
            <span className="font-mono text-xs text-ink-subtle">
              {CLUB.university}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 border border-rule bg-paper-stock">
          <Clock className="w-4 h-4 text-navy-900 mt-0.5 shrink-0" />
          <p className="text-ink-muted text-sm">
            We typically reply to emails within 1–2 business days. For the quickest updates, follow{' '}
            <a href={CLUB.instagram} target="_blank" rel="noopener noreferrer" className="text-cobalt-500 hover:underline">
              {CLUB.instagramHandle}
            </a>.
          </p>
        </div>
      </div>
    </>
  );
}

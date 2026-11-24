import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { ABOUT_CONTENT, CLUB } from '../constants';

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About — LogiCore Club</title>
        <meta name="description" content="Learn about LogiCore Club's mission, vision, and activities at FSE, Djillali Liabes University." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {/* Asymmetric Header */}
        <div className="border-b border-rule pb-10 mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500">
              About the Club
            </span>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-ink mt-2">
              About LogiCore
            </h1>
          </div>
          <p className="lg:col-span-5 text-ink-muted text-base leading-relaxed">
            A student-led scientific club bridging mathematics and computer science at the{' '}
            {CLUB.faculty}, {CLUB.university}.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-rule bg-paper-stock mb-16">
          <div className="p-8 sm:p-10 border-b md:border-b-0 md:border-r border-rule">
            <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500 block mb-3">
              Mission
            </span>
            <h2 className="font-heading font-bold text-ink text-2xl mb-4">Our Mission</h2>
            <p className="text-ink-muted leading-relaxed text-sm sm:text-base">{ABOUT_CONTENT.mission}</p>
          </div>
          <div className="p-8 sm:p-10">
            <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500 block mb-3">
              Vision
            </span>
            <h2 className="font-heading font-bold text-ink text-2xl mb-4">Our Vision</h2>
            <p className="text-ink-muted leading-relaxed text-sm sm:text-base">{ABOUT_CONTENT.vision}</p>
          </div>
        </div>

        {/* What we do */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 pb-16 border-b border-rule">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500 block mb-2">
              Activities
            </span>
            <h2 className="text-3xl font-heading font-bold text-ink mb-4">What We Do</h2>
            <p className="text-ink-muted text-sm leading-relaxed">
              From weekly study sessions to university-wide lectures and competitions.
            </p>
          </div>

          <div className="lg:col-span-8 border-t border-ink/20 divide-y divide-rule">
            {ABOUT_CONTENT.whatWeDo.map((item, i) => (
              <div key={item.title} className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline">
                <div className="sm:col-span-1 font-mono text-xs text-cobalt-500 font-semibold">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="sm:col-span-11">
                  <h3 className="font-heading font-semibold text-ink text-lg mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-ink-muted text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selection Process & Location */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 mono-card p-8 flex flex-col justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500 block mb-2">
                Admission
              </span>
              <h2 className="text-2xl font-heading font-bold text-ink mb-4">Selection Process</h2>
              <p className="text-ink-muted text-sm sm:text-base leading-relaxed">
                {ABOUT_CONTENT.selectionProcess}
              </p>
            </div>
            <div>
              <Link to="/join" className="btn-primary">
                Apply to Join <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 mono-card p-8 flex flex-col justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500 block mb-2">
                Campus
              </span>
              <h2 className="text-2xl font-heading font-bold text-ink mb-4">Where We Meet</h2>
              <p className="text-ink-muted text-sm sm:text-base leading-relaxed mb-6">
                {ABOUT_CONTENT.location}
              </p>
            </div>
            <div className="pt-5 border-t border-rule space-y-1.5 text-sm">
              <div className="flex items-center gap-2 font-medium text-ink">
                <MapPin className="w-4 h-4 text-navy-900 shrink-0" />
                {CLUB.faculty}
              </div>
              <div className="pl-6 text-ink-muted">{CLUB.university}</div>
              <div className="pl-6 font-mono text-xs text-ink-subtle">{CLUB.streetAddress}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

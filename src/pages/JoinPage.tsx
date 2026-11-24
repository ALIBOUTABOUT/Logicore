import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Send } from 'lucide-react';
import { Input, Textarea, Select, Button } from '../components/ui';
import { joinSchema, type JoinSchema } from '../utils/validation';
import { submitJoinRequest } from '../lib/api/requests';
import { ACADEMIC_YEARS, INTERESTS, CLUB } from '../constants';
import type { AcademicYear, Interest } from '../types';

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<JoinSchema>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      major: '',
      academic_year: '' as AcademicYear,
      interests: [],
      message: '',
      honeypot: '',
    },
  });

  const messageValue = watch('message', '');

  const onSubmit = async (data: JoinSchema) => {
    if (submitting || submitted) return;
    if (data.honeypot && data.honeypot.length > 0) return;

    setSubmitting(true);
    setServerError(null);

    const result = await submitJoinRequest(data);

    setSubmitting(false);
    if (result.error) {
      setServerError(result.error);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <>
        <Helmet><title>Application Sent — LogiCore Club</title></Helmet>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="mono-card p-10 sm:p-12">
            <div className="w-12 h-12 rounded-sm bg-[#EAF7F1] border border-[#B5E4D0] flex items-center justify-center mb-6">
              <CheckCircle2 className="w-6 h-6 text-[#0E6F4E]" />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#0E6F4E] block mb-2">
              APPLICATION LOGGED
            </span>
            <h1 className="text-3xl font-heading font-bold text-ink mb-3">Application Received</h1>
            <p className="text-ink-muted leading-relaxed mb-6">
              Thank you for applying to LogiCore Club. Our committee will review your submission and
              contact you at the email address you provided.
            </p>
            <p className="font-mono text-xs text-ink-subtle pt-4 border-t border-rule">
              Questions? Write to{' '}
              <a href={`mailto:${CLUB.email}`} className="text-cobalt-500 hover:underline">
                {CLUB.email}
              </a>
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Join LogiCore Club</title>
        <meta name="description" content="Apply to join LogiCore Club at FSE, UDL — a community for math and programming enthusiasts." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left 4 cols: Editorial brief */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500">
                Membership Form
              </span>
              <h1 className="text-4xl font-heading font-bold text-ink mt-2 mb-4">
                Apply to Join
              </h1>
              <p className="text-ink-muted text-sm sm:text-base leading-relaxed">
                Complete the application form to join LogiCore Club. We welcome curious and motivated
                students across exact sciences and computing.
              </p>
            </div>

            <div className="border-t border-rule pt-5 space-y-4 text-sm">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-subtle">
                  Eligibility
                </div>
                <div className="text-ink mt-1">Students from L1 through PhD at UDL</div>
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-subtle">
                  Next Step
                </div>
                <div className="text-ink mt-1">Shortlisted applicants are invited for an info session & interview</div>
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-subtle">
                  Contact
                </div>
                <a href={`mailto:${CLUB.email}`} className="text-cobalt-500 hover:underline block mt-1">
                  {CLUB.email}
                </a>
              </div>
            </div>
          </div>

          {/* Right 8 cols: Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mono-card p-6 sm:p-8 space-y-6 relative">
              {/* Honeypot — hidden from humans */}
              <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor="website-field">Website</label>
                <input
                  id="website-field"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register('honeypot')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Full Name"
                  placeholder="Your full name"
                  error={errors.full_name?.message}
                  required
                  {...register('full_name')}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  required
                  {...register('email')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+213 XXX XXX XXX"
                  error={errors.phone?.message}
                  hint="Optional"
                  {...register('phone')}
                />
                <Input
                  label="Field of Study / Major"
                  placeholder="e.g. Computer Science, Mathematics…"
                  error={errors.major?.message}
                  required
                  {...register('major')}
                />
              </div>

              <Controller
                name="academic_year"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Academic Year"
                    placeholder="Select your year…"
                    options={ACADEMIC_YEARS.map(y => ({ value: y, label: y }))}
                    error={errors.academic_year?.message}
                    required
                    {...field}
                  />
                )}
              />

              {/* Interests — multi-select chips */}
              <div className="flex flex-col gap-2">
                <Controller
                  name="interests"
                  control={control}
                  render={({ field }) => {
                    const toggle = (interest: Interest) => {
                      const current = field.value as Interest[];
                      if (current.includes(interest)) {
                        field.onChange(current.filter(i => i !== interest));
                      } else {
                        field.onChange([...current, interest]);
                      }
                    };
                    return (
                      <div>
                        <span className="text-xs font-mono uppercase tracking-wider font-medium text-ink">
                          Interests <span className="text-cobalt-500">*</span>
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {INTERESTS.map(interest => {
                            const selected = (field.value as Interest[]).includes(interest);
                            return (
                              <button
                                key={interest}
                                type="button"
                                onClick={() => toggle(interest)}
                                className={[
                                  'px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider border transition-colors duration-150',
                                  selected
                                    ? 'bg-navy-900 border-navy-900 text-paper'
                                    : 'bg-paper border-rule text-ink-muted hover:border-ink hover:text-ink',
                                ].join(' ')}
                                aria-pressed={selected}
                              >
                                {interest}
                              </button>
                            );
                          })}
                        </div>
                        {errors.interests?.message && (
                          <p className="text-xs text-[#B42318] mt-1.5">{errors.interests.message}</p>
                        )}
                      </div>
                    );
                  }}
                />
              </div>

              {/* Message / motivation */}
              <div>
                <Textarea
                  label="Why do you want to join LogiCore?"
                  placeholder="Tell us about your motivation, goals, and what you hope to build or learn… (20–600 characters)"
                  error={errors.message?.message}
                  required
                  rows={5}
                  {...register('message')}
                />
                <p className="font-mono text-xs text-ink-subtle mt-1.5 text-right">
                  {messageValue.length}/600
                </p>
              </div>

              {serverError && (
                <div className="p-4 bg-[#FEF0EE] border border-[#F7C2BC] rounded-sm text-[#B42318] text-sm">
                  <strong>Error:</strong> {serverError}. Please try again or email us at {CLUB.email}.
                </div>
              )}

              <Button type="submit" loading={submitting} disabled={submitting} size="lg" className="w-full sm:w-auto">
                <Send className="w-4 h-4" /> Submit Application
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

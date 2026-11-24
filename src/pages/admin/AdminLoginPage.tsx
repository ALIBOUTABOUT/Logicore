import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input, Button } from '../../components/ui';
import { Navigate, Link } from 'react-router-dom';

const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const { user, loading, signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return <Navigate to="/admin/events" replace />;

  const onSubmit = async (data: LoginValues) => {
    setAuthError(null);
    const error = await signIn(data.email, data.password);
    if (error) {
      setAuthError(
        error.message === 'Invalid login credentials'
          ? 'Incorrect email or password. Please try again.'
          : error.message
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login — LogiCore Club</title>
      </Helmet>

      <div className="min-h-screen bg-paper flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex flex-col items-start mb-6">
            <img
              src="/logo.png"
              alt="LogiCore Club"
              className="w-14 h-14 object-contain mix-blend-multiply mb-4"
            />
            <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500">
              Restricted Access
            </span>
            <h1 className="font-heading font-bold text-ink text-2xl mt-1">LogiCore Admin</h1>
            <p className="text-ink-muted text-sm mt-1">Sign in to manage events and applications</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mono-card p-6 space-y-5" noValidate>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              error={errors.email?.message}
              required
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                error={errors.password?.message}
                required
                className="pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-9 text-ink-subtle hover:text-ink transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {authError && (
              <div className="flex items-start gap-2 p-3 bg-[#FEF0EE] border border-[#F7C2BC] rounded-sm text-[#B42318] text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full"
              size="md"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-ink-subtle">
            <span>Public sign-up disabled</span>
            <Link to="/" className="text-navy-900 hover:text-cobalt-500 font-mono transition-colors">
              ← Public site
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

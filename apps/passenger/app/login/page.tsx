'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bus, Eye, EyeOff } from 'lucide-react';
import { dataProvider } from '@/lib/data';
import { LoadingSpinner } from '@smart-bus/ui';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) newErrors.email = 'Please enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    setLoading(true);
    try {
      await dataProvider.signIn(email, password);
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid login credentials';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row font-body-md">
      {/* Left/Top Section: Brand & Image (Hidden on small mobile, shown on md screens) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-surface-container-low relative flex-col justify-between p-page-padding-desktop">
        {/* Abstract Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="bg-cover bg-center w-full h-full opacity-60"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCqIJIsjIIgrxWK-met11ZK1auOGJqI29ayAltEBC15gxnzDHHVAyLiji3E6lN9RaIMDtCIa1ii2J1vro9FBa9LZL_XK6wAEwlXoKRUlnyVWdOtMuEpbKKKSwd9eAiWsaMZX5hCUlLYedyEUpIsxzsPwY1P0BtpoZYQh0ykWvKLcJjkmOrnn_mS8511HS8I8UlVtnF1_vFmHBpS17Oo4zMtVplvmeTCjAqP7PPaUij9ftoX6cYiYh5vpg')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low to-transparent opacity-50"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-unit">
            <div className="bg-primary-container text-on-primary w-10 h-10 rounded-lg flex items-center justify-center shadow-[0_8px_24px_rgba(16,42,67,0.14)]">
              <Bus className="w-5 h-5 fill-current" />
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface">Smart Bus AI</h1>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="font-display-lg text-display-lg text-on-surface mb-gutter">Navigate with Precision.</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Real-time tracking and intelligent routing for your daily commute. Powered by predictable AI.</p>
        </div>
      </div>

      {/* Right/Bottom Section: Sign In Form */}
      <div className="w-full md:w-1/2 lg:w-2/5 min-h-screen flex items-center justify-center p-page-padding-mobile md:p-page-padding-desktop bg-surface z-10">
        <div className="w-full max-w-[400px]">
          {/* Mobile Header (Only visible on small screens) */}
          <div className="md:hidden flex items-center gap-unit mb-8">
            <div className="bg-primary-container text-on-primary w-8 h-8 rounded-lg flex items-center justify-center shadow-sm">
              <Bus className="w-4 h-4 fill-current" />
            </div>
            <h1 className="font-headline-sm text-headline-sm text-on-surface">Smart Bus AI</h1>
          </div>

          {/* Header Content */}
          <div className="mb-8">
            <h2 className="font-headline-lg-mobile md:font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-unit">Welcome back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Track your bus in real time.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-gutter">
            {errors.general && (
              <div className="bg-error/10 text-error font-body-md text-body-md p-3 rounded-lg border border-error/20">
                {errors.general}
              </div>
            )}

            {/* Email Field */}
            <div>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); }}
                  required
                  placeholder=" "
                  className={
                    'peer border rounded-lg px-4 pb-2 pt-6 w-full transition-all bg-transparent focus:outline-none focus:border-2 ' +
                    (errors.email ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary-container')
                  }
                />
                <label
                  htmlFor="email"
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-on-surface-variant font-label-data text-label-data transition-all pointer-events-none peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-label-caps peer-focus:text-primary-container peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-label-caps peer-[:not(:placeholder-shown)]:text-on-surface-variant"
                >
                  Email Address
                </label>
              </div>
              {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: '' })); }}
                  required
                  placeholder=" "
                  className={
                    'peer border rounded-lg px-4 pr-12 pb-2 pt-6 w-full transition-all bg-transparent focus:outline-none focus:border-2 ' +
                    (errors.password ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary-container')
                  }
                />
                <label
                  htmlFor="password"
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-on-surface-variant font-label-data text-label-data transition-all pointer-events-none peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-label-caps peer-focus:text-primary-container peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-label-caps peer-[:not(:placeholder-shown)]:text-on-surface-variant"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end mt-unit mb-6">
              <Link
                href="/forgot-password"
                className="font-label-data text-label-data text-primary hover:text-on-primary-fixed-variant transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Primary CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container hover:bg-surface-tint text-on-primary font-label-data text-label-data h-14 rounded-[12px] flex items-center justify-center transition-colors shadow-[0_8px_24px_rgba(16,42,67,0.14)] focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size={20} /> : 'Sign in'}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              New here? <Link href="/register" className="font-label-data text-label-data text-primary hover:text-on-primary-fixed-variant transition-colors ml-1">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

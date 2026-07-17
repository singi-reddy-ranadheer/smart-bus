'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Bus } from 'lucide-react';
import { dataProvider } from '@/lib/data';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await dataProvider.register(email, password, name, phone);
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Unable to create account right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-on-background">
      <header className="flex items-center justify-between border-b border-outline-variant bg-surface px-4 py-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container-low"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">Create Account</h1>
        <div className="w-10" />
      </header>

      <section className="mx-auto flex max-w-md flex-col gap-6 px-4 py-8">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-outline-variant bg-surface p-6 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary">
            <Bus className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">Join Smart Bus</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Sign up to track buses and plan your trip.</p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface p-5 shadow-sm">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="rounded-lg border border-outline-variant bg-background px-3 py-3 outline-none"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="rounded-lg border border-outline-variant bg-background px-3 py-3 outline-none"
            required
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="rounded-lg border border-outline-variant bg-background px-3 py-3 outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-outline-variant bg-background px-3 py-3 pr-12 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="rounded-lg border border-outline-variant bg-background px-3 py-3 outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-3 font-medium text-on-primary transition-colors hover:opacity-90 disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

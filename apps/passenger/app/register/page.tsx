'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Bus } from 'lucide-react';
import { dataProvider } from '@/lib/data';
import { LoadingSpinner } from '@smart-bus/ui';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) newErrors.email = 'Please enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(password)) newErrors.password = 'Must contain an uppercase letter';
    else if (!/[0-9]/.test(password)) newErrors.password = 'Must contain a number';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    setLoading(true);
    try {
      await dataProvider.register(email, password, name, phone);
      router.push('/');
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : 'Unable to create account right now.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='min-h-screen bg-background text-on-background'>
      <header className='flex items-center justify-between border-b border-outline-variant bg-surface px-4 py-4'>
        <button type='button' onClick={() => router.back()} className='rounded-full p-2 text-primary transition-colors hover:bg-surface-container-low'>
          <ArrowLeft className='h-6 w-6' />
        </button>
        <h1 className='text-lg font-semibold'>Create Account</h1>
        <div className='w-10' />
      </header>
      <section className='mx-auto flex max-w-md flex-col gap-6 px-4 py-8'>
        <div className='flex flex-col items-center gap-3 rounded-2xl border border-outline-variant bg-surface p-6 shadow-sm'>
          <div className='flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary'>
            <Bus className='h-7 w-7' />
          </div>
          <div className='text-center'>
            <h2 className='text-xl font-semibold'>Join Smart Bus</h2>
            <p className='mt-1 text-sm text-on-surface-variant'>Sign up to track buses and plan your trip.</p>
          </div>
        </div>
        <form onSubmit={handleRegister} className='flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface p-5 shadow-sm'>
          {errors.general && <div className='bg-error/10 text-error font-body-md text-body-md p-3 rounded-lg border border-error/20'>{errors.general}</div>}
          <div>
            <input value={name} onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: '' })); }} placeholder='Full name' className={'rounded-lg border ' + (errors.name ? 'border-error' : 'border-outline-variant') + ' bg-background px-3 py-3 outline-none w-full'} required />
            {errors.name && <p className='text-error text-xs mt-1'>{errors.name}</p>}
          </div>
          <div>
            <input type='email' value={email} onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); }} placeholder='Email address' className={'rounded-lg border ' + (errors.email ? 'border-error' : 'border-outline-variant') + ' bg-background px-3 py-3 outline-none w-full'} required />
            {errors.email && <p className='text-error text-xs mt-1'>{errors.email}</p>}
          </div>
          <div>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder='Phone number' className='rounded-lg border border-outline-variant bg-background px-3 py-3 outline-none w-full' />
          </div>
          <div>
            <div className='relative'>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: '' })); }} placeholder='Password' className={'w-full rounded-lg border ' + (errors.password ? 'border-error' : 'border-outline-variant') + ' bg-background px-3 py-3 pr-12 outline-none'} required />
              <button type='button' onClick={() => setShowPassword(p => !p)} className='absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant'>
                {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
              </button>
            </div>
            {errors.password && <p className='text-error text-xs mt-1'>{errors.password}</p>}
          </div>
          <div>
            <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(p => ({ ...p, confirmPassword: '' })); }} placeholder='Confirm password' className={'rounded-lg border ' + (errors.confirmPassword ? 'border-error' : 'border-outline-variant') + ' bg-background px-3 py-3 outline-none w-full'} required />
            {errors.confirmPassword && <p className='text-error text-xs mt-1'>{errors.confirmPassword}</p>}
          </div>
          <button type='submit' disabled={loading} className='flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-on-primary transition-colors hover:opacity-90 disabled:opacity-70'>
            {loading ? <><LoadingSpinner size={18} /> Creating account...</> : 'Create account'}
          </button>
        </form>
        <p className='text-center text-sm text-on-surface-variant'>
          Already have an account? <Link href='/login' className='font-medium text-primary'>Sign in</Link>
        </p>
      </section>
    </main>
  );
}

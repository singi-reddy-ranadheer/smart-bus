'use client';

export const dynamic = 'force-dynamic';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bus, Mail, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@smart-bus/ui';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login`,
            });
            if (resetError) throw new Error(resetError.message);
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background text-on-background">
            <header className="flex items-center justify-between border-b border-outline-variant bg-surface px-4 py-4">
                <Link
                    href="/login"
                    className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container-low"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-lg font-semibold">Reset Password</h1>
                <div className="w-10" />
            </header>

            <section className="mx-auto flex max-w-md flex-col gap-6 px-4 py-8">
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-outline-variant bg-surface p-6 shadow-sm">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary">
                        <Bus className="h-7 w-7" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">Forgot password?</h2>
                        <p className="mt-1 text-sm text-on-surface-variant">
                            Enter your email and we&apos;ll send you a reset link.
                        </p>
                    </div>
                </div>

                {success ? (
                    <div className="flex flex-col items-center gap-4 rounded-2xl border border-outline-variant bg-surface p-8 shadow-sm text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-secondary">
                            <CheckCircle2 className="h-7 w-7" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-on-surface">Check your inbox</h3>
                            <p className="mt-2 text-sm text-on-surface-variant">
                                If an account exists with <strong>{email}</strong>, you will receive a password
                                reset link shortly.
                            </p>
                        </div>
                        <Link
                            href="/login"
                            className="mt-2 rounded-lg bg-primary px-6 py-3 font-medium text-on-primary transition-colors hover:opacity-90"
                        >
                            Back to login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface p-5 shadow-sm">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError('');
                                }}
                                placeholder="Email address"
                                className="w-full rounded-lg border border-outline-variant bg-background px-3 py-3 pl-10 outline-none focus:border-primary"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-error flex items-center gap-1">
                                <span>•</span> {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-on-primary transition-colors hover:opacity-90 disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size={18} />
                                    Sending...
                                </>
                            ) : (
                                'Send reset link'
                            )}
                        </button>
                    </form>
                )}

                <p className="text-center text-sm text-on-surface-variant">
                    Remember your password?{' '}
                    <Link href="/login" className="font-medium text-primary">
                        Sign in
                    </Link>
                </p>
            </section>
        </main>
    );
}


'use client';
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="p-10 text-center">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Something went wrong</h2>
      <p className="font-body-md text-body-md text-on-surface-variant mb-6">We encountered an unexpected error. Please try again.</p>
      <button onClick={() => reset()} className="px-6 py-3 rounded-xl bg-primary text-on-primary font-label-data text-label-data hover:opacity-90 transition-opacity">Try again</button>
    </div>
  );
}


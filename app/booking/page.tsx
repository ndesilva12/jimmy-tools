'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BookingPage() {
  const [calendarOpened, setCalendarOpened] = useState(false);

  const calendarUrl = 'https://calendar.app.google/G6Pge7VEa6uXeDhz6';

  useEffect(() => {
    // Auto-open calendar in new tab on page load
    const timer = setTimeout(() => {
      window.open(calendarUrl, '_blank');
      setCalendarOpened(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const openCalendar = () => {
    window.open(calendarUrl, '_blank');
    setCalendarOpened(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 p-6">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80">
            <span className="text-3xl">🛠️</span>
            <span className="text-xl font-bold">Jimmy Tools</span>
          </Link>
        </div>
      </header>

      {/* Confirmation */}
      <main className="max-w-2xl mx-auto p-6 mt-12">
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 text-center">
          {/* Success Icon */}
          <div className="text-6xl mb-6">🎉</div>
          
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          
          <p className="text-zinc-400 mb-8 text-lg">
            Your 1-on-1 OpenClaw Setup Session has been purchased.<br />
            Now let's schedule your call.
          </p>

          {/* Calendar Button */}
          <button
            onClick={openCalendar}
            className="w-full py-4 bg-[#9CB853] hover:bg-[#A8C45E] text-black rounded-xl font-semibold text-lg transition-colors mb-4"
          >
            📅 {calendarOpened ? 'Open Calendar Again' : 'Schedule Your Session'}
          </button>

          {calendarOpened && (
            <p className="text-[#A8C45E] text-sm mb-6">
              ✓ Calendar opened in new tab
            </p>
          )}

          {/* Next Steps */}
          <div className="bg-zinc-800 rounded-xl p-6 text-left mt-8">
            <h3 className="font-semibold text-[#A8C45E] mb-4">Next Steps:</h3>
            <ol className="space-y-3 text-zinc-300">
              <li className="flex gap-3">
                <span className="text-[#A8C45E] font-bold">1.</span>
                Pick a time slot that works for you
              </li>
              <li className="flex gap-3">
                <span className="text-[#A8C45E] font-bold">2.</span>
                You'll receive a calendar invite with video call link
              </li>
              <li className="flex gap-3">
                <span className="text-[#A8C45E] font-bold">3.</span>
                Join the call at your scheduled time
              </li>
              <li className="flex gap-3">
                <span className="text-[#A8C45E] font-bold">4.</span>
                Walk away with a fully working OpenClaw setup!
              </li>
            </ol>
          </div>

          {/* Support */}
          <p className="text-zinc-500 text-sm mt-8">
            Questions? <Link href="/contact" className="text-[#A8C45E] hover:text-[#B8D46E]">Contact Support</Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-zinc-500 hover:text-zinc-400">
            ← Back to Jimmy Tools
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 p-6 mt-12">
        <div className="max-w-2xl mx-auto text-center text-zinc-500 text-sm">
          © 2026 Jimmy Tools. Built by an AI, for humans.
        </div>
      </footer>
    </div>
  );
}

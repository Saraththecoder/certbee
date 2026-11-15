import { Check, CheckCircle2, Copy, Mail } from 'lucide-react';
import React, { useState } from 'react';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 10) {
      setError('Please include a brief note (at least 10 characters).');
      return;
    }
    setCopied(false);
    setSubmitted(true);
  };

  const handleCopyInquiry = async () => {
    const formatted = `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-[75vh]">
      <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16 space-y-8">
        <div className="space-y-3">
          <span className="inline-block rounded-sm border border-[#141414] bg-[#C8EFE0] px-2.5 py-1 font-mono-tabular text-[11px] font-semibold uppercase tracking-wider text-[#141414]">
            Contact
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141414]">
            Questions, bug reports, or feedback
          </h1>
          <p className="text-base text-[#52525B]">
            Running an institutional event or spotted a rendering edge case? Prepare a note below or email{' '}
            <a
              href="mailto:hello@certbee.in"
              className="font-semibold text-[#2563EB] hover:underline underline-offset-4"
            >
              hello@certbee.in
            </a>
            .
          </p>
        </div>

        {submitted ? (
          <div className="rounded-sm border-[1.5px] border-[#141414] bg-white p-8 space-y-4 shadow-[4px_4px_0_#1FA971]">
            <div className="flex items-center gap-2 text-[#1FA971] font-bold">
              <CheckCircle2 className="h-5 w-5" />
              <span>Inquiry ready to send</span>
            </div>
            <p className="text-sm text-[#52525B]">
              Thank you, {name}. Launch your email client below to deliver directly to{' '}
              <strong className="text-[#141414]">hello@certbee.in</strong>, or copy the formatted message to paste into webmail.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`mailto:hello@certbee.in?subject=${encodeURIComponent(
                  `CertBee Inquiry from ${name}`
                )}&body=${encodeURIComponent(`Reply to: ${email}\n\n${message}`)}`}
                className="inline-flex items-center gap-2 rounded-sm border-[1.5px] border-[#141414] bg-[#F6C33E] px-4 py-2 text-sm font-semibold text-[#141414] hover:bg-[#f2b824] transition-colors"
              >
                <Mail className="h-4 w-4" />
                Open in email client
              </a>
              <button
                type="button"
                onClick={handleCopyInquiry}
                className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-white px-4 py-2 text-sm font-medium text-[#141414] hover:bg-[#F3F1EA]"
              >
                {copied ? <Check className="h-4 w-4 text-[#1FA971]" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied message' : 'Copy inquiry text'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setCopied(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="rounded-sm border-[1.5px] border-[#141414]/35 bg-white px-4 py-2 text-sm font-medium text-[#52525B] hover:border-[#141414] hover:text-[#141414]"
              >
                Edit message
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-sm border-[1.5px] border-[#141414] bg-white p-6 sm:p-8 space-y-5 shadow-[5px_5px_0_#141414]"
          >
            {error && (
              <p role="alert" className="rounded-sm border border-[#DC2626] bg-[#FEF2F2] px-3.5 py-2.5 text-sm text-[#B91C1C]">
                {error}
              </p>
            )}

            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="block text-sm font-semibold text-[#141414]">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priya Sharma"
                className="w-full rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-3.5 py-2.5 text-sm text-[#141414] placeholder:text-[#71717A] focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="block text-sm font-semibold text-[#141414]">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-3.5 py-2.5 text-sm text-[#141414] placeholder:text-[#71717A] focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-message" className="block text-sm font-semibold text-[#141414]">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your certificate batch or question..."
                className="w-full rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-3.5 py-2.5 text-sm text-[#141414] placeholder:text-[#71717A] focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto rounded-sm border-[1.5px] border-[#141414] bg-[#141414] px-6 py-2.5 font-mono-tabular text-xs font-semibold tracking-wider text-white hover:bg-[#27272A] transition-colors shadow-[3px_3px_0_#2563EB]"
            >
              SEND MESSAGE
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

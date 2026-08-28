'use client'

import { useRef, useState } from 'react'
import { ArrowRight, Loader2, Phone, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { KrishiLogo } from '@/components/krishi-logo'
import { GoogleIcon } from '@/components/google-icon'

interface LoginPanelProps {
  onAuthenticated: () => void
}

export function LoginPanel({ onAuthenticated }: LoginPanelProps) {
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const otpRefs = useRef<Array<HTMLInputElement | null>>([])

  const phoneValid = phone.replace(/\D/g, '').length >= 10

  function handleSendOtp() {
    if (!phoneValid || sending) return
    setSending(true)
    // Simulated OTP dispatch
    setTimeout(() => {
      setSending(false)
      setStep('otp')
      setTimeout(() => otpRefs.current[0]?.focus(), 50)
    }, 900)
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    if (digit && index < 3) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  function handleVerify() {
    if (otp.some((d) => !d) || verifying) return
    setVerifying(true)
    setTimeout(() => {
      setVerifying(false)
      onAuthenticated()
    }, 900)
  }

  return (
    <section className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2">
      <div className="w-full max-w-sm">
        {/* Mobile logo (hidden on desktop where hero shows it) */}
        <div className="mb-8 lg:hidden">
          <KrishiLogo />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            {step === 'phone' ? 'Welcome, farmer' : 'Verify your number'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {step === 'phone'
              ? 'Sign in or create your account to get AI-powered crop guidance.'
              : `Enter the 4-digit code we sent to +91 ${phone || 'your phone'}.`}
          </p>
        </div>

        {step === 'phone' ? (
          <div className="space-y-5">
            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Phone number
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="size-4" aria-hidden="true" />
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.nativeEvent.isComposing)
                        handleSendOtp()
                    }}
                    className="h-11 w-full rounded-lg border border-input bg-background pl-[4.75rem] pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={!phoneValid || sending}
                  className="h-11 shrink-0 bg-primary px-4 text-primary-foreground hover:bg-primary/90"
                >
                  {sending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                or
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={onAuthenticated}
              className="h-11 w-full gap-3 border-input bg-background text-sm font-medium text-foreground hover:bg-secondary"
            >
              <GoogleIcon className="size-5" />
              Sign in with Google
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex justify-between gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  aria-label={`OTP digit ${i + 1}`}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="h-14 w-full rounded-lg border border-input bg-background text-center text-xl font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              ))}
            </div>

            <Button
              type="button"
              onClick={handleVerify}
              disabled={otp.some((d) => !d) || verifying}
              className="h-11 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {verifying ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Verify &amp; continue
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => {
                setStep('phone')
                setOtp(['', '', '', ''])
              }}
              className="w-full text-center text-sm font-medium text-primary hover:underline"
            >
              Change phone number
            </button>
          </div>
        )}

        <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
          Your data is encrypted and never shared.
        </p>
      </div>
    </section>
  )
}

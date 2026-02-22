import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, CheckCircle, RefreshCw } from 'lucide-react'
import AuthLayout from './AuthLayout'
import { useAuthStore } from '@/store/authStore'

type Strength = 'none' | 'weak' | 'fair' | 'strong'

function getStrength(pw: string): Strength {
  if (!pw) return 'none'
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return 'weak'
  if (score === 2) return 'fair'
  return 'strong'
}

const STRENGTH_CONFIG: Record<Strength, { label: string; color: string; bars: number }> = {
  none:   { label: '',       color: 'bg-zh-border',  bars: 0 },
  weak:   { label: 'Weak',   color: 'bg-red-400',    bars: 1 },
  fair:   { label: 'Fair',   color: 'bg-yellow-400', bars: 2 },
  strong: { label: 'Strong', color: 'bg-zh-teal',    bars: 3 },
}

// ─── OTP Input ───────────────────────────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const digits = value.padEnd(6, ' ').split('')

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      const next = value.slice(0, idx)
      onChange(next)
      const prev = document.getElementById(`otp-${idx - 1}`)
      prev?.focus()
      return
    }
    if (/^\d$/.test(e.key)) {
      const next = value.slice(0, idx) + e.key + value.slice(idx + 1)
      onChange(next.slice(0, 6))
      if (idx < 5) {
        const nextEl = document.getElementById(`otp-${idx + 1}`)
        nextEl?.focus()
      }
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d === ' ' ? '' : d}
          onKeyDown={(e) => handleKey(e, i)}
          onChange={() => {}}
          onFocus={(e) => e.target.select()}
          className="w-11 h-12 text-center text-lg font-bold bg-zh-card2 border border-zh-border rounded-xl text-white outline-none focus:border-zh-teal focus:ring-1 focus:ring-zh-teal/20 transition-all caret-transparent"
        />
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  const navigate = useNavigate()
  const { register, verifyEmail, resendVerification, isLoading, authStep } = useAuthStore()

  const strength = getStrength(password)
  const strengthConfig = STRENGTH_CONFIG[strength]

  // Countdown timer for resend
  useEffect(() => {
    if (authStep !== 'verify-email') return
    setResendTimer(60)
  }, [authStep])

  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  // Navigate on done
  useEffect(() => {
    if (authStep === 'done') navigate('/')
  }, [authStep, navigate])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (strength === 'weak') { setError('Password is too weak.'); return }
    if (!agreed) { setError('Please accept the Terms of Service.'); return }
    try {
      await register(name, email, password)
    } catch {
      setError('Registration failed. Please try again.')
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpError('')
    try {
      await verifyEmail(otp)
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : 'Verification failed.')
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    await resendVerification()
    setResendTimer(60)
  }

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {/* ── Step 1: Account details ── */}
        {authStep !== 'verify-email' ? (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
            <p className="text-sm text-zh-muted mb-8">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-zh-teal hover:underline font-medium">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleRegister} className="space-y-3">
              {/* Name */}
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zh-subtle pointer-events-none" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-zh-card2 border border-zh-border rounded-xl text-sm text-zh-text placeholder:text-zh-subtle outline-none focus:border-zh-teal focus:ring-1 focus:ring-zh-teal/20 transition-all"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zh-subtle pointer-events-none" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-zh-card2 border border-zh-border rounded-xl text-sm text-zh-text placeholder:text-zh-subtle outline-none focus:border-zh-teal focus:ring-1 focus:ring-zh-teal/20 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zh-subtle pointer-events-none" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-12 py-3 bg-zh-card2 border border-zh-border rounded-xl text-sm text-zh-text placeholder:text-zh-subtle outline-none focus:border-zh-teal focus:ring-1 focus:ring-zh-teal/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zh-subtle hover:text-zh-teal transition-colors"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Strength meter */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((bar) => (
                        <div
                          key={bar}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            strengthConfig.bars >= bar ? strengthConfig.color : 'bg-zh-border'
                          }`}
                        />
                      ))}
                    </div>
                    {strength !== 'none' && (
                      <p className={`text-[10px] font-medium ${
                        strength === 'weak' ? 'text-red-400' :
                        strength === 'fair' ? 'text-yellow-400' : 'text-zh-teal'
                      }`}>
                        {strengthConfig.label} password
                        {strength === 'weak' && ' — add uppercase, numbers, or symbols'}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zh-subtle pointer-events-none" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className={`w-full pl-11 pr-12 py-3 bg-zh-card2 border rounded-xl text-sm text-zh-text placeholder:text-zh-subtle outline-none focus:ring-1 transition-all ${
                    confirm && confirm !== password
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-zh-border focus:border-zh-teal focus:ring-zh-teal/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zh-subtle hover:text-zh-teal transition-colors"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {confirm && confirm === password && (
                  <CheckCircle size={15} className="absolute right-11 top-1/2 -translate-y-1/2 text-zh-teal" />
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer group pt-1">
                <div
                  onClick={() => setAgreed(!agreed)}
                  className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                    agreed ? 'bg-zh-teal border-zh-teal' : 'border-zh-border2 bg-zh-card2'
                  }`}
                >
                  {agreed && (
                    <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-none stroke-black stroke-2">
                      <path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-zh-muted group-hover:text-zh-text transition-colors leading-relaxed">
                  I agree to ZeroHuman's{' '}
                  <span className="text-zh-teal hover:underline">Terms of Service</span>{' '}
                  and{' '}
                  <span className="text-zh-teal hover:underline">Privacy Policy</span>
                </span>
              </label>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl"
                >
                  <p className="text-xs text-red-400">{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-zh-teal text-black font-semibold rounded-xl hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          /* ── Step 2: Email verification ── */
          <motion.div
            key="verify"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-zh-teal/10 border border-zh-teal/30 flex items-center justify-center mx-auto mb-6">
              <Mail size={28} className="text-zh-teal" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-sm text-zh-muted mb-2">
              We sent a 6-digit code to
            </p>
            <p className="text-sm font-semibold text-zh-text mb-8">{email}</p>

            {/* Demo hint */}
            <div className="mb-6 px-4 py-3 bg-zh-teal/5 border border-zh-teal/20 rounded-xl">
              <p className="text-xs text-zh-teal">Demo: use code <strong>123456</strong></p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <OtpInput value={otp} onChange={setOtp} />

              {otpError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-400"
                >
                  {otpError}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full flex items-center justify-center gap-2 py-3 bg-zh-teal text-black font-semibold rounded-xl hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  'Verify Email'
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-1">
              <span className="text-xs text-zh-muted">Didn't receive the code?</span>
              <button
                onClick={handleResend}
                disabled={resendTimer > 0}
                className="flex items-center gap-1 text-xs text-zh-teal hover:underline disabled:text-zh-subtle disabled:no-underline transition-colors ml-1"
              >
                {resendTimer > 0 ? (
                  `Resend in ${resendTimer}s`
                ) : (
                  <>
                    <RefreshCw size={11} />
                    Resend
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => useAuthStore.getState().clearFlags()}
              className="mt-4 text-xs text-zh-muted hover:text-zh-text transition-colors"
            >
              ← Use a different email
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  )
}

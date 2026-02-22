import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react'
import AuthLayout from './AuthLayout'
import { useAuthStore } from '@/store/authStore'

type Strength = 'none' | 'weak' | 'fair' | 'strong'

function getStrength(pw: string): Strength {
  if (!pw) return 'none'
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  if (s <= 1) return 'weak'
  if (s === 2) return 'fair'
  return 'strong'
}

const REQUIREMENTS = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export default function ResetPasswordPage() {
  const { token = 'demo-token' } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const { resetPassword, isLoading, resetSuccess } = useAuthStore()

  const strength = getStrength(password)
  const strengthColors: Record<Strength, string> = {
    none: 'bg-zh-border', weak: 'bg-red-400', fair: 'bg-yellow-400', strong: 'bg-zh-teal',
  }
  const strengthLabels: Record<Strength, string> = {
    none: '', weak: 'Weak', fair: 'Fair', strong: 'Strong',
  }
  const strengthBars: Record<Strength, number> = { none: 0, weak: 1, fair: 2, strong: 3 }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (strength === 'weak') { setError('Please choose a stronger password.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    try {
      await resetPassword(token, password)
    } catch {
      setError('Reset link expired or invalid. Please request a new one.')
    }
  }

  return (
    <AuthLayout backTo="/auth/login" backLabel="Back to Sign In">
      <AnimatePresence mode="wait">
        {!resetSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-zh-teal/10 border border-zh-teal/30 flex items-center justify-center mb-8">
              <Lock size={24} className="text-zh-teal" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Reset your password</h2>
            <p className="text-sm text-zh-muted mb-8">
              Create a new strong password for your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New password */}
              <div>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zh-subtle pointer-events-none" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="New password"
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
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((bar) => (
                        <div
                          key={bar}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            strengthBars[strength] >= bar ? strengthColors[strength] : 'bg-zh-border'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-[11px] font-medium ${
                      strength === 'weak' ? 'text-red-400' :
                      strength === 'fair' ? 'text-yellow-400' : 'text-zh-teal'
                    }`}>
                      {strengthLabels[strength]} password
                    </p>

                    {/* Requirements checklist */}
                    <div className="space-y-1 mt-2">
                      {REQUIREMENTS.map(({ label, test }) => {
                        const passed = test(password)
                        return (
                          <div key={label} className="flex items-center gap-2">
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                              passed ? 'bg-zh-teal border-zh-teal' : 'border-zh-border2'
                            }`}>
                              {passed && (
                                <svg viewBox="0 0 8 6" className="w-2 h-1.5 fill-none stroke-black stroke-2">
                                  <path d="M1 3L3 5L7 1" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-[11px] transition-colors ${passed ? 'text-zh-text' : 'text-zh-subtle'}`}>
                              {label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zh-subtle pointer-events-none" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
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
              </div>

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
                disabled={isLoading || !password || !confirm}
                className="w-full flex items-center justify-center gap-2 py-3 bg-zh-teal text-black font-semibold rounded-xl hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          /* ── Success ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-zh-teal/15 border border-zh-teal/30 flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle2 size={36} className="text-zh-teal" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-3">Password reset!</h2>
            <p className="text-sm text-zh-muted mb-10 leading-relaxed">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>

            <button
              onClick={() => { useAuthStore.getState().clearFlags(); navigate('/auth/login') }}
              className="w-full py-3 bg-zh-teal text-black font-semibold rounded-xl hover:bg-opacity-90 transition-all active:scale-[0.98]"
            >
              Sign In Now
            </button>

            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 text-sm text-zh-muted hover:text-zh-text transition-colors mt-6"
            >
              <ArrowLeft size={13} />
              Back to Sign In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  )
}

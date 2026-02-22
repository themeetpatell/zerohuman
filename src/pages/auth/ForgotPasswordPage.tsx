import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, SendHorizonal, CheckCircle2 } from 'lucide-react'
import AuthLayout from './AuthLayout'
import { useAuthStore } from '@/store/authStore'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const { forgotPassword, isLoading, resetEmailSent, clearFlags } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await forgotPassword(email)
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <AuthLayout backTo="/auth/login" backLabel="Back to Sign In">
      <AnimatePresence mode="wait">
        {!resetEmailSent ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-zh-teal/10 border border-zh-teal/30 flex items-center justify-center mb-8">
              <Mail size={24} className="text-zh-teal" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Forgot password?</h2>
            <p className="text-sm text-zh-muted mb-8 leading-relaxed">
              No worries. Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zh-subtle pointer-events-none" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-zh-card2 border border-zh-border rounded-xl text-sm text-zh-text placeholder:text-zh-subtle outline-none focus:border-zh-teal focus:ring-1 focus:ring-zh-teal/20 transition-all"
                />
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
                disabled={isLoading || !email}
                className="w-full flex items-center justify-center gap-2 py-3 bg-zh-teal text-black font-semibold rounded-xl hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <SendHorizonal size={16} />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-1.5 mt-8">
              <ArrowLeft size={13} className="text-zh-muted" />
              <Link to="/auth/login" className="text-sm text-zh-muted hover:text-zh-text transition-colors">
                Back to Sign In
              </Link>
            </div>
          </motion.div>
        ) : (
          /* ── Success state ── */
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

            <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
            <p className="text-sm text-zh-muted mb-2 leading-relaxed">
              We sent a password reset link to
            </p>
            <p className="text-sm font-semibold text-zh-text mb-8">{email}</p>

            <div className="px-4 py-3 bg-zh-card border border-zh-border rounded-xl text-left space-y-2 mb-8">
              <p className="text-[11px] text-zh-muted">What to do next:</p>
              {[
                'Open the email from ZeroHuman',
                'Click the "Reset Password" button',
                'Create a new secure password',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-zh-teal/20 text-zh-teal text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-xs text-zh-text">{step}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-zh-muted mb-4">
              Didn't receive it?{' '}
              <button
                onClick={() => clearFlags()}
                className="text-zh-teal hover:underline"
              >
                Try again
              </button>{' '}
              or check your spam folder.
            </p>

            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 text-sm text-zh-muted hover:text-zh-text transition-colors"
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

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import AuthLayout from './AuthLayout'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password, remember)
      navigate('/')
    } catch {
      setError('Invalid email or password. Please try again.')
    }
  }

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
        <p className="text-sm text-zh-muted mb-8">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-zh-teal hover:underline font-medium">
            Sign up free
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                onClick={() => setRemember(!remember)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  remember ? 'bg-zh-teal border-zh-teal' : 'border-zh-border2 bg-zh-card2'
                }`}
              >
                {remember && (
                  <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-none stroke-black stroke-2">
                    <path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-zh-muted group-hover:text-zh-text transition-colors">Remember me</span>
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-xs text-zh-teal hover:underline"
            >
              Forgot password?
            </Link>
          </div>

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

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-zh-teal text-black font-semibold rounded-xl hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-zh-border" />
          <span className="text-[11px] text-zh-subtle">or continue with</span>
          <div className="flex-1 h-px bg-zh-border" />
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Google', emoji: '🅖' },
            { name: 'Apple', emoji: '🍎' },
          ].map(({ name, emoji }) => (
            <button
              key={name}
              className="flex items-center justify-center gap-2 py-2.5 border border-zh-border rounded-xl text-sm text-zh-muted hover:border-zh-border2 hover:text-zh-text hover:bg-zh-card transition-all"
            >
              <span>{emoji}</span>
              {name}
            </button>
          ))}
        </div>

        <p className="text-center text-[11px] text-zh-subtle mt-8">
          By signing in, you agree to our{' '}
          <span className="text-zh-teal cursor-pointer hover:underline">Terms of Service</span>{' '}
          and{' '}
          <span className="text-zh-teal cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </motion.div>
    </AuthLayout>
  )
}

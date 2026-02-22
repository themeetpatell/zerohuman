import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Sparkles, Zap } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

type Mode = 'login' | 'register'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const { login, register, isLoading } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        if (!name.trim()) { setError('Name is required'); return }
        await register(name, email, password)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  const inputClass =
    'w-full bg-zh-card2 border border-zh-border rounded-xl px-4 py-3 pl-11 text-zh-text placeholder:text-zh-subtle text-sm outline-none focus:border-zh-teal focus:ring-1 focus:ring-zh-teal/20 transition-all duration-200'

  return (
    <div className="min-h-screen bg-zh-bg flex items-center justify-center relative overflow-hidden">
      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zh-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-zh-teal/3 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #3dd9b3 0px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #3dd9b3 0px, transparent 1px, transparent 60px)',
          }}
        />
      </div>

      <div className="w-full max-w-md px-6 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-zh-teal flex items-center justify-center">
              <Zap size={20} className="text-black fill-black" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Zero<span className="text-gradient-teal">Human</span>
            </span>
          </div>
          <p className="text-zh-muted text-sm">Voice-Directed Cinematic AI</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zh-card border border-zh-border rounded-2xl p-8"
        >
          {/* Tabs */}
          <div className="flex gap-1 bg-zh-card2 p-1 rounded-xl mb-8">
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  mode === m
                    ? 'bg-zh-teal text-black'
                    : 'text-zh-muted hover:text-zh-text'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zh-subtle" />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      required={mode === 'register'}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zh-subtle" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zh-subtle" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-12`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zh-subtle hover:text-zh-teal transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-xs text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-zh-teal text-black font-semibold rounded-xl transition-all duration-200 hover:bg-opacity-90 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles size={16} />
                  {mode === 'login' ? 'Sign In' : 'Start Creating'}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-zh-border" />
            <span className="text-zh-subtle text-xs">or continue with</span>
            <div className="flex-1 h-px bg-zh-border" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            {['Google', 'Apple'].map((provider) => (
              <button
                key={provider}
                className="flex items-center justify-center gap-2 py-2.5 border border-zh-border rounded-xl text-sm text-zh-muted hover:border-zh-border2 hover:text-zh-text transition-all duration-200"
              >
                <span className="text-base">{provider === 'Google' ? '🅖' : ''}</span>
                {provider}
              </button>
            ))}
          </div>
        </motion.div>

        <p className="text-center text-zh-muted text-xs mt-6">
          By continuing, you agree to our{' '}
          <span className="text-zh-teal cursor-pointer hover:underline">Terms</span>{' '}
          and{' '}
          <span className="text-zh-teal cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}

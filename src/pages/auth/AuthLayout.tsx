import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, ArrowLeft } from 'lucide-react'

const PREVIEW_IMAGES = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80',
]

const STATS = [
  { value: '2.4M+', label: 'Ads Created' },
  { value: '18K+', label: 'Brands' },
  { value: '60s', label: 'Avg. Generation' },
]

interface AuthLayoutProps {
  children: React.ReactNode
  backTo?: string
  backLabel?: string
}

export default function AuthLayout({ children, backTo, backLabel }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-zh-bg flex">
      {/* Left branding panel — hidden on mobile */}
      <div className="hidden lg:flex flex-col w-[480px] flex-shrink-0 bg-zh-elevated border-r border-zh-border relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-zh-teal/8 rounded-full blur-3xl -translate-x-1/2" />
          <div className="absolute bottom-1/3 right-0 w-60 h-60 bg-zh-teal/5 rounded-full blur-3xl translate-x-1/2" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #3dd9b3 0px, transparent 1px, transparent 50px), repeating-linear-gradient(90deg, #3dd9b3 0px, transparent 1px, transparent 50px)',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zh-teal flex items-center justify-center">
              <Zap size={18} className="text-black fill-black" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Zero<span className="text-gradient-teal">Human</span>
            </span>
          </div>

          {/* Hero copy */}
          <div className="mt-14">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-white leading-tight"
            >
              Create cinematic video ads
              <br />
              <span className="text-gradient-teal">in 60 seconds.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-zh-muted leading-relaxed text-sm"
            >
              Just speak your vision — ZeroHuman's AI Co-Director handles script, shots, talent, music, and export automatically.
            </motion.p>
          </div>

          {/* Preview grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-10 grid grid-cols-3 gap-2"
          >
            {PREVIEW_IMAGES.map((src, i) => (
              <div
                key={i}
                className="aspect-[9/16] rounded-xl overflow-hidden border border-zh-border relative group"
              >
                <img src={src} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-cinematic" />
                <div className="absolute bottom-1.5 left-1.5">
                  <div className="w-1 h-1 rounded-full bg-zh-teal" />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center gap-6"
          >
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-zh-muted">{label}</p>
              </div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-auto pt-8 border-t border-zh-border"
          >
            <p className="text-sm text-zh-muted italic leading-relaxed">
              "ZeroHuman cut our video production time from weeks to minutes.
              The cinematic quality is unreal."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-zh-teal/20 border border-zh-teal/30 flex items-center justify-center">
                <span className="text-xs font-bold text-zh-teal">S</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-zh-text">Sarah Chen</p>
                <p className="text-[11px] text-zh-muted">Creative Director, Apex Brand Studio</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Back nav */}
        {backTo && (
          <div className="px-8 pt-8 flex-shrink-0">
            <Link
              to={backTo}
              className="inline-flex items-center gap-1.5 text-zh-muted hover:text-zh-text text-sm transition-colors"
            >
              <ArrowLeft size={15} />
              {backLabel ?? 'Back'}
            </Link>
          </div>
        )}

        {/* Mobile logo */}
        <div className="lg:hidden px-8 pt-8 flex-shrink-0">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zh-teal flex items-center justify-center">
              <Zap size={15} className="text-black fill-black" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Zero<span className="text-gradient-teal">Human</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}

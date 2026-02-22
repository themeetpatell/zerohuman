import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap,
  Plus,
  FolderOpen,
  Sliders,
  Store,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Crown,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useProjectStore } from '@/store/projectStore'
import { useBillingStore } from '@/store/billingStore'
import SettingsModal from './SettingsModal'

const NAV_ITEMS = [
  { icon: Plus, label: 'New Ad', path: '/', exact: true },
  { icon: FolderOpen, label: 'My Library', path: '/library' },
  { icon: Sliders, label: 'Studio', path: '/studio' },
  { icon: Store, label: 'Marketplace', path: '/marketplace', soon: true },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const { clearMessages } = useProjectStore()
  const { setShowCreditExhausted } = useBillingStore()
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState<'profile' | 'account' | 'notifications' | 'appearance' | 'api'>('profile')

  const handleNewAd = () => {
    clearMessages()
    navigate('/')
  }

  const planColors: Record<string, string> = {
    free:   'text-zh-muted',
    pro:    'text-zh-teal',
    studio: 'text-yellow-400',
  }

  const creditsPercent = Math.min(((user?.credits ?? 0) / 1000) * 100, 100)
  const isLowCredits = (user?.credits ?? 0) < 100 && (user?.credits ?? 0) > 0
  const isOutOfCredits = (user?.credits ?? 0) <= 0

  return (
    <aside className="w-[220px] flex-shrink-0 h-full flex flex-col bg-zh-elevated border-r border-zh-border">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zh-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zh-teal flex items-center justify-center flex-shrink-0">
            <Zap size={15} className="text-black fill-black" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">
            Zero<span className="text-gradient-teal">Human</span>
          </span>
        </div>
      </div>

      {/* New Ad CTA */}
      <div className="px-3 py-3">
        <button
          onClick={handleNewAd}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-zh-teal/10 border border-zh-teal/20 text-zh-teal text-sm font-medium hover:bg-zh-teal/15 transition-all duration-200 group"
        >
          <Plus size={16} />
          <span>New Ad</span>
          <Sparkles size={13} className="ml-auto opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ icon: Icon, label, path, exact, soon }) => (
          <NavLink
            key={path}
            to={soon ? '#' : path}
            end={exact}
            onClick={label === 'New Ad' ? handleNewAd : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative ${
                isActive && !soon
                  ? 'bg-zh-teal/10 text-zh-teal'
                  : 'text-zh-muted hover:text-zh-text hover:bg-zh-card'
              } ${soon ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && !soon && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-zh-teal/10 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon size={17} className="relative z-10 flex-shrink-0" />
                <span className="relative z-10 font-medium">{label}</span>
                {soon && (
                  <span className="ml-auto text-[9px] font-bold uppercase tracking-wider bg-zh-card2 border border-zh-border text-zh-subtle px-1.5 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Pricing link */}
        <NavLink
          to="/billing/pricing"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              isActive ? 'bg-zh-teal/10 text-zh-teal' : 'text-zh-muted hover:text-zh-text hover:bg-zh-card'
            }`
          }
        >
          <TrendingUp size={17} className="flex-shrink-0" />
          <span className="font-medium">Upgrade</span>
          {user?.plan === 'free' && (
            <span className="ml-auto text-[9px] font-bold bg-zh-teal text-black px-1.5 py-0.5 rounded-full">
              PRO
            </span>
          )}
        </NavLink>
      </nav>

      {/* Credits */}
      <div className="px-3 py-3 border-t border-zh-border">
        {/* Low / out of credits warning */}
        {(isLowCredits || isOutOfCredits) && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-3 p-3 rounded-xl border ${
              isOutOfCredits
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle
                size={13}
                className={isOutOfCredits ? 'text-red-400' : 'text-yellow-400'}
              />
              <span className={`text-xs font-semibold ${isOutOfCredits ? 'text-red-400' : 'text-yellow-400'}`}>
                {isOutOfCredits ? 'Out of credits' : 'Low credits'}
              </span>
            </div>
            <p className="text-[10px] text-zh-muted mb-2">
              {isOutOfCredits
                ? 'Top up to keep generating.'
                : `Only ${user?.credits} credits left.`}
            </p>
            <button
              onClick={() => isOutOfCredits ? setShowCreditExhausted(true) : navigate('/billing/pricing')}
              className="w-full py-1.5 text-[10px] font-bold bg-zh-teal text-black rounded-lg hover:bg-opacity-90 transition-all"
            >
              {isOutOfCredits ? 'Add Credits' : 'Upgrade Now'}
            </button>
          </motion.div>
        )}

        {/* Credit meter */}
        <div className="bg-zh-card border border-zh-border rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zh-muted font-medium">AI Credits</span>
            <span className={`text-xs font-semibold ${isOutOfCredits ? 'text-red-400' : isLowCredits ? 'text-yellow-400' : 'text-zh-teal'}`}>
              {user?.credits ?? 0}
            </span>
          </div>
          <div className="h-1.5 bg-zh-card2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isOutOfCredits ? 'bg-red-400' : isLowCredits ? 'bg-yellow-400' : 'bg-gradient-teal'
              }`}
              style={{ width: `${creditsPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-zh-subtle">
              {user?.credits ?? 0} / 1,000
            </span>
            <button
              onClick={() => navigate('/billing/pricing')}
              className="text-[10px] text-zh-teal font-medium hover:underline"
            >
              Top up
            </button>
          </div>
        </div>

        {/* Upgrade CTA if on free plan */}
        {user?.plan === 'free' && (
          <button
            onClick={() => navigate('/billing/pricing')}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-zh-teal/20 to-zh-teal/10 border border-zh-teal/30 text-zh-teal text-xs font-medium hover:from-zh-teal/30 hover:to-zh-teal/15 transition-all mb-3"
          >
            <Crown size={13} />
            Upgrade to Pro
            <ChevronRight size={12} className="ml-auto" />
          </button>
        )}
      </div>

      {/* User profile */}
      <div className="px-3 pb-4 space-y-1">
        <button
          onClick={() => { setSettingsTab('profile'); setSettingsOpen(true) }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zh-muted hover:text-zh-text hover:bg-zh-card text-sm transition-all duration-200"
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zh-muted hover:text-red-400 hover:bg-red-400/5 text-sm transition-all duration-200"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>

        <button
          onClick={() => { setSettingsTab('account'); setSettingsOpen(true) }}
          className="w-full flex items-center gap-2.5 px-2 pt-2 mt-1 border-t border-zh-border hover:bg-zh-card rounded-xl transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-full bg-zh-teal/20 border border-zh-teal/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-zh-teal">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0 text-left py-1">
            <p className="text-xs font-medium text-zh-text truncate">{user?.name}</p>
            <p className={`text-[10px] capitalize font-medium ${planColors[user?.plan ?? 'free']}`}>
              {user?.plan} plan
            </p>
          </div>
          <ChevronRight size={14} className="text-zh-subtle flex-shrink-0 group-hover:text-zh-text transition-colors" />
        </button>
      </div>

      {/* Settings modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        defaultTab={settingsTab}
      />
    </aside>
  )
}

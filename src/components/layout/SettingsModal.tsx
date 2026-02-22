import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  User,
  CreditCard,
  Bell,
  Palette,
  Key,
  LogOut,
  Camera,
  Check,
  Copy,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Trash2,
  Shield,
  Zap,
  Crown,
  Sparkles,
  AlertTriangle,
  Moon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useBillingStore, PLANS } from '@/store/billingStore'

type Tab = 'profile' | 'account' | 'notifications' | 'appearance' | 'api'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'account',       label: 'Account',        icon: CreditCard },
  { id: 'notifications', label: 'Notifications',  icon: Bell },
  { id: 'appearance',    label: 'Appearance',     icon: Palette },
  { id: 'api',           label: 'API Keys',       icon: Key },
]

const PLAN_ICONS = { free: Zap, pro: Sparkles, studio: Crown }
const PLAN_COLORS = { free: 'text-zh-muted', pro: 'text-zh-teal', studio: 'text-yellow-400' }

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
  const { user } = useAuthStore()
  const [name, setName] = useState(user?.name ?? '')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div>
        <label className="section-label">Profile Photo</label>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl bg-zh-teal/20 border-2 border-zh-teal/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-zh-teal">
                {name?.[0]?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera size={16} className="text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" />
          </div>
          <div>
            <button
              onClick={() => fileRef.current?.click()}
              className="text-xs font-medium text-zh-teal hover:underline"
            >
              Upload photo
            </button>
            <p className="text-[11px] text-zh-muted mt-0.5">JPG, PNG or GIF · max 5MB</p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="section-label">Display Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="zh-settings-input"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="section-label">Email</label>
          <input
            value={user?.email ?? ''}
            readOnly
            className="zh-settings-input opacity-60 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="section-label">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="Tell us a little about yourself..."
          className="zh-settings-input resize-none"
        />
        <p className="text-[11px] text-zh-subtle mt-1 text-right">{bio.length}/160</p>
      </div>

      {/* Website */}
      <div>
        <label className="section-label">Website</label>
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://yoursite.com"
          className="zh-settings-input"
        />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-5 py-2.5 bg-zh-teal text-black text-sm font-semibold rounded-xl hover:bg-opacity-90 transition-all active:scale-95"
      >
        {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
      </button>
    </div>
  )
}

// ─── Account Tab ──────────────────────────────────────────────────────────────
function AccountTab({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuthStore()
  const { billingCycle } = useBillingStore()
  const navigate = useNavigate()
  const [showDelete, setShowDelete] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const plan = PLANS.find((p) => p.id === user?.plan) ?? PLANS[0]
  const PlanIcon = PLAN_ICONS[user?.plan ?? 'free']
  const planColor = PLAN_COLORS[user?.plan ?? 'free']
  const price = billingCycle === 'annual' ? plan.price.annual : plan.price.monthly

  const creditsPercent = Math.min(((user?.credits ?? 0) / 1000) * 100, 100)

  return (
    <div className="space-y-6">
      {/* Current plan */}
      <div>
        <label className="section-label">Current Plan</label>
        <div className="p-4 bg-zh-card2 border border-zh-border rounded-xl flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            user?.plan === 'pro' ? 'bg-zh-teal/20' : 'bg-zh-card'
          }`}>
            <PlanIcon size={20} className={planColor} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`text-sm font-bold capitalize ${planColor}`}>{user?.plan} Plan</p>
              {user?.plan !== 'free' && (
                <span className="text-[10px] text-zh-muted">
                  ${price}/mo · {billingCycle}
                </span>
              )}
            </div>
            <p className="text-xs text-zh-muted mt-0.5">
              {typeof plan.credits === 'number'
                ? `${plan.credits.toLocaleString()} credits/month`
                : 'Unlimited credits'}
              · {plan.resolution[plan.resolution.length - 1]} max resolution
            </p>
          </div>
          <button
            onClick={() => { onClose(); navigate('/billing/pricing') }}
            className="flex-shrink-0 text-xs font-medium text-zh-teal hover:underline flex items-center gap-1"
          >
            {user?.plan === 'free' ? 'Upgrade' : 'Change Plan'}
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Credits */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="section-label mb-0">AI Credits</label>
          <button
            onClick={() => { onClose(); navigate('/billing/pricing') }}
            className="text-xs text-zh-teal hover:underline"
          >
            Top up
          </button>
        </div>
        <div className="p-4 bg-zh-card2 border border-zh-border rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-white">{user?.credits?.toLocaleString() ?? 0}</span>
            <span className="text-xs text-zh-muted">/ {typeof plan.credits === 'number' ? plan.credits.toLocaleString() : '∞'} credits</span>
          </div>
          <div className="h-2 bg-zh-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                (user?.credits ?? 0) < 100 ? 'bg-red-400' :
                (user?.credits ?? 0) < 300 ? 'bg-yellow-400' : 'bg-gradient-teal'
              }`}
              style={{ width: `${creditsPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-zh-muted mt-2">
            Credits reset on the 1st of each month with your plan.
          </p>
        </div>
      </div>

      {/* Billing */}
      {user?.plan !== 'free' && (
        <div>
          <label className="section-label">Billing</label>
          <div className="space-y-2">
            <SettingsRow
              label="Manage billing & invoices"
              description="View invoices, update payment method"
              action={<ExternalLink size={14} className="text-zh-muted" />}
              onClick={() => { onClose(); navigate('/billing/pricing') }}
            />
            <SettingsRow
              label="Cancel subscription"
              description="Your access continues until period end"
              action={<ChevronRight size={14} className="text-zh-muted" />}
              destructive
            />
          </div>
        </div>
      )}

      {/* Security */}
      <div>
        <label className="section-label">Security</label>
        <div className="space-y-2">
          <SettingsRow
            label="Change password"
            description="Update your account password"
            action={<ChevronRight size={14} className="text-zh-muted" />}
            onClick={() => { onClose(); navigate('/auth/forgot-password') }}
          />
          <SettingsRow
            label="Two-factor authentication"
            description="Add an extra layer of security"
            action={
              <span className="text-[10px] font-bold bg-zh-card border border-zh-border text-zh-muted px-2 py-0.5 rounded-full">
                Off
              </span>
            }
          />
          <SettingsRow
            label="Active sessions"
            description="Manage where you're logged in"
            action={<ChevronRight size={14} className="text-zh-muted" />}
          />
        </div>
      </div>

      {/* Sign out */}
      <div>
        <label className="section-label">Session</label>
        <button
          onClick={() => { logout(); onClose() }}
          className="flex items-center gap-3 w-full px-4 py-3 bg-zh-card2 border border-zh-border rounded-xl text-sm text-red-400 hover:bg-red-400/5 hover:border-red-400/30 transition-all group"
        >
          <LogOut size={16} className="flex-shrink-0" />
          Sign out of ZeroHuman
        </button>
      </div>

      {/* Danger zone */}
      <div>
        <label className="section-label text-red-400">Danger Zone</label>
        <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-4">
          {!showDelete ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zh-text">Delete Account</p>
                <p className="text-xs text-zh-muted mt-0.5">
                  Permanently delete your account and all data. This cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/40 text-red-400 text-xs rounded-lg hover:bg-red-500/10 transition-all flex-shrink-0 ml-4"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-400 font-medium">
                  Type <strong>DELETE</strong> to confirm account deletion
                </p>
              </div>
              <input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full px-3 py-2 bg-zh-bg border border-red-500/40 rounded-lg text-sm text-zh-text placeholder:text-zh-subtle outline-none focus:border-red-500 transition-all"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowDelete(false); setDeleteConfirm('') }}
                  className="flex-1 py-2 border border-zh-border text-zh-muted text-xs rounded-lg hover:border-zh-border2 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={deleteConfirm !== 'DELETE'}
                  className="flex-1 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg disabled:opacity-40 hover:bg-red-600 transition-all"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Notifications Tab ────────────────────────────────────────────────────────
function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    generationComplete: true,
    weeklyDigest: true,
    productUpdates: false,
    creditLow: true,
    marketing: false,
    teamActivity: true,
  })

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }))

  const groups = [
    {
      title: 'Activity',
      items: [
        { key: 'generationComplete' as const, label: 'Video generation complete', desc: 'Get notified when your ad finishes rendering' },
        { key: 'creditLow' as const, label: 'Low credit warning', desc: 'Alert when credits fall below 100' },
        { key: 'teamActivity' as const, label: 'Team activity', desc: 'Collaborator edits and comments (Studio plan)' },
      ],
    },
    {
      title: 'Email',
      items: [
        { key: 'weeklyDigest' as const, label: 'Weekly digest', desc: 'Summary of your projects and usage' },
        { key: 'productUpdates' as const, label: 'Product updates', desc: 'New features, improvements and changelog' },
        { key: 'marketing' as const, label: 'Tips & tutorials', desc: 'Creative guides and best practices' },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {groups.map(({ title, items }) => (
        <div key={title}>
          <label className="section-label">{title}</label>
          <div className="space-y-1">
            {items.map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-zh-card2 border border-zh-border rounded-xl hover:border-zh-border2 transition-colors"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm text-zh-text">{label}</p>
                  <p className="text-[11px] text-zh-muted mt-0.5">{desc}</p>
                </div>
                <Toggle value={prefs[key]} onChange={() => toggle(key)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Appearance Tab ───────────────────────────────────────────────────────────
function AppearanceTab() {
  const [theme, setTheme] = useState<'dark' | 'darker' | 'amoled'>('dark')
  const [accentColor, setAccentColor] = useState('#3dd9b3')
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [compactSidebar, setCompactSidebar] = useState(false)

  const THEMES = [
    { id: 'dark' as const,   label: 'Dark',   bg: '#0a0a0a' },
    { id: 'darker' as const, label: 'Darker', bg: '#050505' },
    { id: 'amoled' as const, label: 'AMOLED', bg: '#000000' },
  ]

  const ACCENT_COLORS = ['#3dd9b3', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <div className="space-y-6">
      {/* Theme */}
      <div>
        <label className="section-label">Theme</label>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ id, label, bg }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                theme === id ? 'border-zh-teal' : 'border-zh-border hover:border-zh-border2'
              }`}
            >
              <div
                className="w-full h-10 rounded-lg border border-zh-border flex items-center justify-center"
                style={{ backgroundColor: bg }}
              >
                <Moon size={14} className="text-zh-muted" />
              </div>
              <span className={`text-xs font-medium ${theme === id ? 'text-zh-teal' : 'text-zh-muted'}`}>
                {label}
              </span>
              {theme === id && <Check size={11} className="text-zh-teal" />}
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div>
        <label className="section-label">Accent Color</label>
        <div className="flex items-center gap-2">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setAccentColor(color)}
              className="w-8 h-8 rounded-full border-2 transition-all"
              style={{
                backgroundColor: color,
                borderColor: accentColor === color ? 'white' : 'transparent',
              }}
            />
          ))}
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="w-8 h-8 rounded-full border border-zh-border bg-transparent cursor-pointer"
            title="Custom color"
          />
        </div>
      </div>

      {/* Font size */}
      <div>
        <label className="section-label">Font Size</label>
        <div className="flex gap-2">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                fontSize === size
                  ? 'bg-zh-teal text-black border-zh-teal'
                  : 'border-zh-border text-zh-muted hover:border-zh-border2 hover:text-zh-text'
              }`}
            >
              {{ sm: 'Small', md: 'Medium', lg: 'Large' }[size]}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-1">
        {[
          { label: 'Reduce motion', desc: 'Minimize animations throughout the app', key: 'reducedMotion', val: reducedMotion, fn: () => setReducedMotion(!reducedMotion) },
          { label: 'Compact sidebar', desc: 'Show icons only in the navigation sidebar', key: 'compactSidebar', val: compactSidebar, fn: () => setCompactSidebar(!compactSidebar) },
        ].map(({ label, desc, key, val, fn }) => (
          <div key={key} className="flex items-center justify-between p-3 bg-zh-card2 border border-zh-border rounded-xl">
            <div>
              <p className="text-sm text-zh-text">{label}</p>
              <p className="text-[11px] text-zh-muted">{desc}</p>
            </div>
            <Toggle value={val} onChange={fn} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── API Keys Tab ─────────────────────────────────────────────────────────────
function APITab() {
  const [keys] = useState([
    { id: 'key_1', name: 'Production', key: 'zh_live_sk_••••••••••••••••••••••4f2a', created: 'Jan 12, 2025', lastUsed: '2 hours ago', active: true },
    { id: 'key_2', name: 'Development', key: 'zh_test_sk_••••••••••••••••••••••9c1b', created: 'Dec 5, 2024', lastUsed: 'Yesterday', active: true },
  ])
  const [copied, setCopied] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')

  const handleCopy = (id: string, val: string) => {
    navigator.clipboard.writeText(val).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-zh-teal/5 border border-zh-teal/20 rounded-xl flex items-start gap-3">
        <Shield size={16} className="text-zh-teal mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-zh-teal mb-1">Keep your API keys secret</p>
          <p className="text-[11px] text-zh-muted leading-relaxed">
            Never share or expose keys in client-side code. Use environment variables on your server.
          </p>
        </div>
      </div>

      {/* Existing keys */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="section-label mb-0">Secret Keys</label>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-zh-teal hover:underline"
          >
            + Create new key
          </button>
        </div>

        {/* New key form */}
        <AnimatePresence>
          {showNew && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="flex gap-2 p-3 bg-zh-card2 border border-zh-teal/30 rounded-xl">
                <input
                  autoFocus
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Key name (e.g. Production)"
                  className="flex-1 bg-transparent text-sm text-zh-text placeholder:text-zh-subtle outline-none"
                />
                <button
                  disabled={!newKeyName.trim()}
                  className="px-3 py-1.5 bg-zh-teal text-black text-xs font-semibold rounded-lg disabled:opacity-40 transition-all"
                  onClick={() => { setShowNew(false); setNewKeyName('') }}
                >
                  Create
                </button>
                <button
                  onClick={() => { setShowNew(false); setNewKeyName('') }}
                  className="p-1.5 text-zh-muted hover:text-zh-text transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {keys.map((k) => (
            <div key={k.id} className="p-4 bg-zh-card2 border border-zh-border rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zh-text">{k.name}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${k.active ? 'bg-zh-teal' : 'bg-zh-subtle'}`} />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(k.id, k.key)}
                    className="p-1.5 rounded-lg text-zh-muted hover:text-zh-teal hover:bg-zh-teal/10 transition-all"
                    title="Copy"
                  >
                    {copied === k.id ? <Check size={13} className="text-zh-teal" /> : <Copy size={13} />}
                  </button>
                  <button
                    className="p-1.5 rounded-lg text-zh-muted hover:text-zh-text hover:bg-zh-card transition-all"
                    title="Regenerate"
                  >
                    <RefreshCw size={13} />
                  </button>
                  <button className="p-1.5 rounded-lg text-zh-muted hover:text-red-400 hover:bg-red-400/10 transition-all" title="Revoke">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <code className="text-[11px] font-mono text-zh-muted bg-zh-bg px-2 py-1 rounded-lg block">
                {k.key}
              </code>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-[10px] text-zh-subtle">Created {k.created}</span>
                <span className="text-[10px] text-zh-subtle">Last used {k.lastUsed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Docs link */}
      <a
        href="#"
        className="flex items-center gap-2 text-xs text-zh-teal hover:underline"
      >
        <ExternalLink size={13} />
        Read the API documentation
      </a>
    </div>
  )
}

// ─── Shared sub-components ────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${
        value ? 'bg-zh-teal' : 'bg-zh-border2'
      }`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
        value ? 'translate-x-5' : 'translate-x-0.5'
      }`} />
    </button>
  )
}

function SettingsRow({
  label,
  description,
  action,
  onClick,
  destructive,
}: {
  label: string
  description?: string
  action?: React.ReactNode
  onClick?: () => void
  destructive?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 bg-zh-card2 border rounded-xl transition-all text-left ${
        destructive
          ? 'border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5'
          : 'border-zh-border hover:border-zh-border2'
      }`}
    >
      <div className="min-w-0 flex-1 pr-4">
        <p className={`text-sm ${destructive ? 'text-red-400' : 'text-zh-text'}`}>{label}</p>
        {description && <p className="text-[11px] text-zh-muted mt-0.5">{description}</p>}
      </div>
      {action}
    </button>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: Tab
}

export default function SettingsModal({ isOpen, onClose, defaultTab = 'profile' }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab)

  // Reset tab when opened with a specific defaultTab
  const handleOpen = (tab: Tab) => {
    setActiveTab(tab)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl bg-zh-card border border-zh-border rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
              style={{ maxHeight: '90vh' }}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zh-border flex-shrink-0">
                <h2 className="text-base font-semibold text-zh-text">Settings</h2>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-zh-muted hover:text-zh-text hover:bg-zh-card2 transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar tabs */}
                <div className="w-44 flex-shrink-0 border-r border-zh-border py-3 px-2 space-y-0.5">
                  {TABS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => handleOpen(id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left ${
                        activeTab === id
                          ? 'bg-zh-teal/10 text-zh-teal'
                          : 'text-zh-muted hover:text-zh-text hover:bg-zh-card2'
                      }`}
                    >
                      <Icon size={15} className="flex-shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                    >
                      {activeTab === 'profile'       && <ProfileTab />}
                      {activeTab === 'account'       && <AccountTab onClose={onClose} />}
                      {activeTab === 'notifications' && <NotificationsTab />}
                      {activeTab === 'appearance'    && <AppearanceTab />}
                      {activeTab === 'api'           && <APITab />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

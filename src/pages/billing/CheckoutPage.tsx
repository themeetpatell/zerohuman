import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  Lock,
  Check,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Zap,
  Crown,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { PLANS, type PlanId, useBillingStore } from '@/store/billingStore'
import { useAuthStore } from '@/store/authStore'

// ─── Card preview ─────────────────────────────────────────────────────────────
function CardPreview({
  number,
  name,
  expiry,
}: {
  number: string
  name: string
  expiry: string
}) {
  const formatted = number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)

  return (
    <div className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden select-none">
      {/* Card background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zh-teal/30 via-zh-teal/10 to-zh-bg border border-zh-teal/30" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(61,217,179,0.2) 20px, rgba(61,217,179,0.2) 21px)',
        }}
      />

      {/* Logo */}
      <div className="absolute top-5 left-5 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-zh-teal flex items-center justify-center">
          <Zap size={12} className="text-black fill-black" />
        </div>
        <span className="text-xs font-bold text-white tracking-widest">ZEROHUMAN</span>
      </div>

      {/* Chip */}
      <div className="absolute top-14 left-5 w-10 h-8 rounded bg-yellow-300/80 border border-yellow-200/50 flex items-center justify-center">
        <div className="w-7 h-6 rounded-sm border border-yellow-400/40 flex flex-col justify-around py-1 px-0.5">
          {[1, 2, 3].map((i) => <div key={i} className="h-px bg-yellow-500/40" />)}
        </div>
      </div>

      {/* Card number */}
      <div className="absolute bottom-14 left-5 right-5">
        <p className="text-white font-mono text-lg tracking-widest">
          {formatted || '•••• •••• •••• ••••'}
        </p>
      </div>

      {/* Name + expiry */}
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
        <div>
          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Card Holder</p>
          <p className="text-white text-xs font-medium uppercase tracking-wider">{name || 'YOUR NAME'}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Expires</p>
          <p className="text-white text-xs font-mono">{expiry || 'MM/YY'}</p>
        </div>
      </div>

      {/* Network logo placeholder */}
      <div className="absolute top-5 right-5 flex gap-1">
        <div className="w-7 h-5 rounded-full bg-red-400/70" />
        <div className="w-7 h-5 rounded-full bg-orange-400/70 -ml-3" />
      </div>
    </div>
  )
}

// ─── Main Checkout ────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const planId = (params.get('plan') ?? 'pro') as PlanId
  const { billingCycle, upgradePlan, isUpgrading, upgradeSuccess, clearUpgradeSuccess } = useBillingStore()
  const { user } = useAuthStore()

  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1]
  const price = billingCycle === 'annual' ? plan.price.annual : plan.price.monthly
  const total = billingCycle === 'annual' ? price * 12 : price

  // Form state
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [saveCard, setSaveCard] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (upgradeSuccess) {
      const t = setTimeout(() => {
        clearUpgradeSuccess()
        navigate('/')
      }, 3000)
      return () => clearTimeout(t)
    }
  }, [upgradeSuccess, clearUpgradeSuccess, navigate])

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length >= 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (cardNumber.replace(/\s/g, '').length < 16) e.number = 'Enter a valid 16-digit card number'
    if (!cardName.trim()) e.name = 'Cardholder name is required'
    if (expiry.length < 5) e.expiry = 'Enter a valid expiry date'
    if (cvv.length < 3) e.cvv = 'Enter a valid CVV'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePay = async () => {
    if (!validate()) return
    await upgradePlan(planId, billingCycle, 'tok_demo')
  }

  const PlanIcon = { free: Zap, pro: Sparkles, studio: Crown }[plan.id] ?? Sparkles

  return (
    <div className="min-h-screen bg-zh-bg">
      {/* Header */}
      <div className="border-b border-zh-border px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-zh-muted hover:text-zh-text transition-colors">
          <ArrowLeft size={15} />
          Back
        </button>
        <div className="w-px h-5 bg-zh-border" />
        <span className="text-sm font-semibold text-zh-text">Secure Checkout</span>
        <div className="ml-auto flex items-center gap-1.5 text-zh-muted text-xs">
          <Lock size={12} />
          SSL Encrypted
        </div>
      </div>

      <AnimatePresence mode="wait">
        {upgradeSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
              className="w-24 h-24 rounded-full bg-zh-teal/15 border border-zh-teal/30 flex items-center justify-center mb-8"
            >
              <CheckCircle2 size={44} className="text-zh-teal" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-3">Welcome to {plan.name}!</h2>
            <p className="text-zh-muted text-center mb-2">
              Your plan has been upgraded successfully.
            </p>
            <p className="text-sm text-zh-muted mb-10">
              {typeof plan.credits === 'number' ? plan.credits.toLocaleString() : 'Unlimited'} credits have been added to your account.
            </p>
            <div className="flex items-center gap-2 text-zh-teal text-sm">
              <div className="w-3 h-3 border-2 border-zh-teal border-t-transparent rounded-full animate-spin" />
              Redirecting you to the app...
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto px-6 py-10 grid lg:grid-cols-[1fr,360px] gap-8"
          >
            {/* Left: payment form */}
            <div className="space-y-8">
              {/* Card preview */}
              <div className="max-w-sm">
                <CardPreview number={cardNumber} name={cardName} expiry={expiry} />
              </div>

              {/* Payment details */}
              <div className="bg-zh-card border border-zh-border rounded-2xl p-6">
                <h2 className="text-base font-semibold text-zh-text mb-5">Payment Details</h2>

                <div className="space-y-4">
                  {/* Card number */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zh-muted mb-1.5 block">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zh-subtle pointer-events-none" />
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className={`w-full pl-11 pr-4 py-3 bg-zh-card2 border rounded-xl text-sm text-zh-text font-mono placeholder:text-zh-subtle outline-none focus:ring-1 transition-all ${
                          errors.number ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-zh-border focus:border-zh-teal focus:ring-zh-teal/20'
                        }`}
                      />
                    </div>
                    {errors.number && <p className="text-[11px] text-red-400 mt-1">{errors.number}</p>}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zh-muted mb-1.5 block">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Full name as on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className={`w-full px-4 py-3 bg-zh-card2 border rounded-xl text-sm text-zh-text placeholder:text-zh-subtle outline-none focus:ring-1 transition-all ${
                        errors.name ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-zh-border focus:border-zh-teal focus:ring-zh-teal/20'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-widest text-zh-muted mb-1.5 block">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        className={`w-full px-4 py-3 bg-zh-card2 border rounded-xl text-sm text-zh-text font-mono placeholder:text-zh-subtle outline-none focus:ring-1 transition-all ${
                          errors.expiry ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-zh-border focus:border-zh-teal focus:ring-zh-teal/20'
                        }`}
                      />
                      {errors.expiry && <p className="text-[11px] text-red-400 mt-1">{errors.expiry}</p>}
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-widest text-zh-muted mb-1.5 block">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className={`w-full px-4 py-3 bg-zh-card2 border rounded-xl text-sm text-zh-text font-mono placeholder:text-zh-subtle outline-none focus:ring-1 transition-all ${
                          errors.cvv ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-zh-border focus:border-zh-teal focus:ring-zh-teal/20'
                        }`}
                      />
                      {errors.cvv && <p className="text-[11px] text-red-400 mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  {/* Save card */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setSaveCard(!saveCard)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        saveCard ? 'bg-zh-teal border-zh-teal' : 'border-zh-border2 bg-zh-card2'
                      }`}
                    >
                      {saveCard && (
                        <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-none stroke-black stroke-2">
                          <path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-zh-muted">Save card for future payments</span>
                  </label>
                </div>
              </div>

              {/* Security badges */}
              <div className="flex items-center gap-4 text-zh-subtle">
                <div className="flex items-center gap-1.5 text-xs">
                  <Shield size={13} className="text-zh-teal" />
                  256-bit SSL
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Lock size={13} className="text-zh-teal" />
                  PCI DSS Compliant
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Check size={13} className="text-zh-teal" />
                  Cancel anytime
                </div>
              </div>
            </div>

            {/* Right: order summary */}
            <div className="space-y-4">
              <div className="bg-zh-card border border-zh-border rounded-2xl p-5 sticky top-6">
                <h3 className="text-sm font-semibold text-zh-text mb-5">Order Summary</h3>

                {/* Plan info */}
                <div className="flex items-center gap-3 p-4 bg-zh-card2 border border-zh-border rounded-xl mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    plan.isPopular ? 'bg-zh-teal/20' : 'bg-zh-card'
                  }`}>
                    <PlanIcon size={20} className={plan.isPopular ? 'text-zh-teal' : 'text-zh-muted'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zh-text">{plan.name} Plan</p>
                    <p className="text-xs text-zh-muted capitalize">{billingCycle} billing</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-zh-text">${price}/mo</p>
                  </div>
                </div>

                {/* Included features */}
                <div className="space-y-1.5 mb-5">
                  {plan.features.slice(0, 5).map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <Check size={12} className="text-zh-teal flex-shrink-0" />
                      <span className="text-xs text-zh-muted">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing breakdown */}
                <div className="border-t border-zh-border pt-4 space-y-2 mb-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zh-muted">Subtotal</span>
                    <span className="text-zh-text">${total.toFixed(2)}</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zh-teal">Annual discount</span>
                      <span className="text-zh-teal">-${((plan.price.monthly - plan.price.annual) * 12).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zh-muted">Tax</span>
                    <span className="text-zh-text">$0.00</span>
                  </div>
                  <div className="flex items-center justify-between font-bold border-t border-zh-border pt-2">
                    <span className="text-zh-text">Total today</span>
                    <span className="text-white text-base">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Pay button */}
                <button
                  onClick={handlePay}
                  disabled={isUpgrading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-zh-teal text-black font-bold rounded-xl hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isUpgrading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={15} />
                      Pay ${total.toFixed(2)}
                    </>
                  )}
                </button>

                <p className="text-[10px] text-zh-subtle text-center mt-3">
                  Cancel anytime · No hidden fees
                </p>

                {/* Billing info */}
                {user && (
                  <div className="mt-4 p-3 bg-zh-card2 rounded-xl">
                    <p className="text-[10px] text-zh-muted">Billing to</p>
                    <p className="text-xs text-zh-text mt-0.5">{user.email}</p>
                  </div>
                )}
              </div>

              {/* Change plan link */}
              <Link
                to="/billing/pricing"
                className="flex items-center justify-center gap-1 text-xs text-zh-muted hover:text-zh-teal transition-colors"
              >
                Compare plans
                <ChevronRight size={12} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

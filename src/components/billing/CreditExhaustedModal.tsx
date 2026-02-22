import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Sparkles, Crown, Check } from 'lucide-react'
import { useBillingStore, PLANS, type PlanId } from '@/store/billingStore'
import { useAuthStore } from '@/store/authStore'

const CREDIT_PACKS = [
  { amount: 100,  price: 4.99,  label: '100 Credits' },
  { amount: 500,  price: 19.99, label: '500 Credits', popular: true },
  { amount: 1000, price: 34.99, label: '1,000 Credits' },
]

const PLAN_ICONS: Record<PlanId, React.ElementType> = {
  free: Zap, pro: Sparkles, studio: Crown,
}

export default function CreditExhaustedModal() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { showCreditExhausted, setShowCreditExhausted, addCredits, isUpgrading, billingCycle } = useBillingStore()

  const handleUpgrade = (planId: PlanId) => {
    setShowCreditExhausted(false)
    navigate(`/billing/checkout?plan=${planId}`)
  }

  const handleAddCredits = async (amount: number, cost: number) => {
    await addCredits(amount, cost)
    setShowCreditExhausted(false)
  }

  // Only show upgrade options for plans above current
  const planOrder: PlanId[] = ['free', 'pro', 'studio']
  const currentIdx = planOrder.indexOf(user?.plan ?? 'free')
  const upgradePlans = PLANS.filter((_p, i) => i > currentIdx)

  return (
    <AnimatePresence>
      {showCreditExhausted && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={() => setShowCreditExhausted(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-xl bg-zh-card border border-zh-border rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
              {/* Header */}
              <div className="relative px-6 pt-8 pb-5 text-center border-b border-zh-border">
                <button
                  onClick={() => setShowCreditExhausted(false)}
                  className="absolute right-4 top-4 p-1.5 rounded-lg text-zh-muted hover:text-zh-text hover:bg-zh-card2 transition-all"
                >
                  <X size={15} />
                </button>

                {/* Empty battery icon */}
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                  <Zap size={28} className="text-red-400" />
                </div>

                <h2 className="text-xl font-bold text-white mb-2">You've run out of credits</h2>
                <p className="text-sm text-zh-muted">
                  You need credits to generate AI videos. Top up or upgrade your plan to keep creating.
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Quick credit top-up */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zh-muted">
                      Add Credits
                    </h3>
                    <span className="text-[10px] text-zh-muted">One-time purchase</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {CREDIT_PACKS.map(({ amount, price, label, popular }) => (
                      <button
                        key={amount}
                        onClick={() => handleAddCredits(amount, price)}
                        disabled={isUpgrading}
                        className={`relative p-3 rounded-xl border text-center transition-all duration-200 hover:border-zh-teal group disabled:opacity-60 ${
                          popular
                            ? 'border-zh-teal bg-zh-teal/5'
                            : 'border-zh-border bg-zh-card2 hover:bg-zh-card'
                        }`}
                      >
                        {popular && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-zh-teal text-black text-[9px] font-bold rounded-full whitespace-nowrap">
                            Best Value
                          </span>
                        )}
                        <Zap size={16} className={`mx-auto mb-1 ${popular ? 'text-zh-teal' : 'text-zh-muted group-hover:text-zh-teal'}`} />
                        <p className={`text-xs font-bold ${popular ? 'text-zh-teal' : 'text-zh-text'}`}>{label}</p>
                        <p className="text-[11px] text-zh-muted mt-0.5">${price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-zh-border" />
                  <span className="text-[11px] text-zh-subtle">or upgrade for unlimited</span>
                  <div className="flex-1 h-px bg-zh-border" />
                </div>

                {/* Upgrade plans */}
                {upgradePlans.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zh-muted mb-3">
                      Upgrade Plan
                    </h3>
                    <div className="space-y-2">
                      {upgradePlans.map((plan) => {
                        const Icon = PLAN_ICONS[plan.id]
                        const price = billingCycle === 'annual' ? plan.price.annual : plan.price.monthly

                        return (
                          <button
                            key={plan.id}
                            onClick={() => handleUpgrade(plan.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:border-zh-teal text-left group ${
                              plan.isPopular
                                ? 'border-zh-teal bg-zh-teal/5'
                                : 'border-zh-border bg-zh-card2 hover:bg-zh-card'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              plan.isPopular ? 'bg-zh-teal/20' : 'bg-zh-card'
                            }`}>
                              <Icon size={18} className={plan.isPopular ? 'text-zh-teal' : 'text-zh-muted'} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-sm font-bold text-zh-text">{plan.name}</p>
                                {plan.badge && (
                                  <span className="text-[9px] font-bold bg-zh-teal text-black px-1.5 py-0.5 rounded-full">
                                    {plan.badge}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                {plan.features.slice(0, 3).map((f) => (
                                  <span key={f} className="flex items-center gap-0.5 text-[10px] text-zh-muted">
                                    <Check size={9} className="text-zh-teal" />
                                    {f.split(' ').slice(0, 3).join(' ')}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <p className="text-base font-bold text-white">${price}</p>
                              <p className="text-[10px] text-zh-muted">/ month</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* View all plans */}
                <button
                  onClick={() => { setShowCreditExhausted(false); navigate('/billing/pricing') }}
                  className="w-full py-2 text-xs text-zh-muted hover:text-zh-teal border border-zh-border hover:border-zh-teal rounded-xl transition-all"
                >
                  View all plans & compare →
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

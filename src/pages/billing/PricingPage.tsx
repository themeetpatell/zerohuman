import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, Crown, Zap, Sparkles, ArrowLeft } from 'lucide-react'
import { PLANS, type Plan, type BillingCycle, type PlanId, useBillingStore } from '@/store/billingStore'
import { useAuthStore } from '@/store/authStore'

const PLAN_ICONS: Record<PlanId, React.ElementType> = {
  free:   Zap,
  pro:    Sparkles,
  studio: Crown,
}

function PlanCard({
  plan,
  cycle,
  isCurrent,
  onSelect,
}: {
  plan: Plan
  cycle: BillingCycle
  isCurrent: boolean
  onSelect: () => void
}) {
  const Icon = PLAN_ICONS[plan.id]
  const price = cycle === 'annual' ? plan.price.annual : plan.price.monthly
  const isFree = plan.id === 'free'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-200 ${
        plan.isPopular
          ? 'border-zh-teal bg-zh-teal/5 shadow-lg shadow-zh-teal/10'
          : 'border-zh-border bg-zh-card'
      }`}
    >
      {/* Badge */}
      {plan.badge && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
          plan.isPopular
            ? 'bg-zh-teal text-black'
            : 'bg-yellow-400 text-black'
        }`}>
          {plan.badge}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            plan.isPopular ? 'bg-zh-teal/20' : 'bg-zh-card2'
          }`}>
            <Icon size={18} className={plan.isPopular ? 'text-zh-teal' : 'text-zh-muted'} />
          </div>
          <div>
            <h3 className="text-base font-bold text-zh-text">{plan.name}</h3>
            <p className="text-[11px] text-zh-muted">{plan.tagline}</p>
          </div>
        </div>
        {isCurrent && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-zh-card2 border border-zh-border text-zh-muted px-2 py-0.5 rounded-full">
            Current
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mb-6">
        {isFree ? (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">$0</span>
            <span className="text-zh-muted text-sm">/ month</span>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">${price}</span>
              <span className="text-zh-muted text-sm">/ month</span>
            </div>
            {cycle === 'annual' && (
              <p className="text-xs text-zh-teal mt-1">
                Save ${(plan.price.monthly - plan.price.annual) * 12}/year with annual billing
              </p>
            )}
          </>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2 flex-1 mb-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check size={14} className="text-zh-teal mt-0.5 flex-shrink-0" />
            <span className="text-xs text-zh-text">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onSelect}
        disabled={isCurrent}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-default ${
          plan.isPopular
            ? 'bg-zh-teal text-black hover:bg-opacity-90'
            : isFree
            ? 'bg-zh-card2 border border-zh-border text-zh-text hover:border-zh-border2'
            : 'bg-white text-black hover:bg-gray-100'
        }`}
      >
        {isCurrent ? 'Current Plan' : isFree ? 'Get Started Free' : `Upgrade to ${plan.name}`}
      </button>
    </motion.div>
  )
}

export default function PricingPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { setBillingCycle, billingCycle, setSelectedPlan } = useBillingStore()

  const handleSelectPlan = (planId: PlanId) => {
    if (planId === 'free') return
    setSelectedPlan(planId)
    navigate(`/billing/checkout?plan=${planId}`)
  }

  const savings = Math.round(
    PLANS.filter((p) => p.price.monthly > 0).reduce((acc, p) => acc + (p.price.monthly - p.price.annual), 0) / 2,
  )

  return (
    <div className="min-h-screen bg-zh-bg">
      {/* Header */}
      <div className="border-b border-zh-border px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-zh-muted hover:text-zh-text transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <div className="w-px h-5 bg-zh-border" />
        <span className="text-sm font-semibold text-zh-text">Plans & Pricing</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Choose your{' '}
            <span className="text-gradient-teal">creative plan</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zh-muted text-base max-w-lg mx-auto"
          >
            From solo creators to studio teams — ZeroHuman scales with your ambition.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-4 mt-8 bg-zh-card border border-zh-border rounded-full p-1"
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-zh-card2 border border-zh-border text-zh-text shadow-sm'
                  : 'text-zh-muted hover:text-zh-text'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-zh-card2 border border-zh-border text-zh-text shadow-sm'
                  : 'text-zh-muted hover:text-zh-text'
              }`}
            >
              Annual
              <span className="text-[10px] font-bold bg-zh-teal text-black px-1.5 py-0.5 rounded-full">
                Save ${savings}
              </span>
            </button>
          </motion.div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <PlanCard
                plan={plan}
                cycle={billingCycle}
                isCurrent={user?.plan === plan.id}
                onSelect={() => handleSelectPlan(plan.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Feature comparison table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-zh-card border border-zh-border rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-zh-border">
            <h2 className="text-base font-semibold text-zh-text">Full feature comparison</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zh-border">
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-zh-muted w-1/2">Feature</th>
                  {PLANS.map((p) => (
                    <th key={p.id} className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-zh-muted">
                      <span className={p.isPopular ? 'text-zh-teal' : ''}>{p.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zh-border/50">
                {/* Credits */}
                <TableRow label="AI Credits / month" values={PLANS.map((p) =>
                  typeof p.credits === 'number' ? `${p.credits.toLocaleString()}` : '∞ Unlimited'
                )} isPopular={[false, true, false]} />

                {/* Resolution */}
                <TableRow label="Max Resolution" values={PLANS.map((p) => p.resolution[p.resolution.length - 1])} isPopular={[false, true, false]} />

                {/* Max duration */}
                <TableRow label="Max Video Duration" values={PLANS.map((p) => `${p.limits.maxDuration}s`)} isPopular={[false, true, false]} />

                {/* Projects */}
                <TableRow label="Project Limit" values={['5', 'Unlimited', 'Unlimited']} isPopular={[false, true, false]} />

                {/* Features as checkmarks */}
                {[
                  { label: 'Watermark-free', values: [false, true, true] },
                  { label: 'Studio Editor', values: [false, true, true] },
                  { label: 'Voice Co-Director', values: [false, true, true] },
                  { label: 'Priority Generation', values: [false, true, true] },
                  { label: 'Custom Brand Kit', values: [false, false, true] },
                  { label: 'Team Workspace', values: [false, false, true] },
                  { label: 'API Access', values: [false, false, true] },
                  { label: 'White-label Exports', values: [false, false, true] },
                ].map(({ label, values }) => (
                  <tr key={label} className="hover:bg-zh-card2/50 transition-colors">
                    <td className="px-6 py-3 text-sm text-zh-muted">{label}</td>
                    {values.map((v, i) => (
                      <td key={i} className="px-4 py-3 text-center">
                        {typeof v === 'boolean' ? (
                          v ? (
                            <Check size={16} className="text-zh-teal mx-auto" />
                          ) : (
                            <X size={14} className="text-zh-subtle mx-auto" />
                          )
                        ) : (
                          <span className={`text-sm ${i === 1 ? 'text-zh-teal font-medium' : 'text-zh-text'}`}>{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <p className="text-sm text-zh-muted">
            Questions?{' '}
            <span className="text-zh-teal cursor-pointer hover:underline">Talk to sales</span>{' '}
            or{' '}
            <span className="text-zh-teal cursor-pointer hover:underline">read our FAQ</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function TableRow({
  label,
  values,
  isPopular,
}: {
  label: string
  values: string[]
  isPopular: boolean[]
}) {
  return (
    <tr className="hover:bg-zh-card2/50 transition-colors">
      <td className="px-6 py-3 text-sm text-zh-muted">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="px-4 py-3 text-center">
          <span className={`text-sm font-medium ${isPopular[i] ? 'text-zh-teal' : 'text-zh-text'}`}>{v}</span>
        </td>
      ))}
    </tr>
  )
}

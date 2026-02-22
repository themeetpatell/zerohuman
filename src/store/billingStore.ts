import { create } from 'zustand'
import { useAuthStore } from './authStore'

export type PlanId = 'free' | 'pro' | 'studio'
export type BillingCycle = 'monthly' | 'annual'

export interface Plan {
  id: PlanId
  name: string
  tagline: string
  price: { monthly: number; annual: number }
  credits: number | 'unlimited'
  resolution: string[]
  features: string[]
  limits: {
    videosPerMonth: number | 'unlimited'
    maxDuration: number
    teamSeats: number
  }
  isPopular?: boolean
  badge?: string
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Try ZeroHuman',
    price: { monthly: 0, annual: 0 },
    credits: 100,
    resolution: ['HD (1080p)'],
    features: [
      '100 AI credits / month',
      '1080p HD export',
      'Watermark on exports',
      '5 projects max',
      'Basic templates',
      'Community support',
    ],
    limits: { videosPerMonth: 5, maxDuration: 10, teamSeats: 1 },
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For creators & brands',
    price: { monthly: 29, annual: 23 },
    credits: 1000,
    resolution: ['HD (1080p)', '2K'],
    features: [
      '1000 AI credits / month',
      '2K export (no watermark)',
      'Unlimited projects',
      'Full Studio editor',
      'Voice Co-Director',
      'Priority generation',
      'All aspect ratios',
      'Email support',
    ],
    limits: { videosPerMonth: 50, maxDuration: 30, teamSeats: 1 },
    isPopular: true,
    badge: 'Most Popular',
  },
  {
    id: 'studio',
    name: 'Studio',
    tagline: 'For agencies & teams',
    price: { monthly: 99, annual: 79 },
    credits: 'unlimited',
    resolution: ['HD', '2K', '4K', '8K'],
    features: [
      'Unlimited AI credits',
      '4K + 8K export',
      'Custom brand kit',
      'Team workspace (5 seats)',
      'API access',
      'White-label exports',
      'Advanced analytics',
      'Dedicated account manager',
    ],
    limits: { videosPerMonth: 'unlimited', maxDuration: 60, teamSeats: 5 },
    badge: 'Best Value',
  },
]

interface BillingState {
  showCreditExhausted: boolean
  isUpgrading: boolean
  upgradeSuccess: boolean
  selectedPlan: PlanId | null
  billingCycle: BillingCycle

  setShowCreditExhausted: (val: boolean) => void
  setSelectedPlan: (id: PlanId) => void
  setBillingCycle: (cycle: BillingCycle) => void
  checkAndBlockGeneration: () => boolean
  upgradePlan: (planId: PlanId, cycle: BillingCycle, _paymentToken: string) => Promise<void>
  addCredits: (amount: number, cost: number) => Promise<void>
  clearUpgradeSuccess: () => void
}

export const useBillingStore = create<BillingState>((set, _get) => ({
  showCreditExhausted: false,
  isUpgrading: false,
  upgradeSuccess: false,
  selectedPlan: null,
  billingCycle: 'monthly',

  setShowCreditExhausted: (val) => set({ showCreditExhausted: val }),

  setSelectedPlan: (id) => set({ selectedPlan: id }),

  setBillingCycle: (cycle) => set({ billingCycle: cycle }),

  checkAndBlockGeneration: () => {
    const { user } = useAuthStore.getState()
    if (!user) return true
    if (user.credits <= 0) {
      set({ showCreditExhausted: true })
      return true
    }
    return false
  },

  upgradePlan: async (planId, _cycle, _paymentToken) => {
    set({ isUpgrading: true })
    await new Promise((r) => setTimeout(r, 2000))
    const plan = PLANS.find((p) => p.id === planId)
    if (!plan) { set({ isUpgrading: false }); return }

    const newCredits = plan.credits === 'unlimited' ? 9999 : plan.credits
    useAuthStore.getState().updateCredits(newCredits)

    const { user } = useAuthStore.getState()
    if (user) {
      useAuthStore.setState({ user: { ...user, plan: planId } })
    }
    set({ isUpgrading: false, upgradeSuccess: true, showCreditExhausted: false })
  },

  addCredits: async (amount, _cost) => {
    set({ isUpgrading: true })
    await new Promise((r) => setTimeout(r, 1500))
    useAuthStore.getState().updateCredits(amount)
    set({ isUpgrading: false, upgradeSuccess: true, showCreditExhausted: false })
  },

  clearUpgradeSuccess: () => set({ upgradeSuccess: false }),
}))

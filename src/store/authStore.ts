import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

type AuthStep = 'idle' | 'loading' | 'verify-email' | 'done'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  authStep: AuthStep
  resetEmailSent: boolean
  resetSuccess: boolean

  login: (email: string, password: string, remember?: boolean) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  verifyEmail: (code: string) => Promise<void>
  resendVerification: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  updateCredits: (delta: number) => void
  logout: () => void
  clearFlags: () => void
}

const MOCK_USER: User = {
  id: 'usr_01',
  name: 'Alex Rivera',
  email: 'alex@zerohuman.ai',
  avatar: undefined,
  plan: 'pro',
  credits: 850,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      authStep: 'idle',
      resetEmailSent: false,
      resetSuccess: false,

      login: async (email, _password, _remember = false) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 1200))
        set({
          user: { ...MOCK_USER, email },
          isAuthenticated: true,
          isLoading: false,
          authStep: 'done',
        })
      },

      register: async (name, email, _password) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 1000))
        set({
          user: { ...MOCK_USER, name, email, plan: 'free', credits: 100 },
          isLoading: false,
          authStep: 'verify-email',
        })
      },

      verifyEmail: async (code) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 900))
        // Accept '123456' or '000000' as valid codes in the demo
        if (code === '123456' || code === '000000') {
          set({ isAuthenticated: true, isLoading: false, authStep: 'done' })
        } else {
          set({ isLoading: false })
          throw new Error('Invalid code. Use 123456 to demo.')
        }
      },

      resendVerification: async () => {
        await new Promise((r) => setTimeout(r, 800))
      },

      forgotPassword: async (email) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 1300))
        console.info('Password reset email sent to:', email)
        set({ isLoading: false, resetEmailSent: true })
      },

      resetPassword: async (_token, _password) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 1100))
        set({ isLoading: false, resetSuccess: true })
      },

      updateCredits: (delta) => {
        const { user } = get()
        if (!user) return
        set({ user: { ...user, credits: Math.max(0, user.credits + delta) } })
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          authStep: 'idle',
          resetEmailSent: false,
          resetSuccess: false,
        })
      },

      clearFlags: () => {
        set({ resetEmailSent: false, resetSuccess: false, authStep: 'idle' })
      },
    }),
    {
      name: 'zh-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

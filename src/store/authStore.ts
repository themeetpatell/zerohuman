import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
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
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 1200))
        set({
          user: { ...MOCK_USER, email },
          isAuthenticated: true,
          isLoading: false,
        })
      },

      register: async (name: string, email: string, _password: string) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 1500))
        set({
          user: { ...MOCK_USER, name, email, plan: 'free', credits: 100 },
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
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

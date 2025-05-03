import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthService } from '../services/authService'

export type UserRole = 'STUDENT' | 'ADMINISTRATOR'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  refreshAttempted: boolean // Track if refresh has been attempted
  isAuthenticated: boolean
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  refreshToken: () => Promise<void>
  resetRefreshAttempt: () => void // Reset the refresh attempt flag
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      refreshAttempted: false,

      initialize: async () => {
        if (get().isAuthenticated) return

        const token = localStorage.getItem('authToken')
        if (!token) return

        set({ isLoading: true })
        try {
          const user = await AuthService.validateToken()
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          localStorage.removeItem('authToken')
          set({
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const { user, token } = await AuthService.login(email, password)
          set({
            user,
            token,
            isLoading: false,
            isAuthenticated: true,
            refreshAttempted: false, // Reset on successful login
          })
          return true
        } catch (error) {
          set({
            isLoading: false,
            isAuthenticated: false,
            error: error instanceof Error ? error.message : 'Login failed',
          })
          return false
        }
      },
      logout: () => {
        AuthService.logout()
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          refreshAttempted: false,
        })
      },
      refreshToken: async () => {
        // Prevent multiple refresh attempts in a single session
        if (get().refreshAttempted) {
          set({
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false,
          })
          return
        }

        set({ isLoading: true, refreshAttempted: true })
        try {
          const { token } = await AuthService.refreshToken()
          set({
            token,
            isLoading: false,
            isAuthenticated: true,
          })
        } catch (error) {
          set({
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false,
          })
        }
      },
      resetRefreshAttempt: () => {
        set({ refreshAttempted: false })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
)

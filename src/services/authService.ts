import type { User } from '../store/authStore'
import axios, { AxiosError } from 'axios'

import api, { handleApiError } from './api'

interface LoginResponse {
  user: User
  token: string
  refreshToken: string // Add refreshToken to the response type
}

interface RefreshTokenResponse {
  token: string
}

export const AuthService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log('Attempting login with:', { email })
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      })
      console.log('Login response:', response.data)

      // Store the refresh token in localStorage
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login error details:', {
          error: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        })
      } else {
        console.error('Unknown error during login:', error)
      }
      throw new Error(handleApiError(error))
    }
  },

  async validateToken(): Promise<User> {
    try {
      const response = await api.get('/auth/validate')
      return response.data.user
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      // Get the refresh token from localStorage
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await api.post<RefreshTokenResponse>(
        '/auth/refresh',
        {
          token: refreshToken,
        },
        {
          // Skip the auth interceptor to prevent infinite loops
          headers: {
            'Skip-Auth-Interceptor': 'true',
          },
        }
      )

      return response.data
    } catch (error) {
      // Clear tokens on refresh failure
      localStorage.removeItem('refreshToken')
      throw new Error(handleApiError(error))
    }
  },

  logout(): void {
    // Clear any client-side tokens
    localStorage.removeItem('refreshToken')
  },
}

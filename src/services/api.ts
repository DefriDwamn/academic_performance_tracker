import axios, { type AxiosError } from 'axios'

import { useAuthStore } from '../store/authStore'

const API_URL =
  import.meta.env.VITE_API_URL || 'https://academicperformancetracker-production.up.railway.app/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    const responseData = axiosError.response?.data as { message?: string } | undefined

    if (axiosError.response?.status === 500) {
      return 'Internal server error. Please try again later.'
    }

    return responseData?.message || axiosError.message || 'An error occurred'
  }

  return error instanceof Error ? error.message : 'An unknown error occurred'
}

export default api

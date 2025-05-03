import axios, { type AxiosError, type AxiosRequestConfig } from "axios"
import { useAuthStore } from "../store/authStore"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
  (error) => Promise.reject(error),
)

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
      headers?: Record<string, string>
    }

    // Skip refresh token logic if the request has this header
    if (originalRequest?.headers?.["Skip-Auth-Interceptor"]) {
      return Promise.reject(error)
    }

    // Only try to refresh the token once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Check if refresh has already been attempted in this session
        const { refreshAttempted } = useAuthStore.getState()
        if (refreshAttempted) {
          // If refresh was already attempted and failed, logout
          useAuthStore.getState().logout()
          return Promise.reject(error)
        }

        await useAuthStore.getState().refreshToken()
        const token = useAuthStore.getState().token

        if (token && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`
        }

        return api(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    const responseData = axiosError.response?.data as { message?: string } | undefined

    return responseData?.message || axiosError.message || "An error occurred"
  }

  return error instanceof Error ? error.message : "An unknown error occurred"
}

export default api

'use client'

import { type ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../../store/authStore'
import { Spinner, Center } from '@chakra-ui/react'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth/login', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    )
  }

  return isAuthenticated ? <>{children}</> : null
}

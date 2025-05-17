import type { ReactNode } from 'react'
import { useAuthStore } from '../../store/authStore'
import { NotAuthorized } from '../common/NotAuthorized'

interface RoleBasedRouteProps {
  studentComponent: ReactNode
  adminComponent: ReactNode
}

export const RoleBasedRoute = ({ studentComponent, adminComponent }: RoleBasedRouteProps) => {
  const { user } = useAuthStore()

  if (!user) {
    return null
  }

  if (user.role === 'STUDENT') {
    return <>{studentComponent}</>
  }

  if (user.role === 'ADMINISTRATOR') {
    return <>{adminComponent}</>
  }

  return <NotAuthorized />
}

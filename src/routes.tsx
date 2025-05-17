import { createBrowserRouter, Navigate, RouteObject } from 'react-router'
import { lazy, Suspense } from 'react'
import { Spinner, Center } from '@chakra-ui/react'

// Layouts
import RootLayout from './layouts/RootLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Auth Pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))

// Student Pages
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'))
const StudentGrades = lazy(() => import('./pages/student/Grades'))
const StudentAttendance = lazy(() => import('./pages/student/Attendance'))
const StudentAnalytics = lazy(() => import('./pages/student/Analytics'))
const StudentProfile = lazy(() => import('./pages/student/Profile'))

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminGrades = lazy(() => import('./pages/admin/Grades'))
const AdminAttendance = lazy(() => import('./pages/admin/Attendance'))
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'))
const AdminStudents = lazy(() => import('./pages/admin/Students'))

// Error Pages
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Auth Guards
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { RoleBasedRoute } from './components/auth/RoleBasedRoute'

const LoadingFallback = () => (
  <Center h="100vh">
    <Spinner size="xl" color="brand.500" thickness="4px" />
  </Center>
)

// Dashboard routes configuration
const dashboardRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <RoleBasedRoute studentComponent={<StudentDashboard />} adminComponent={<AdminDashboard />} />
    ),
  },
  {
    path: 'students',
    element: (
      <RoleBasedRoute
        studentComponent={<Navigate to="/dashboard" replace />}
        adminComponent={<AdminStudents />}
      />
    ),
  },
  {
    path: 'grades',
    element: (
      <RoleBasedRoute studentComponent={<StudentGrades />} adminComponent={<AdminGrades />} />
    ),
  },
  {
    path: 'attendance',
    element: (
      <RoleBasedRoute
        studentComponent={<StudentAttendance />}
        adminComponent={<AdminAttendance />}
      />
    ),
  },
  {
    path: 'analytics',
    element: (
      <RoleBasedRoute studentComponent={<StudentAnalytics />} adminComponent={<AdminAnalytics />} />
    ),
  },
  {
    path: 'profile',
    element: <StudentProfile />,
  },
]

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: 'auth',
          element: <AuthLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="login" replace />,
            },
            {
              path: 'login',
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <LoginPage />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: 'dashboard',
          element: (
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          ),
          children: dashboardRoutes,
        },
        {
          path: '*',
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <NotFoundPage />
            </Suspense>
          ),
        },
      ],
    },
  ],
  {
    future: {
      unstable_middleware: false,
    },
  }
)

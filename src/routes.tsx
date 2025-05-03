import { createBrowserRouter, Navigate } from "react-router-dom"
import { lazy, Suspense } from "react"
import { Spinner, Center } from "@chakra-ui/react"

// Layouts
import RootLayout from "./layouts/RootLayout"
import AuthLayout from "./layouts/AuthLayout"
import DashboardLayout from "./layouts/DashboardLayout"

// Auth Pages
const LoginPage = lazy(() => import("./pages/auth/LoginPage"))

// Student Pages
const StudentDashboard = lazy(() => import("./pages/student/Dashboard"))
const StudentGrades = lazy(() => import("./pages/student/Grades"))
const StudentAttendance = lazy(() => import("./pages/student/Attendance"))
const StudentAnalytics = lazy(() => import("./pages/student/Analytics"))
const StudentProfile = lazy(() => import("./pages/student/Profile"))

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"))
const AdminStudents = lazy(() => import("./pages/admin/Students"))
const AdminGrades = lazy(() => import("./pages/admin/Grades"))
const AdminAttendance = lazy(() => import("./pages/admin/Attendance"))
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"))

// Error Pages
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"))

// Auth Guards
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { RoleBasedRoute } from "./components/auth/RoleBasedRoute"

const LoadingFallback = () => (
  <Center h="100vh">
    <Spinner size="xl" color="brand.500" thickness="4px" />
  </Center>
)

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="login" replace />,
          },
          {
            path: "login",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <LoginPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <RoleBasedRoute studentComponent={<StudentDashboard />} adminComponent={<AdminDashboard />} />
              </Suspense>
            ),
          },
          {
            path: "grades",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <RoleBasedRoute studentComponent={<StudentGrades />} adminComponent={<AdminGrades />} />
              </Suspense>
            ),
          },
          {
            path: "attendance",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <RoleBasedRoute studentComponent={<StudentAttendance />} adminComponent={<AdminAttendance />} />
              </Suspense>
            ),
          },
          {
            path: "analytics",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <RoleBasedRoute studentComponent={<StudentAnalytics />} adminComponent={<AdminAnalytics />} />
              </Suspense>
            ),
          },
          {
            path: "profile",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <StudentProfile />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
])

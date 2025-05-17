import { create } from 'zustand'
import { AnalyticsService } from '../services/analyticsService'
import type { PerformanceMetrics, AttendanceStatistics, StudentReport } from '../types/analytics'

interface AnalyticsState {
  performanceMetrics: PerformanceMetrics | null
  attendanceStatistics: AttendanceStatistics | null
  studentReport: StudentReport | null
  isLoading: boolean
  error: string | null
  fetchPerformanceMetrics: () => Promise<void>
  fetchAttendanceStatistics: () => Promise<void>
  fetchStudentReport: (studentId: string) => Promise<void>
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  performanceMetrics: null,
  attendanceStatistics: null,
  studentReport: null,
  isLoading: false,
  error: null,
  fetchPerformanceMetrics: async () => {
    set({ isLoading: true, error: null })
    try {
      const metrics = await AnalyticsService.getPerformanceMetrics()
      set({ performanceMetrics: metrics, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch performance metrics',
      })
    }
  },
  fetchAttendanceStatistics: async () => {
    set({ isLoading: true, error: null })
    try {
      const statistics = await AnalyticsService.getAttendanceStatistics()
      set({ attendanceStatistics: statistics, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch attendance statistics',
      })
    }
  },
  fetchStudentReport: async (studentId) => {
    set({ isLoading: true, error: null })
    try {
      const report = await AnalyticsService.getStudentReport(studentId)
      set({ studentReport: report, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch student report',
      })
    }
  },
}))

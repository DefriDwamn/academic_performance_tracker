import { create } from 'zustand'

import { AnalyticsService } from '../services/analyticsService'
import type { PerformanceMetrics, AttendanceStatistics, StudentReport } from '../types/analytics'

interface AnalyticsState {
  performanceMetrics: PerformanceMetrics | null
  attendanceStatistics: AttendanceStatistics | null
  studentReport: StudentReport | null
  isLoadingPerformance: boolean
  isLoadingAttendance: boolean
  isLoadingStudent: boolean
  error: string | null
  fetchPerformanceMetrics: () => Promise<void>
  fetchAttendanceStatistics: () => Promise<void>
  fetchStudentReport: (studentId: string) => Promise<void>
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  performanceMetrics: null,
  attendanceStatistics: null,
  studentReport: null,
  isLoadingPerformance: false,
  isLoadingAttendance: false,
  isLoadingStudent: false,
  error: null,
  fetchPerformanceMetrics: async () => {
    set({ isLoadingPerformance: true, error: null })
    try {
      const metrics = await AnalyticsService.getPerformanceMetrics()
      set({ performanceMetrics: metrics, isLoadingPerformance: false })
    } catch (error) {
      set({
        isLoadingPerformance: false,
        error: error instanceof Error ? error.message : 'Failed to fetch performance metrics',
      })
    }
  },
  fetchAttendanceStatistics: async () => {
    set({ isLoadingAttendance: true, error: null })
    try {
      const statistics = await AnalyticsService.getAttendanceStatistics()
      set({ attendanceStatistics: statistics, isLoadingAttendance: false })
    } catch (error) {
      set({
        isLoadingAttendance: false,
        error: error instanceof Error ? error.message : 'Failed to fetch attendance statistics',
      })
    }
  },
  fetchStudentReport: async (studentId) => {
    set({ isLoadingStudent: true, error: null })
    try {
      const report = await AnalyticsService.getStudentReport(studentId)
      set({ studentReport: report, isLoadingStudent: false })
    } catch (error) {
      set({
        isLoadingStudent: false,
        error: error instanceof Error ? error.message : 'Failed to fetch student report',
      })
    }
  },
}))

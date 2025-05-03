import api, { handleApiError } from "./api"
import type { PerformanceMetrics, AttendanceStatistics, StudentReport } from "../types/analytics"

export const AnalyticsService = {
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      const response = await api.get<PerformanceMetrics>("/analytics/performance")
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getAttendanceStatistics(): Promise<AttendanceStatistics> {
    try {
      const response = await api.get<AttendanceStatistics>("/analytics/attendance")
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getStudentReport(studentId: string): Promise<StudentReport> {
    try {
      const response = await api.get<StudentReport>(`/analytics/student/${studentId}`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}

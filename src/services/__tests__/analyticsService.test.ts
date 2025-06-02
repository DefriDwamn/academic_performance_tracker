import { beforeEach, describe, expect, it, jest } from '@jest/globals'

import { AnalyticsService } from '../analyticsService'
import api, { handleApiError } from '../api'

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
  handleApiError: jest.fn((error: unknown) => (error as Error).message || 'Unknown error'),
}))

const mockApi = api as jest.Mocked<typeof api>
const mockHandleApiError = handleApiError as jest.MockedFunction<typeof handleApiError>

describe('AnalyticsService', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getPerformanceMetrics', () => {
    it('should fetch performance metrics successfully', async () => {
      // Mock data
      const mockMetrics = {
        averageGrade: 85,
        passingRate: 0.92,
        topPerformers: ['student1', 'student2'],
      }

      // Setup mock
      mockApi.get.mockResolvedValue({
        data: mockMetrics,
      })

      // Execute
      const result = await AnalyticsService.getPerformanceMetrics()

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/analytics/performance')
      expect(result).toEqual(mockMetrics)
    })

    it('should handle errors when fetching performance metrics', async () => {
      // Setup mock to throw error
      const errorMessage = 'Network error'
      const error = new Error(errorMessage)
      mockApi.get.mockRejectedValue(error)
      mockHandleApiError.mockReturnValue(errorMessage)

      // Execute and assert
      await expect(AnalyticsService.getPerformanceMetrics()).rejects.toThrow(errorMessage)
      expect(mockApi.get).toHaveBeenCalledWith('/analytics/performance')
    })
  })

  describe('getAttendanceStatistics', () => {
    it('should fetch attendance statistics successfully', async () => {
      // Mock data
      const mockStatistics = {
        averageAttendance: 0.88,
        absenteeRate: 0.12,
        mostMissedDays: ['Monday', 'Friday'],
      }

      // Setup mock
      mockApi.get.mockResolvedValue({
        data: mockStatistics,
      })

      // Execute
      const result = await AnalyticsService.getAttendanceStatistics()

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/analytics/attendance')
      expect(result).toEqual(mockStatistics)
    })

    it('should handle errors when fetching attendance statistics', async () => {
      // Setup mock to throw error
      const errorMessage = 'Network error'
      const error = new Error(errorMessage)
      mockApi.get.mockRejectedValue(error)
      mockHandleApiError.mockReturnValue(errorMessage)

      // Execute and assert
      await expect(AnalyticsService.getAttendanceStatistics()).rejects.toThrow(errorMessage)
      expect(mockApi.get).toHaveBeenCalledWith('/analytics/attendance')
    })
  })

  describe('getStudentReport', () => {
    it('should fetch student report successfully', async () => {
      // Mock data
      const studentId = 'student123'
      const mockReport = {
        studentId: 'student123',
        overallGrade: 92,
        attendanceRate: 0.95,
        strengths: ['Math', 'Science'],
        weaknesses: ['History'],
      }

      // Setup mock
      mockApi.get.mockResolvedValue({
        data: mockReport,
      })

      // Execute
      const result = await AnalyticsService.getStudentReport(studentId)

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith(`/analytics/student/${studentId}`)
      expect(result).toEqual(mockReport)
    })

    it('should handle errors when fetching student report', async () => {
      // Setup mock to throw error
      const studentId = 'student123'
      const errorMessage = 'Network error'
      const error = new Error(errorMessage)
      mockApi.get.mockRejectedValue(error)
      mockHandleApiError.mockReturnValue(errorMessage)

      // Execute and assert
      await expect(AnalyticsService.getStudentReport(studentId)).rejects.toThrow(errorMessage)
      expect(mockApi.get).toHaveBeenCalledWith(`/analytics/student/${studentId}`)
    })
  })
})
